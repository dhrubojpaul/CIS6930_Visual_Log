<template>
    <v-card>
      <div class="tooltip"></div>
      <div id="chartDiv"></div>
    </v-card>
</template>

<script>
import * as d3 from 'd3';
import LegendValues from "../data/legendValues";

export default {
  mounted() {
    this.resizeWithWindow();
  },
  props: ["resizewatcher"],
  watch : {
    interactionViewDataFromState: {
      deep: true,
      handler: function(value) {
        if(this.timelineFromState){
          this.update(this.timelineFromState, value, this.interactionTypeListFromState);
        }
      }
    },
    timelineFromState: {
      deep: true,
      handler: function(value){
        if(this.interactionViewDataFromState){
          this.update(value, this.interactionViewDataFromState, this.interactionTypeListFromState);
        }
      }
    },
    resizewatcher: function(){
      this.resizeWithWindow();
    }
  },
  computed: {
    interactionViewDataFromState: function(){
      return this.$store.state.interactionViewData;
    },
    timelineFromState: function(){
      return this.$store.state.timeline;
    },
    interactionTypeListFromState: function(){
      return this.$store.state.selectedInteractionTypes || {};
    },
  },
  data: function () {
    return {
      size: {
        svg: {width: 0, height: 0},
        chart: {width: 0, height: 0},
        margin: {top: 10, right: 10, bottom: 100, left: 50}
      },
      meta: {axis: {xLabel: "time",yLabel: "documents"}},
      chart: undefined,
	  transition: undefined,
	  glyphs: {
		  think:undefined,
		  open:undefined,
		  read:undefined,
		  search:undefined,
		  highlight:undefined,
		  connection:undefined,
		  move:undefined,
		  hover:undefined,
		  cNode:undefined,
		  aNote:undefined,
		  topic:undefined
	  }
    }
  },
  methods: {
    initializeVariables: function() {
      this.size.svg.width = window.innerWidth*0.5;
      this.size.svg.height = window.innerHeight*0.51;
      this.size.chart.width = this.size.svg.width - this.size.margin.left - this.size.margin.right;
      this.size.chart.height = this.size.svg.height - this.size.margin.top - this.size.margin.bottom;
    },
    initializeChart: function () {
      this.chart = d3.select("#chartDiv")
        .append("svg")
        .attr("width", this.size.svg.width)
        .attr("height", this.size.svg.height);
      this.chart.plotArea = this.chart.append("g")
        .attr("transform", "translate(" + this.size.margin.left + "," + this.size.margin.top + ")");
    },
    resizeWithWindow: function(){
      document.getElementById("chartDiv").innerHTML = "";
      this.initializeVariables();
      this.initializeChart();
      this.update(this.timelineFromState, this.interactionViewDataFromState, this.interactionTypeListFromState);
    },
    update: function(timeline, interactionViewData, interactionTypeList){
      this.updateAxis(timeline, interactionViewData);
      this.updateChart(interactionViewData, timeline, interactionTypeList);
    },
    formatAsTime: function(seconds) { 
      var hoursFormat = String(Math.floor(seconds / 3600)).padStart(2, '0')
      var minutesFormat = String(Math.floor((seconds / 60)) % 60).padStart(2, '0')
      var secondsFormat = String(Math.floor(seconds % 60)).padStart(2, '0')
      
      var formattedTime = hoursFormat + ":" + minutesFormat + ":" + secondsFormat;
      return formattedTime; 
    },
    updateAxis: function (t, d) {
      this.chart.selectAll(".axis").remove();

      // x axis
      this.chart.xScale = d3.scaleLinear()
        .domain([t.range[0], t.range[1]])
        .range([100, this.size.chart.width]);

      this.chart.xAxis = d3.axisBottom()
        .tickSizeOuter(0)
        .scale(this.chart.xScale);

      this.chart.xAxisContainer = this.chart.append("g")
        .attr("class", "x axis scatter-xaxis")
        .attr("transform", "translate(" + (this.size.margin.left) + ", " + (this.size.chart.height + this.size.margin.top) + ")")
        .call(this.chart.xAxis);

      // x axis header label
      this.chart.append("text")
        .attr("class", "x axis scatter-xaxis")
        .style("font-size", "12px")
        .attr("text-anchor", "middle")
        .attr("transform", "translate(" + (this.size.margin.left + this.size.chart.width / 2.0) + ", " + (this.size.chart.height + (this.size.margin.bottom / 2.0)) + ")")
        .text(this.meta.axis.xLabel);

      let labels = [];
      for (var i = 0; i < d.DOC_OPEN.length; i++) {
        labels = labels.concat(d.DOC_OPEN[i].ID);
      }
      //remove Duplicates
      var uniqueLabels = labels.reduce((unique, item) => {
        // console.log(item, unique, unique.includes(item), unique.includes(item) ?  unique : [...unique, item]); 
        return unique.includes(item) ? unique : [...unique, item]
      }, []);

      uniqueLabels.unshift("0");

      //Too many labels shown when we just use scaleBand() by default. maybe we should limit this to 10 later

      this.chart.yScale = d3.scaleBand()
        .domain(uniqueLabels)
        .range([0, this.size.chart.height]);

      this.chart.yAxis = d3.axisLeft()
        .scale(this.chart.yScale);

      this.chart.yAxisContainer = this.chart.append("g")
        .attr("class", "y axis scatter-yaxis")
        .attr("transform", "translate(" + (this.size.margin.left + 100) + ", " + this.size.margin.top + ")")
        .call(this.chart.yAxis);

      // y axis header label
      this.chart.append('text')
        .style("font-size", "12px")
        .attr("class", "y axis scatter-yaxis")
        .attr("text-anchor", "middle")
        .attr("transform", "translate(" + (this.size.margin.left / 2.0) + ", " + (this.size.chart.height / 2.0) + ") rotate(-90)")
        .text(this.meta.axis.yLabel);
    },




    
    updateChart: function (interactionViewData, timeline, interactionTypeList) {
		var component = this;
		var tooltipDiv = d3.select(".tooltip")
		var tooltipOffset = [0, -40]
		if (interactionTypeList.THINK_ALOUD) {
			component.glyphs.think = component.chart.plotArea.selectAll("." + LegendValues.THINK_ALOUD.class)
				.data(interactionViewData.THINK_ALOUD)
				.join(
					enter => enter.append('path')
					.attr("class", LegendValues.THINK_ALOUD.class)
					.attr("d", d3.symbol().type(d3.symbolTriangle).size(function (){ return component.chart.yScale.bandwidth()*10;}))
						.attr("transform", function(d) {
							return "translate(" + component.chart.xScale(d.time)+", "+(component.chart.yScale(d.ID)+component.size.margin.top/2)+") rotate (180)";
						})
					.on("mouseover", function (d) {
						d3.select (this).attr("fill","red");
						tooltipDiv.attr("class", "tooltip " + LegendValues.THINK_ALOUD.classTT)
							.transition()
								.style("left", (d3.event.pageX + tooltipOffset[0]) + "px")		
								.style("top", (d3.event.pageY + tooltipOffset[1]) + "px")
								.delay(10).duration(10)
								.transition().duration(200)		
								.style("opacity", 0.9)
								.text("Think Aloud: "+ component.formatAsTime(d.time / 10)+" \""+d.Text+"\"");	
					})					
					.on("mouseout", function() {	
						tooltipDiv.transition()		
							.duration(500)		
							.style("opacity", 0);	
					})
					.call(enter => enter.transition(component.transition)
						.attr("d", d3.symbol().type(d3.symbolTriangle).size(function (){ return component.chart.yScale.bandwidth()*10;}))
						.attr("transform", function(d) {
							component.chart.yScale.bandwidth()
							return "translate(" + component.chart.xScale(d.time)+", "+(component.chart.yScale(d.ID)+component.size.margin.top/2)+") rotate (180)";
						})
					),
					update => update
						.call(exit => exit.transition(component.transition)
							.attr("d", d3.symbol().type(d3.symbolTriangle).size(function (){ return component.chart.yScale.bandwidth()*10;}))
							.attr("transform", function(d) {
								component.chart.yScale.bandwidth()
								return "translate(" + component.chart.xScale(d.time)+", "+(component.chart.yScale(d.ID)+component.size.margin.top/2)+") rotate (180)";
							})
						),
					exit => exit.remove()
				)
		} else {
			if(component.glyphs.think) component.glyphs.think.remove();
		}
		
		if (interactionTypeList.DOC_OPEN) {
			component.glyphs.open = component.chart.plotArea.selectAll("." + LegendValues.DOC_OPEN.class)
				.data(interactionViewData.DOC_OPEN)
				.join(
					enter => enter.append('rect')
					.attr("class", LegendValues.DOC_OPEN.class)
					.attr("width", function () {
						return 0;
					})
					.attr("height", function () {
						return 0;
					})
					.attr("x", function (d) {
						if (d.time < timeline.range[0]) {
							return component.chart.xScale(timeline.range[0]);
						} else {
							return component.chart.xScale(d.time);
						}
					})
					.attr("y", function (d) {
						return component.chart.yScale(d.ID) + component.chart.yScale.bandwidth() * .3;
					})
					.on("click", function(d){
						component.$store.commit("setCurrentDocument", d.ID);
						component.$store.commit("setSheetFlag", true);
					})
					.on("mouseover", function (d) {
						d3.select (this).attr("fill","red");
						tooltipDiv.attr("class", "tooltip " + LegendValues.DOC_OPEN.classTT)
							.transition()
								.style("left", (d3.event.pageX + tooltipOffset[0]) + "px")		
								.style("top", (d3.event.pageY + tooltipOffset[1]) + "px")
								.delay(10).duration(10)
								.transition().duration(200)		
								.style("opacity", 0.9)
								.text("Document Open: "+d.Text+"\nfrom: "+ component.formatAsTime(d.time / 10)+"\ntill: "+ component.formatAsTime((d.time+d.duration) / 10)+"\nDur: "+(d.duration *10) +"ms");	
					})					
					.on("mouseout", function() {	
						tooltipDiv.transition()		
							.duration(500)		
							.style("opacity", 0);	
					})
					.call(enter => enter.transition(component.transition)
						.attr("width", function (d) {
							var length = d.duration;
							if (d.duration > (timeline.range[1] - timeline.range[0])) {
								length = (timeline.range[1] - timeline.range[0])
							} else {
								if (d.time < timeline.range[0]) {
									length = (d.time + d.duration) - timeline.range[0]
								}
							}
							return component.chart.xScale(timeline.range[0] + length) - 100;
						})
						.attr("height", function () {
							return component.chart.yScale.bandwidth() * .4;
						})
					),
					update => update
						.call(exit => exit.transition(component.transition)
							.attr("width", function (d) {
								var length = d.duration;
								if (d.duration > (timeline.range[1] - timeline.range[0])) {
									length = (timeline.range[1] - timeline.range[0])
								} else {
									if (d.time < timeline.range[0]) {
										length = (d.time + d.duration) - timeline.range[0]
									}
								}
								return component.chart.xScale(timeline.range[0] + length) - 100;
							})
							.attr("height", function () {
								return component.chart.yScale.bandwidth() * .4;
							})
							.attr("x", function (d) {
								if (d.time < timeline.range[0]) {
									return component.chart.xScale(timeline.range[0]);
								} else {
									return component.chart.xScale(d.time);
								}
							})
							.attr("y", function (d) {
								return component.chart.yScale(d.ID) + component.chart.yScale.bandwidth() * .3;
							})),
					exit => exit.remove()
				)
		} else {
			if(component.glyphs.open) component.glyphs.open.remove();
		}

		if (interactionTypeList.READING) {
			component.glyphs.read = component.chart.plotArea.selectAll("." + LegendValues.READING.class)
				.data(interactionViewData.READING, function (d) {
					return d ? d.ID : this.id;
				})
				.join(
					enter => enter.append('rect')
						.attr("class", LegendValues.READING.class)
						.attr("width", function () {
							return 0;
						})
						.attr("height", function () {
							return 0;
						})
						.attr("x", function (d) {
							if (d.time < timeline.range[0]) {
								return component.chart.xScale(timeline.range[0]);
							} else {
								return component.chart.xScale(d.time);
							}
						})
						.attr("y", function (d) {
							return component.chart.yScale(d.ID)+ component.chart.yScale.bandwidth()*.1;
						})
						.on("mouseover", function (d) {
							tooltipDiv.attr("class", "tooltip " + LegendValues.READING.classTT)
								.transition()	
									.style("left", (d3.event.pageX + tooltipOffset[0]) + "px")		
									.style("top", (d3.event.pageY + tooltipOffset[1]) + "px")
									.delay(10).duration(10)
									.transition().duration(200)		
									.style("opacity", .9)
									.text("Mouseover: "+d.Text+"\nfrom: "+ component.formatAsTime(d.time / 10)+"\ntill: "+ component.formatAsTime((d.time+d.duration) / 10)+"\nDur: "+(d.duration*10)+"ms");	
						})					
						.on("mouseout", function() {
							tooltipDiv.transition()		
								.duration(500)		
								.style("opacity", 0);	
						})
						.call(exit => exit.transition(component.transition)
							.attr("width", function (d) {
								return component.chart.xScale(timeline.range[0] + d.duration) - 100;
							})
							.attr("height", function () {
								return component.chart.yScale.bandwidth() * .8;
							})),
					update => update
						.call(exit => exit.transition(component.transition)
							.attr("width", function (d) {
								return component.chart.xScale(timeline.range[0] + d.duration) - 100;
							})
							.attr("height", function () {
								return component.chart.yScale.bandwidth() * .8 ;
							})
							.attr("x", function (d) {
								if (d.time < timeline.range[0]) {
									return component.chart.xScale(timeline.range[0]);
								} else {
									return component.chart.xScale(d.time);
								}
							})
							.attr("y", function (d) {
								return component.chart.yScale(d.ID) + component.chart.yScale.bandwidth()*.1;
							})),
					exit => exit.remove()
				)
		} else {
			if(component.glyphs.read) component.glyphs.read.remove();
		}

		if (interactionTypeList.SEARCH) {
			component.glyphs.search = component.chart.plotArea.selectAll("." + LegendValues.SEARCH.class)
				.data(interactionViewData.SEARCH, function (d) {
					return d ? d.ID : this.id;
				})
				.join(
					enter => enter.append('path')
						.attr("class", LegendValues.SEARCH.class)
						.attr("d", d3.symbol().type(d3.symbolTriangle).size(function (){ return component.chart.yScale.bandwidth()*10;}))
						.attr("transform", function(d) {
							component.chart.yScale.bandwidth()
							return "translate(" + component.chart.xScale(d.time)+", "+(component.chart.yScale(d.ID)+component.size.margin.top/2)+") rotate (180)";
						})
						.on("mouseover", function (d) {
							tooltipDiv.attr("class", "tooltip " + LegendValues.SEARCH.classTT)
								.transition()	
									.style("left", (d3.event.pageX + tooltipOffset[0]) + "px")		
									.style("top", (d3.event.pageY + tooltipOffset[1]) + "px")	
									.delay(10).duration(10)
									.transition().duration(200)		
									.style("opacity", .9)
									.text("Searched for: \""+d.Text+"\" at: "+ component.formatAsTime(d.time / 10));	
						})					
						.on("mouseout", function() {
							tooltipDiv.transition()		
								.duration(500)		
								.style("opacity", 0);	
						})
						.call(exit => exit.transition(component.transition)
						.attr("d", d3.symbol().type(d3.symbolTriangle).size(function (){ return component.chart.yScale.bandwidth()*10;}))
						.attr("transform", function(d) {
							component.chart.yScale.bandwidth()
							return "translate(" + component.chart.xScale(d.time)+", "+(component.chart.yScale(d.ID)+component.size.margin.top/2)+") rotate(180)";
						})
						),
					update => update
						.call(exit => exit.transition(component.transition)
						.attr("d", d3.symbol().type(d3.symbolTriangle).size(function (){ return component.chart.yScale.bandwidth()*10;}))
						.attr("transform", function(d) {
							component.chart.yScale.bandwidth()
							return "translate(" + component.chart.xScale(d.time)+", "+(component.chart.yScale(d.ID) +component.size.margin.top/2)+") rotate(180)";
						})
						),
					exit => exit.remove()
				)
		} else {
			if(component.glyphs.search) component.glyphs.search.remove();
		}

		if (interactionTypeList.HIGHLIGHT) {
			component.glyphs.highlight = component.chart.plotArea.selectAll("." + LegendValues.HIGHLIGHT.class)
				.data(interactionViewData.HIGHLIGHT, function (d) {
					return d ? d.ID : this.id;
				})
				.join(
					enter => enter.append('path')
						.attr("class", LegendValues.HIGHLIGHT.class)
						.attr("d", d3.symbol().type(d3.symbolDiamond).size(function (){ return component.chart.yScale.bandwidth()*10;}))
						.attr("transform", function(d) {
							var size = component.chart.yScale.bandwidth()
							return "translate(" + component.chart.xScale(d.time)+", "+(component.chart.yScale(d.ID)+size/2)+")";
						})
						.on("mouseover", function (d) {
							tooltipDiv.attr("class", "tooltip " + LegendValues.HIGHLIGHT.classTT)
								.transition()	
									.style("left", (d3.event.pageX + tooltipOffset[0]) + "px")		
									.style("top", (d3.event.pageY + tooltipOffset[1]) + "px")
									.delay(10).duration(10)
									.transition().duration(200)
									.style("opacity", .9)
									.text("Doc: "+d.ID+"Highlighted: \""+d.Text+"\"");	
						})					
						.on("mouseout", function() {
							tooltipDiv.transition()		
								.duration(500)		
								.style("opacity", 0);	
						})
						.call(exit => exit.transition(component.transition)
						.attr("d", d3.symbol().type(d3.symbolDiamond).size(function (){ return component.chart.yScale.bandwidth()*10;}))
							.attr("transform", function(d) {
							var size = component.chart.yScale.bandwidth()
							return "translate(" + component.chart.xScale(d.time)+", "+(component.chart.yScale(d.ID)+size/2)+")";
						})
						),
					update => update
						.call(exit => exit.transition(component.transition)
						.attr("d", d3.symbol().type(d3.symbolDiamond).size(function (){ return component.chart.yScale.bandwidth()*10;}))
							.attr("transform", function(d) {
								var size = component.chart.yScale.bandwidth()
								return "translate(" + component.chart.xScale(d.time)+", "+(component.chart.yScale(d.ID)+size/2)+")";
							})
						),
					exit => exit.remove()
				)
		} else {
			if(component.glyphs.highlight) component.glyphs.highlight.remove();
		}


		//CONNECTION INTERACTIONS - not done 
		if (interactionTypeList.CONNECT) {
			component.glyphs.connection = component.chart.plotArea.selectAll("." + LegendValues.CONNECT.class)
				.data(interactionViewData.CONNECT)
				.join(
					enter => enter.append('circle')
					.attr("class", LegendValues.CONNECT.class)
					.attr("r", function () {
						return 0;
					})
					
					.attr("cx", function (d) {
						if (d.time < timeline.range[0]) {
							return component.chart.xScale(timeline.range[0]);
						} else {
							return component.chart.xScale(d.time);
						}
					})
					.attr("cy", function () {
						return component.chart.yScale.bandwidth() * .6;
					})
					.on("mouseover", function (d) {
						d3.select (this).attr("fill","red");
						tooltipDiv.attr("class", "tooltip " + LegendValues.CONNECT.classTT)
							.transition()
								.style("left", (d3.event.pageX + tooltipOffset[0]) + "px")		
								.style("top", (d3.event.pageY + tooltipOffset[1]) + "px")
								.delay(10).duration(10)
								.transition().duration(200)		
								.style("opacity", 0.9)
								.text("Connection of: \""+d.Text+"\"\n at: "+ component.formatAsTime(d.time / 10));	
					})					
					.on("mouseout", function() {	
						tooltipDiv.transition()		
							.duration(500)		
							.style("opacity", 0);	
					})
					.call(enter => enter.transition(component.transition)
						.attr("r", function () {
							return component.chart.yScale.bandwidth() * .2;
						})
					),
					update => update
						.call(exit => exit.transition(component.transition)
							.attr("r", function () {
								return component.chart.yScale.bandwidth() * .2;
							})
							.attr("cx", function (d) {
								if (d.time < timeline.range[0]) {
									return component.chart.xScale(timeline.range[0]);
								} else {
									return component.chart.xScale(d.time);
								}
							})
							.attr("cy", function () {
								return component.chart.yScale.bandwidth() * .6;
							})),
					exit => exit.remove()
				)
		} else {
			if(component.glyphs.connection) component.glyphs.connection.remove();
		}

		if (interactionTypeList.MOVE) {
			component.glyphs.move = component.chart.plotArea.selectAll("." + LegendValues.MOVE.class)
				.data(interactionViewData.MOVE, function (d) {
					return d ? d.ID : this.id;
				})
				.join(
					enter => enter.append('path')
						.attr("class", LegendValues.MOVE.class)
						.attr("d", d3.symbol().type(d3.symbolWye).size(function (){ return component.chart.yScale.bandwidth()*1;}))
						.attr("transform", function(d) {
							var size = component.chart.yScale.bandwidth() *1.5;
							return "translate(" + component.chart.xScale(d.time)+", "+(component.chart.yScale(d.ID)+size/2)+")";
						})
						.on("mouseover", function (d) {
							tooltipDiv.transition()	
								.attr("class", "tooltip " + LegendValues.MOVE.classTT)
								.style("left", (d3.event.pageX + tooltipOffset[0]) + "px")		
								.style("top", (d3.event.pageY + tooltipOffset[1]) + "px")
								.delay(10).duration(10)
								.transition().duration(200)		
								.style("opacity", .9).text(
									"*Moved "+d.Text);	
						})					
						.on("mouseout", function() {
							tooltipDiv.transition()		
								.duration(500)		
								.style("opacity", 0);	
						})
						.call(exit => exit.transition(component.transition)
						.attr("d", d3.symbol().type(d3.symbolWye).size(function (){ return component.chart.yScale.bandwidth()*1;}))
						.attr("transform", function(d) {
							var size = component.chart.yScale.bandwidth() *1.5;
							return "translate(" + component.chart.xScale(d.time)+", "+(component.chart.yScale(d.ID)+size/2)+")";
						})
						),
					update => update
						.call(exit => exit.transition(component.transition)
						.attr("d", d3.symbol().type(d3.symbolWye).size(function (){ return component.chart.yScale.bandwidth()*1;}))
						.attr("transform", function(d) {
							var size = component.chart.yScale.bandwidth() *1.5;
							return "translate(" + component.chart.xScale(d.time)+", "+(component.chart.yScale(d.ID)+size/2)+")";
						})
						),
					exit => exit.remove()
				)
		} else {
			if(component.glyphs.move) component.glyphs.move.remove();
		}

		//TITLE HOVER
		//TODO @jeremy - title hover events? look for the BOOKMARK interations in (data)
		if (interactionTypeList.BOOKMARK) {
			component.glyphs.hover = component.chart.plotArea.selectAll("." + LegendValues.BOOKMARK.class)
				.data(interactionViewData.BOOKMARK, function (d) {
					return d ? d.ID : this.id;
				})
				.join(
					enter => enter.append('path')
						.attr("class", LegendValues.BOOKMARK.class)
						.attr("d", d3.symbol().type(d3.symbolWye).size(function (){ return component.chart.yScale.bandwidth()*1;}))
						.attr("transform", function(d) {
							var size = component.chart.yScale.bandwidth() *1.5;
							return "translate(" + component.chart.xScale(d.time)+", "+(component.chart.yScale(d.ID)-size/2)+") rotate (180)";
						})
						.on("mouseover", function (d) {
							tooltipDiv.transition()	
								.attr("class", "tooltip " + LegendValues.BOOKMARK.classTT)
								.style("left", (d3.event.pageX + tooltipOffset[0]) + "px")		
								.style("top", (d3.event.pageY + tooltipOffset[1]) + "px")
								.delay(10).duration(10)
								.transition().duration(200)		
								.style("opacity", .9)
								.text("Hovered over Title: \""+d.Text+"\" at "+component.formatAsTime(d.time / 10));	
						})					
						.on("mouseout", function() {
							tooltipDiv.transition()		
								.duration(500)		
								.style("opacity", 0);	
						})
						.call(exit => exit.transition(component.transition)
						.attr("d", d3.symbol().type(d3.symbolWye).size(function (){ return component.chart.yScale.bandwidth()*1;}))
						.attr("transform", function(d) {
							var size = component.chart.yScale.bandwidth() *1.5;
							return "translate(" + component.chart.xScale(d.time)+", "+(component.chart.yScale(d.ID)-size/2)+") rotate(180)";
						})
						),
					update => update
						.call(exit => exit.transition(component.transition)
						.attr("d", d3.symbol().type(d3.symbolWye).size(function (){ return component.chart.yScale.bandwidth()*1;}))
						.attr("transform", function(d) {
							var size = component.chart.yScale.bandwidth() *1.5;
							return "translate(" + component.chart.xScale(d.time)+", "+(component.chart.yScale(d.ID)-size/2)+") rotate(180)";
						})
						),
					exit => exit.remove()
				)
		} else {
			if(component.glyphs.hover) component.glyphs.hover.remove();
		}
		//CREATE NOTE
		// todo - @jeremy - Square to be added to the viz
		if (interactionTypeList.CREATE_NOTE) {
			component.glyphs.cNote = component.chart.plotArea.selectAll("." + LegendValues.CREATE_NOTE.class)
				.data(interactionViewData.CREATE_NOTE, function (d) {
					return d ? d.ID : this.id;
				})
				.join(
					enter => enter.append('path')
						.attr("class", LegendValues.CREATE_NOTE.class)
						.attr("d", d3.symbol().type(d3.symbolSquare).size(function (){ return component.chart.yScale.bandwidth()*10;}))
						.attr("transform", function(d) {
							component.chart.yScale.bandwidth()
							return "translate(" + component.chart.xScale(d.time)+", "+(component.chart.yScale(d.ID)+component.size.margin.top)+")";
						})
						.on("mouseover", function (d) {
							tooltipDiv.attr("class", "tooltip " + LegendValues.CREATE_NOTE.classTT)
								.transition()	
									.style("left", (d3.event.pageX + tooltipOffset[0]) + "px")		
									.style("top", (d3.event.pageY + tooltipOffset[1]) + "px")	
									.delay(10).duration(10)
									.transition().duration(200)		
									.style("opacity", .9)
									.text("Created a Note at: "+ component.formatAsTime(d.time / 10));	
						})					
						.on("mouseout", function() {
							tooltipDiv.transition()		
								.duration(500)		
								.style("opacity", 0);	
						})
						.call(exit => exit.transition(component.transition)
						.attr("d", d3.symbol().type(d3.symbolSquare).size(function (){ return component.chart.yScale.bandwidth()*10;}))
						.attr("transform", function(d) {
							component.chart.yScale.bandwidth()
							return "translate(" + component.chart.xScale(d.time)+", "+(component.chart.yScale(d.ID)+component.size.margin.top)+")";
						})
						),
					update => update
						.call(exit => exit.transition(component.transition)
						.attr("d", d3.symbol().type(d3.symbolSquare).size(function (){ return component.chart.yScale.bandwidth()*10;}))
						.attr("transform", function(d) {
							component.chart.yScale.bandwidth()
							return "translate(" + component.chart.xScale(d.time)+", "+(component.chart.yScale(d.ID) +component.size.margin.top)+")";
						})
						),
					exit => exit.remove()
				)
		} else {
			if(component.glyphs.cNote) component.glyphs.cNote.remove();
		}
		//WRITE NOTE
		//todo - @Jeremy - Triangle pointing up?
		if (interactionTypeList.WRITE_NOTE) {
			component.glyphs.aNote = component.chart.plotArea.selectAll("." + LegendValues.WRITE_NOTE.class)
				.data(interactionViewData.WRITE_NOTE, function (d) {
					return d ? d.ID : this.id;
				})
				.join(
					enter => enter.append('path')
						.attr("class", LegendValues.WRITE_NOTE.class)
						.attr("d", d3.symbol().type(d3.symbolTriangle).size(function (){ return component.chart.yScale.bandwidth()*10;}))
						.attr("transform", function(d) {
							component.chart.yScale.bandwidth()
							return "translate(" + component.chart.xScale(d.time)+", "+(component.chart.yScale(d.ID)+component.size.margin.top*2)+")";
						})
						.on("mouseover", function (d) {
							tooltipDiv.attr("class", "tooltip " + LegendValues.WRITE_NOTE.classTT)
								.transition()	
									.style("left", (d3.event.pageX + tooltipOffset[0]) + "px")		
									.style("top", (d3.event.pageY + tooltipOffset[1]) + "px")	
									.delay(10).duration(10)
									.transition().duration(200)		
									.style("opacity", .9)
									.text("added: \""+ d.Text + "\" to a NOTE at: "+ component.formatAsTime(d.time / 10));	
						})					
						.on("mouseout", function() {
							tooltipDiv.transition()		
								.duration(500)		
								.style("opacity", 0);	
						})
						.call(exit => exit.transition(component.transition)
						.attr("d", d3.symbol().type(d3.symbolTriangle).size(function (){ return component.chart.yScale.bandwidth()*10;}))
						.attr("transform", function(d) {
							component.chart.yScale.bandwidth()
							return "translate(" + component.chart.xScale(d.time)+", "+(component.chart.yScale(d.ID)+component.size.margin.top*2)+")";
						})
						),
					update => update
						.call(exit => exit.transition(component.transition)
						.attr("d", d3.symbol().type(d3.symbolTriangle).size(function (){ return component.chart.yScale.bandwidth()*10;}))
						.attr("transform", function(d) {
							component.chart.yScale.bandwidth()
							return "translate(" + component.chart.xScale(d.time)+", "+(component.chart.yScale(d.ID) +component.size.margin.top*2)+")";
						})
						),
					exit => exit.remove()
				)
		} else {
			if(component.glyphs.aNote) component.glyphs.aNote.remove();
		}
		
		//TOPIC CHANGE
		//todo - @KENNY this should be a vertical line through the whole chart - but parser is not returning these interactions
		if (interactionTypeList.TOPIC_CHANGE) {
			component.glyphs.topic = component.chart.plotArea.selectAll("." + LegendValues.TOPIC_CHANGE.class)
				.data(interactionViewData.TOPIC_CHANGE, function (d) {
					return d ? d.ID : this.id;
				})
				.join(
					enter => enter.append('rect')
						.attr("class", LegendValues.TOPIC_CHANGE.class)
						.attr("width", function () {
							return 5;
						})
						.attr("height", function () {
							return component.size.chart.height;
						})
						.attr("x", function (d) {
							if (d.time < timeline.range[0]) {
								return component.chart.xScale(timeline.range[0]);
							} else {
								return component.chart.xScale(d.time);
							}
						})
						.attr("y", function () {
							return 0;
						})
						.on("mouseover", function (d) {
							tooltipDiv.transition()	
								.attr("class", "tooltip " + LegendValues.TOPIC_CHANGE.classTT)
								.style("left", (d3.event.pageX + tooltipOffset[0]) + "px")		
								.style("top", (d3.event.pageY + tooltipOffset[1]) + "px")
								.delay(10).duration(10)
								.transition().duration(200)		
								.style("opacity", .9).text(
									"New Topic: "+d.Text);	
						})					
						.on("mouseout", function() {
							tooltipDiv.transition()		
								.duration(500)		
								.style("opacity", 0);	
						})
						.call(exit => exit.transition(component.transition)
						.attr("width", function () {
							return 5;
						})
						.attr("height", function () {
							return component.size.chart.height;
						})
						.attr("x", function (d) {
							if (d.time < timeline.range[0]) {
								return component.chart.xScale(timeline.range[0]);
							} else {
								return component.chart.xScale(d.time);
							}
						})
						.attr("y", function () {
							return 0;
						})
						),
					update => update
						.call(exit => exit.transition(component.transition)
						.attr("width", function () {
							return 5;
						})
						.attr("height", function () {
							return component.size.chart.height;
						})
						.attr("x", function (d) {
							if (d.time < timeline.range[0]) {
								return component.chart.xScale(timeline.range[0]);
							} else {
								return component.chart.xScale(d.time);
							}
						})
						.attr("y", function () {
							return 0;
						})
						),
					exit => exit.remove()
				)
		} else {
			if(component.glyphs.topic) component.glyphs.topic.remove();
		}
	
	},
  }
};
</script>