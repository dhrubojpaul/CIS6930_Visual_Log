<template>
    <v-row no-gutters>
      <v-col cols=9>
        <v-row no-gutters>
          <legends :width=configuration.size.svgWidth></legends>
          <svg :height="configuration.size.svgHeight" :width="configuration.size.svgWidth">
            <g v-for="(user,userIndex) in users" :key=userIndex>
              <g><text :x=user.x :y=user.y style="font-size: 14">{{user.name}}</text></g>
              <g v-for="(segment,segmentIndex) in user.segments" :key=segmentIndex>
                <g v-for="(interactionType,interactionTypeIndex) in segment.interactionTypes" :key=interactionTypeIndex>
                  <rect :x=interactionType.x :y=interactionType.y :style="'fill:' + interactionType.color"
                    :width=interactionType.width :height=interactionType.height
                    @dblclick="goToInteractionView(user, segment)"
                    @click="toggleTimeLockFlag(user,segment)"
                    @mouseover="selectTimeSegment(user, segment)"></rect>
                </g>
              </g>
            </g>
            <rect :x="selectedIndicator.left" :y=selectedIndicator.y width=3 :height=selectedIndicator.height style="fill:#666666"></rect>
            <rect :x="selectedIndicator.right" :y=selectedIndicator.y width=3 :height=selectedIndicator.height style="fill:#666666"></rect>
          </svg>
          <svg :height="configuration.size.svgHeight/12" :width="configuration.size.svgWidth+20">
            <line :x1="configuration.size.segmentsLeftPadding" y1="0" 
                  :x2="configuration.size.svgWidth" y2="0" style="stroke:rgb(100,100,100);stroke-width:5"/>
            <g v-for="i in 11" :key=i>
              <line :x1="((configuration.size.svgWidth-configuration.size.segmentsLeftPadding)/10*(i-1)) + configuration.size.segmentsLeftPadding" y1="0" 
                    :x2="((configuration.size.svgWidth-configuration.size.segmentsLeftPadding)/10*(i-1)) + configuration.size.segmentsLeftPadding" y2="10" 
                    style="stroke:rgb(100,100,100);stroke-width:2"/>
              <text :x="((configuration.size.svgWidth-configuration.size.segmentsLeftPadding)/10*(i-1)) + configuration.size.segmentsLeftPadding - 20" y="20" style="font-size: 11">
                {{parseInt((datasetEndTime/10*(i-1)/10)/60) + "m" + parseInt((datasetEndTime/10*(i-1)/10)%60) + "s"}}
              </text>
            </g>
          </svg>
          <svg height=20 :width="configuration.size.svgWidth+20">
            <text :x=configuration.size.svgWidth/2 y=10 style="font-size: 11">Time</text>
          </svg>
        </v-row>
      </v-col>
      <v-col cols=3>
        <v-row no-gutters>
          <v-col cols=12>
            <wordlist :resizewatcher=configuration.size.svgWidth :lock=timeLockFlag></wordlist>
            <v-btn @click="goToInteractionView(lockedItem.user, lockedItem.segment)" v-if=timeLockFlag block dark color=green style="margin-top:20px" height=40><v-icon>mdi-magnify</v-icon>Explore this segment</v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
</template>

<script>
import wordlist from "../components/WordList";
import legends from "../components/Legends";

