<template>
    <v-card>
      <div id="summaryDiv">
      </div>
    </v-card>
</template>

<script>
import * as d3 from 'd3';
import InteractionType from "../data/interactionType";

export default {
  data() {
    return {
      summary: undefined,
      summaryScale: ['Open Document', 'Document Interact', 'Search', 'Highlight', 'Bookmark', 'Connection', 'Move Document', 'Write Note'],
      size: {
        width: 0,
        height: 0,
        margin: {
          top: 20,
          right: 10,
          bottom: 100,
          left: 50
        },
        summaryWidth: undefined,
        summaryHeight: undefined
      }
    }
  },
  props: ["resizewatcher"],
  watch: {
    interactionViewData: {
      deep: true,
      handler: function(value){
        this.updateSummary(value);
      }
    },
    resizewatcher: function(){
      this.resizeWithWindow();
    }
  },
  computed: {
    interactionViewData: function(){
      return this.$store.state.interactionViewData;
    }
  },
  mounted() {
    this.initializeVariables();
    this.initializeSummary();
    window.onresize = this.resizeWithWindow;
  },
  methods: {
    resizeWithWindow: function () {
      document.getElementById("summaryDiv").innerHTML = "";
      this.initializeVariables();
      this.initializeSummary();
      this.updateSummary(this.interactionViewData);
    },
    initializeVariables: function () {
      this.size.width= window.innerWidth * 0.16;
      this.size.height= window.innerHeight * 0.5;
      this.size.summaryWidth = this.size.width - this.size.margin.left - this.size.margin.right;
      this.size.summaryHeight = this.size.height - this.size.margin.top - this.size.margin.bottom;
    },
    initializeSummary: function () {
      var component = this;
      component.summary = d3.select("#summaryDiv").append("svg")
        .attr("width", component.size.width)
        .attr("height", component.size.height);

      component.summary.plotArea = component.summary.append("g")
        .attr("transform", "translate(" + component.size.margin.left + "," + component.size.margin.top + ")");

      // x axis
      component.summary.xScale = d3.scaleBand()
        .domain(component.summaryScale)
        .range([0, component.size.summaryWidth]);

      component.summary.xAxis = d3.axisBottom()
        .tickSizeOuter(0)
        .scale(component.summary.xScale);

      component.summary.xAxisContainer = component.summary.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + (component.size.margin.left) + ", " + (component.size.summaryHeight + component.size.margin.top) + ")")
        .call(component.summary.xAxis);

      component.summary.selectAll("text")
        .attr("y", 0)
        .attr("x", 9)
        .attr("dy", ".35em")
        .attr("transform", "rotate(90)")
        .style("text-anchor", "start");
      //    .attr("transform", "translate(0, 10) rotate(-90)")

      // x axis header label
      //summary.append("text")
      //    .attr("class", "x axis scatter-xaxis")
      //    .style("font-size", "12px")
      //    .attr("text-anchor", "middle")
      //    .attr("transform", "translate(" + (component.size.margin.left + chartWidth / 2.0) + ", " + (chartHeight + (component.size.margin.bottom / 2.0)) + ")")
      //    .text("Events");

      // y axis labels
      component.summary.yScale = d3.scaleLinear()
        .domain([0, 1])
        .range([component.size.summaryHeight, 0]);

      component.summary.yAxis = d3.axisLeft()
        .scale(component.summary.yScale)
        .tickFormat(d3.format(".0%"));

      component.summary.yAxisContainer = component.summary.append("g")
        .attr("class", "y axis scatter-yaxis")
        .attr("transform", "translate(" + component.size.margin.left + ", " + component.size.margin.top + ")")
        .call(component.summary.yAxis);
    },
    updateSummary: function (data) {
      var component = this;

      var chartData = [],
          percentData = [],
          n = 0,
          gap = 5,
          eventID = ['DOC_OPEN', 'READING', 'SEARCH', 'HIGHLIGHT', 'BOOKMARK', 'CONNECT', 'MOVE', 'WRITE_NOTE'];

      //Remove existing bars and numbers
      component.summary.plotArea.selectAll(".bar").remove()
      component.summary.plotArea.selectAll(".num").remove()

      //Generate new bars
      //todo catch when an event does not happen in the selected time. Error: cannot read 'length' of undefined
      for (var i = 0; i < eventID.length; i++) {
        n += data[eventID[i]].length;
      }

      for (i = 0; i < eventID.length; i++) {
        chartData[eventID[i]] = {};
        chartData[eventID[i]].color = InteractionType.types[InteractionType.capsList[eventID[i]]].color;

        chartData[eventID[i]].length = data[eventID[i]].length;
        percentData[eventID[i]] = chartData[eventID[i]].length / n;
      }

      component.summary.plotArea.selectAll("rect")
        .data(chartData)
        .enter().append("rect")
        .attr("height", function (d) {
          return d.length;
        })
        .attr("width", 10);

      //Dist between components
      var distance = component.summary.xScale(component.summaryScale[1]) - component.summary.xScale(component.summaryScale[0]);

      for (i = 0; i < eventID.length; i++) {
        //Append bar
        component.summary.plotArea.append('rect')
          .attr("class", "bar")
          .attr("id", "bar" + i)
          .attr("x", component.summary.xScale(component.summaryScale[i]) + (gap / 2))
          .attr("width", distance - gap)
          .attr("y", component.summary.yScale(percentData[eventID[i]]))
          .attr("height", component.summary.yScale(1 - percentData[eventID[i]]))
          .attr("fill", chartData[eventID[i]].color)
          /*
          .on("mouseover", function () {
            var id = "#num" + d3.select(this).attr("id").slice(-1)
            d3.select(this).attr("fill", "red")
            d3.select(id).attr("fill", "red")
          })
          .on("mouseout", function () {
            var id = "#num" + d3.select(this).attr("id").slice(-1)
            d3.select(this).attr("fill", chartData[eventID[i]].color)
            d3.select(id).attr("fill", chartData[eventID[i]].color)
          })
          */

        //Append text
        component.summary.plotArea.append('text')
          .attr("class", "num")
          .attr("id", "num" + i)
          .attr("x", component.summary.xScale(component.summaryScale[i]) + (distance / 2))
          .style("text-anchor", "middle")
          .attr("y", component.summary.yScale(percentData[eventID[i]]) - gap)
          .text(chartData[eventID[i]].length)
          /*
          .on("mouseover", function () {
            var id = "#bar" + d3.select(this).attr("id").slice(-1)
            d3.select(this).attr("fill", "red")
            d3.select(id).attr("fill", "red")
          })
          .on("mouseout", function () {
            var id = "#bar" + d3.select(this).attr("id").slice(-1)
            d3.select(this).attr("fill", "black")
            d3.select(id).attr("fill", "black")
          })
          */
      }

    }
  }
};
</script>
