<template>
    <v-card>
        <div id="cloudDiv"></div>
    </v-card>
</template>

<script>

//import {histograms1} from "../data/histograms/Document_Histograms_Dataset_1";
//import histograms2 from "../data/histograms/Document_Histograms_Dataset_2";
//import histograms3 from "../data/histograms/Document_Histograms_Dataset_3";
import * as d3 from 'd3';

export default {
    data() {
        return {
            topIndex: undefined,
            layout: undefined,
            size: {
                width: window.innerWidth*0.25,
                height: window.innerHeight*0.25,
                margin: { top: 20, right: 10, bottom: 100, left: 50 },
            },
            cloud: undefined
        }
    },
    props: ["resizewatcher"],
    watch: {
        resizewatcher: function(){
            this.resizeWithWindow();
        }
    },
    mounted(){
        this.resizeWithWindow();
        console.log(window.histograms1);
    },
    methods: {
        resizeWithWindow: function(){
            document.getElementById("cloudDiv").innerHTML = "";
            this.size.width = window.innerWidth*0.25;
            this.size.height = window.innerHeight*0.25;
            this.initialize();
        },
        initialize: function () {
            var component = this;
            this.cloud = d3.select("#cloudDiv").append("svg")
                .attr("width", component.size.width)
                .attr("height", component.size.height)
                .append("g")
                .attr("transform", "translate(" + component.size.margin.left + "," + component.size.margin.top + ")");
            this.cloud.plotArea = this.cloud.append("g")
                .attr("transform", "translate(" + component.size.margin.left + "," + component.size.margin.top + ")");
        },
        updateWordcloud: async function (interactionViewData) {
            var docIDs = [],
                histograms,
                repVec = [],
                docData = interactionViewData.DOC_OPEN,
                docTitles;
            //Check that at least one document exists
            if (docData.length < 1) {
                return -1
            }

            // Get list of documents
            docData.forEach(function(docDataItem){
                docTitles = docDataItem.Text.split(" ");
                docIDs.push(docTitles[docTitles.length - 1])
            });
           
            //Get dataset
            if (docTitles[0] == "Armsdealing") {
                histograms = window.histograms1
            } else if (docTitles[0] == "TerroristActivity") {
                histograms = {}//histograms2
            } else if (docTitles[0] == "Disappearance") {
                histograms = {}//histograms3
            }

            //Generate representative vector
            //var repVec = histograms.documents[docIDs[0]-1]
            for (var histogramWordIndex = 0; histogramWordIndex < histograms.words.length; histogramWordIndex++) {
                repVec.push(histograms.documents[docIDs[0] - 1].histogram[histogramWordIndex])
            }
            for (var docIdIndex = 1; docIdIndex < docIDs.length; docIdIndex++) {
                //Sum the histograms
                for (histogramWordIndex = 0; histogramWordIndex < histograms.words.length; histogramWordIndex++) {
                    repVec[histogramWordIndex] += histograms.documents[docIDs[docIdIndex] - 1].histogram[histogramWordIndex]
                }
            }
            this.topIndex = this.zipArrayMax(repVec, histograms.words, 30)
        },
        //Sort out the top n words in a vector
        zipArrayMax: function zipArrayMax(weights, words, n) {
            var zipped = []
            for (var i = 0; i < weights.length; i++) {
                //I don't know why, but when the "notSize" variable is named "size" it sets the top n values of "size" equal to 0
                //When it is named "weight", it sets the top n values to "normal"
                //Do not attempt to give this variable a meaningful name, it is evidently cursed
                zipped.push({
                    notSize: weights[i],
                    text: words[i]
                })
            }
            zipped.sort(function (x, y) {
                return x.notSize - y.notSize
            })
            var topN = zipped.slice(-n);

            //Normalize sizes
            var sum = 0
            for (var nIndex = 0; nIndex < n; nIndex++) {
                sum += topN[nIndex].notSize
            }
            for (nIndex = 0; nIndex < n; nIndex++) {
                topN[nIndex].notSize = topN[nIndex].notSize / sum * 500
            }
            return topN;
        },
        generateCloud: function(wordsWeights) {
            var component = this;
            this.layout = d3.layout.cloud()
                .size([component.size.width, component.size.height])
                .words(wordsWeights)
                .rotate(0)
                .padding(10)
                .fontSize(function (d) {
                    return d.notSize
                })
                .on("end", component.draw);
            this.layout.start();
        },
        draw: function(words) {
            var component = this;
            this.cloud.selectAll(".cloudText").remove();
            this.cloud.append("g")
                .attr("transform", "translate(" + component.layout.size()[0] / 2 + "," + component.layout.size()[1] / 2 + ")")
                .selectAll("text")
                .data(words)
                .enter().append("text")
                .attr("class", "cloudText")
                .style("font-size", function (d) { return d.size + "px"; })
                .attr("text-anchor", "middle")
                .attr("transform", function (d) {
                    return "translate(" + [d.x - 60, d.y - 10] + ")rotate(" + d.rotate + ")";
                })
                //.attr("transform", "translate(320,200)")
                .text(function (d) { return d.text; });
        }
    }
};
</script>
