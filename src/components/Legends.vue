<template>
    <svg :height="height" :width="width">
        <g v-for="(interactionLegend,interactionLegendIndex) in interactionLegendList" :key=interactionLegendIndex>
            <rect v-if="interactionLegend.shape=='rect'" :x=interactionLegend.x :y=interactionLegend.y :style="'fill:' + interactionLegend.color"
                :width=interactionLegend.width :height=interactionLegend.height></rect>
            <circle v-else-if="interactionLegend.shape=='circle'" :cx=(interactionLegend.x+interactionLegend.width/2) :cy="interactionLegend.y+interactionLegend.width/2" 
                :style="'fill:' + interactionLegend.color"
                :r=interactionLegend.width/2></circle>
            <path v-else-if="interactionLegend.shape=='diamond'"
                :transform="'translate('+(interactionLegend.x+interactionLegend.width/2)+','+ (interactionLegend.y+interactionLegend.width/2)+') scale(1.5)'"
                :style="'fill:' + interactionLegend.color"
                :d=diamondSymbol></path>
            <path v-else-if="interactionLegend.shape=='wye'"
                :transform="'translate('+(interactionLegend.x+interactionLegend.width/2)+','+ (interactionLegend.y+interactionLegend.width/2)+')  scale(1.5)'"
                :style="'fill:' + interactionLegend.color"
                :d=wyeSymbol></path>
            <path v-else-if="interactionLegend.shape=='wye_r'"
                :transform="'translate('+(interactionLegend.x+interactionLegend.width/2)+','+ (interactionLegend.y+interactionLegend.width/2)+')  scale(1.5) rotate(180)'"
                :style="'fill:' + interactionLegend.color"
                :d=wyeSymbol></path>
            <path v-else-if="interactionLegend.shape=='triangle'"
                :transform="'translate('+(interactionLegend.x+interactionLegend.width/2)+','+ (interactionLegend.y+interactionLegend.width/1.5)+') scale(2) '"
                :style="'fill:' + interactionLegend.color"
                :d=triangleSymbol></path>
            <path v-else-if="interactionLegend.shape=='triangle_r'"
                :transform="'translate('+(interactionLegend.x+interactionLegend.width/2)+','+ (interactionLegend.y+interactionLegend.width/3)+') scale(2) rotate(180)'"
                :style="'fill:' + interactionLegend.color"
                :d=triangleSymbol></path>
            <text :x="interactionLegend.x+25" :y="interactionLegend.y+13" style="font-size: 11">{{interactionLegend.name}}</text>
        </g>
    </svg>
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
                interactionLegend.y = 0;
                interactionLegend.x =  (component.width/component.interactionLegendList.length) 
                                        * interactionLegendIndex;
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