export default {
  components: {
    wordlist,
    legends
  },
  data: function() {
    return {
      configuration: {
        size: {
          svgWidth : 0,
          svgHeight : 0,
          segmentsLeftPadding : 0,
        }
      },
      users: [],
      timeLockFlag: false,
      selectedIndicator: {},
      lockedItem:{user:{},segment:{}}
    };
  },
  watch: {
    selectedUsers: {
      deep: true,
      handler: function(value){
        this.users = value && value.length>0 ? value.slice(0,value.length) : [];
        this.calculateAttributesForSegments();
      }
    },
  },
  computed: {
    selected: function(){
      return this.$store.state.selected;
    },
    selectedUsers: function(){
      return this.$store.state.selectedUsers;
    },
    datasetEndTime: function(){
      return this.$store.state.datasetEndTime;
    }
  },
  methods: {
    toggleTimeLockFlag: function(user,segment){
      this.timeLockFlag = !this.timeLockFlag;
      this.showSnack(this.timeLockFlag ? "Segment Locked" : "Segment Unlocked");
      this.lockedItem.user = user;
      this.lockedItem.segment = segment;
    },
    selectTimeSegment(user,segment){
      var hoveredUserID = this.selected.userID;
      if(!this.timeLockFlag){
        this.$store.commit("setTime", {min:0,max:user.endTime,range:[segment.start*10, segment.end*10]});
        hoveredUserID = user.id;
      }
      this.$store.commit("setSelected", {
        datasetID: this.selected.datasetID,
        userID: hoveredUserID,
        users: this.selected.users,
        interactionTypes: this.selected.interactionTypes
      });

      if(!this.timeLockFlag){
        var selectedTimeline = this.$store.state.timeline,
          left = 0,
          right = 0,
          y=0,
          height = this.configuration.size.svgHeight/this.users.length/1.2,
          selectedUserID = this.selected.userID;

        left = selectedTimeline.range[0]/this.datasetEndTime*(this.configuration.size.svgWidth - this.configuration.size.segmentsLeftPadding);
        right = selectedTimeline.range[1]/this.datasetEndTime*(this.configuration.size.svgWidth - this.configuration.size.segmentsLeftPadding);

        left += this.configuration.size.segmentsLeftPadding - 1.5;
        right += this.configuration.size.segmentsLeftPadding - 1.5;

        var selectedUser = this.users.find(function(user){return user.id == selectedUserID});

        left = selectedUser? left : -500;
        right = selectedUser? right : -500;
        y = selectedUser ? selectedUser.y -height/2: -500;
        this.selectedIndicator = {left,right,height,y};
      }
    },
    findSimilarities(){
      this.showSnack("Feature under development");
    },
    showSnack: function(text, isPersistent){
      this.$store.commit("showSnack", text, isPersistent);
    },
    resizeWithWindow: function(){
      this.configuration.size.svgWidth = window.innerWidth * 0.55;
      this.configuration.size.svgHeight = window.innerHeight * 0.7;
      this.configuration.size.segmentsLeftPadding = window.innerWidth * 0.06;
      this.calculateAttributesForSegments();
    },
    goToInteractionView: function(user, segment){
      this.$store.commit("setSelected", {
        datasetID: this.selected.datasetID,
        userID: user.id,
        users: this.selected.users,
        interactionTypes: this.selected.interactionTypes
      });
      this.$store.commit("setTime", {min:0,max:user.endTime,range:[segment.start*10, segment.end*10]});
      this.$router.push('timeline');
    },
    calculateAttributesForSegments: function() {
      var userCount = this.users.length,
          size = this.configuration.size;

      this.users.forEach(function(user, userIndex) {
        var segmentOuterHeight = size.svgHeight / userCount,
            segmentInnerHeight = segmentOuterHeight / 1.2,
            totalLengthForUser = (size.svgWidth - size.segmentsLeftPadding) * user.weight,
            cumulativeSegmentOffset = size.segmentsLeftPadding;
        
        user.x = size.segmentsLeftPadding/5;
        user.y = segmentOuterHeight * userIndex + segmentInnerHeight / 2;

        user.segments.forEach(function(segment) {
          var segmentWidth = totalLengthForUser * segment.weight,
              segmentOffset = cumulativeSegmentOffset;

          cumulativeSegmentOffset += segmentWidth;

          var cumulativeInteractionHeight = 0;
          Object.keys(segment.interactionTypes).forEach(function(interactionTypeName) {
            segment.interactionTypes[interactionTypeName];
            segment.interactionTypes[interactionTypeName].width = segmentWidth;
            segment.interactionTypes[interactionTypeName].height = (segment.interactionTypes[interactionTypeName].weight / 100) * segmentInnerHeight;
            segment.interactionTypes[interactionTypeName].x = segmentOffset;
            segment.interactionTypes[interactionTypeName].y = segmentOuterHeight * userIndex + cumulativeInteractionHeight;
            cumulativeInteractionHeight += segment.interactionTypes[interactionTypeName].height;

            segment.interactionTypes[interactionTypeName].name = interactionTypeName;
            segment.interactionTypes[interactionTypeName].popupFlag = false;
          });
        });
      });
    },
    
    
  },
  mounted() {
    this.resizeWithWindow();
    window.onresize = this.resizeWithWindow;
    this.$store.commit("setDrawer", true);

    if(this.$store.state.selectedUsers){
      this.users = this.$store.state.selectedUsers.slice(0,this.$store.state.selectedUsers.length);
      this.calculateAttributesForSegments();
    }
  }
};

</script>

