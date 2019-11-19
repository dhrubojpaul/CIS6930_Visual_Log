<template>
        <v-row style="margin-left:3vw">
            <v-col cols=2 style="height:30px;padding:0;" v-for="(interactionLegend,interactionLegendIndex) in interactionLegendList" :key=interactionLegendIndex>
                <svg width=100% height=30px>
                    <rect v-if="interactionLegend.shape=='rect'" x=10 y=5 :style="'fill:' + interactionLegend.color"
                        :width=interactionLegend.width :height=interactionLegend.height></rect>
                    <circle v-else-if="interactionLegend.shape=='circle'" :cx=(10+interactionLegend.width/2) :cy="5+interactionLegend.width/2" 
                        :style="'fill:' + interactionLegend.color"
                        :r=interactionLegend.width/2></circle>
                    <path v-else-if="interactionLegend.shape=='diamond'"
                        transform="translate(10,16) scale(1.3)"
                        :style="'fill:' + interactionLegend.color"
                        :d=diamondSymbol></path>
                    <path v-else-if="interactionLegend.shape=='wye'"
                        transform="translate(20,16)  scale(1.5)" :style="'fill:' + interactionLegend.color" :d=wyeSymbol></path>
                    <path v-else-if="interactionLegend.shape=='wye_r'"
                        transform="translate(20,16)  scale(1.5) rotate(180)" :style="'fill:' + interactionLegend.color" :d=wyeSymbol></path>
                    <path v-else-if="interactionLegend.shape=='triangle'"
                        transform="translate(10,16) scale(1.5)"
                        :style="'fill:' + interactionLegend.color"
                        :d=triangleSymbol></path>
                    <path v-else-if="interactionLegend.shape=='triangle_r'"
                        transform="translate(20,13) scale(1.5) rotate(180)"
                        :style="'fill:' + interactionLegend.color"
                        :d=triangleSymbol></path>
                    <text x="35" y="20" style="font-size: 11">{{interactionLegend.name}}</text>
                </svg>
            </v-col>
        </v-row>
</template>

<script>
import InteractionType from "../data/interactionType";
import * as d3 from 'd3';

export default {
    data() {
        return {
            interactionLegendList: [],
            diamondSymbol: d3.symbol().type(d3.symbolDiamond)(),
            triangleSymbol: d3.symbol().type(d3.symbolTriangle)(),
            wyeSymbol: d3.symbol().type(d3.symbolWye)(),
        }
    },
    props: ["height", "width"],
    methods: {
        resizeWithWindow: function(){        
            var component = this;
            component.interactionLegendList.forEach(function(interactionLegend, interactionLegendIndex){
                interactionLegend.width = 20;
                interactionLegend.height = 20;
                interactionLegend.y = interactionLegendIndex<6 ? 0: 30;
                interactionLegend.x =  interactionLegendIndex < 6 ? component.width/6 * interactionLegendIndex 
                                        : component.width/6 * (interactionLegendIndex-6) ;
            });
        },
    },
    watch: {
        width : function(){
            this.resizeWithWindow();
        }
    },
    mounted() {
        var component = this;
            Object.keys(InteractionType.types).forEach(function(interactionTypeKey){
            if(!InteractionType.types[interactionTypeKey].disabled){
                component.interactionLegendList.push(InteractionType.types[interactionTypeKey]);
            }
        });
        this.resizeWithWindow();
    }
}
</script>