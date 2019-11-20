<template>
    <v-card>
        <v-row>
      <v-col cols=12>
          <v-range-slider style="padding-left:10px;padding-right:10px" v-model="timeline.range" :max="timeline.max" :min="timeline.min"
            hide-details class="align-center">
            <template v-slot:prepend>
                <p >
                    {{parseInt((timeline.range[0]/10)/60) + "m" + parseInt((timeline.range[0]/10)%60) + "s"}}</p>
            </template>
            <template v-slot:append>
                <p>
                    {{parseInt((timeline.range[1]/10)/60) + "m" + parseInt((timeline.range[1]/10)%60) + "s"}}</p>
            </template>
        </v-range-slider>
      </v-col>
      <v-col cols=12>
          <svg :width="size.width+2" :height="size.height+6" :style="'margin-left:'+size.width*.02">
            <g v-for="(segment,segmentIndex) in user.segments" :key=segmentIndex>
                <g v-for="(interactionType,interactionTypeIndex) in segment.interactionTypes" :key=interactionTypeIndex>
                    <rect :x=interactionType.x :y=interactionType.y+3 :style="'fill:' + interactionType.color"
                    :width=interactionType.width :height=interactionType.height
                    @click="snapIntoSegment(segment)"></rect>
                </g>
            </g>
            <rect :x="timeline.range[0]/timeline.max*size.width+1.5" width=3 :height=size.height+6 style="fill:#666666"></rect>
            <rect :x="timeline.range[1]/timeline.max*size.width-1.5" width=3 :height=size.height+6 style="fill:#666666"></rect>
          </svg>
      </v-col>
    </v-row>
    </v-card>
</template>

<script>
export default {
    name: 'timepicker',
    data: function () {
        return {
            timeline: {
                min: 0, max: 55000, range: [0, 2000]
            },
            size: {
                width : 0, height : 0
            },
            user: {},
        }
    },
    props: ["resizewatcher"],
    watch: {
        timeline: {
            deep: true,
            handler: function(value) {
                this.$store.commit("setTime", value);
                console.log(this.$refs);
            }
        },
        timelineFromState: {
            deep: true,
            handler: function(value) {
                if(value.max != this.timeline.max){
                    this.timeline.max = value.max;
                }
            }
        },
        resizewatcher: function(){
            this.resizeWithWindow();
        },
        selectedUser: {
            deep: true,
            handler: function(value){
                this.user = value;
                this.calculateAttributesForSegments();
            }
        },
    },
    computed: {
        timelineFromState: function(){
            return this.$store.state.timeline;
        },
        selectedUser: function(){
            return this.$store.state.selectedUser;
        }
    },
    methods: {
        resizeWithWindow: function(){
            this.size.width = window.innerWidth * 0.6;
            this.size.height = window.innerHeight * 0.07;
            this.size.leftPad = 1.5;
            this.calculateAttributesForSegments();
        },
        snapIntoSegment: function(segment){
            this.timeline.range = [parseFloat(segment.start)*10, parseFloat(segment.end)*10];
        },
        calculateAttributesForSegments: function() {
            var component = this,
                cumulativeSegmentOffset = this.size.leftPad;
                
            this.user.segments.forEach(function(segment) {
                var segmentWidth = component.size.width * segment.weight,
                    segmentOffset = cumulativeSegmentOffset;

                cumulativeSegmentOffset += segmentWidth;

                var cumulativeInteractionHeight = 0;
                Object.keys(segment.interactionTypes).forEach(function(interactionTypeName) {
                    segment.interactionTypes[interactionTypeName].width = segmentWidth;
                    segment.interactionTypes[interactionTypeName].height = (segment.interactionTypes[interactionTypeName].weight / 100) * component.size.height;
                    segment.interactionTypes[interactionTypeName].x = segmentOffset;
                    segment.interactionTypes[interactionTypeName].y = cumulativeInteractionHeight;
                    cumulativeInteractionHeight += segment.interactionTypes[interactionTypeName].height;

                    segment.interactionTypes[interactionTypeName].name = interactionTypeName;
                });
            });
        },
        //
    },
    mounted() {
        this.timeline = this.$store.state.timeline;
        this.user = this.$store.state.selectedUser;
        this.resizeWithWindow();
    }
};
</script>