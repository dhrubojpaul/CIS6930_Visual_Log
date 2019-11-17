<template>
    <v-container>
        <legends height="20" :width=windowWidth*0.7></legends>
        <v-row>
            <v-col cols=8><chart :resizewatcher=windowWidth></chart></v-col>
            <v-col cols=4>
                <cloud :resizewatcher=windowWidth></cloud>
                <histogram :resizewatcher=windowWidth></histogram>
            </v-col>
            <v-col cols=12><timepicker :resizewatcher=windowWidth></timepicker></v-col>
        </v-row>
    </v-container>
</template>

<script>
import chart from "../components/Chart";
import cloud from "../components/WordCloud";
import timepicker from "../components/Timepicker";
import histogram from "../components/Summary";
import legends from "../components/Legends";

export default {
    components: {
        chart,
        cloud,
        histogram,
        timepicker,
        legends
    },
    data: function(){
        return {
            windowWidth: undefined
        }
    },
    methods: {
        windowResizeHandler: function(){
            this.windowWidth = window.innerWidth;
        }
    },
    mounted() {
        this.$store.commit("setDrawer", true);
        window.onresize = this.windowResizeHandler;
        this.windowResizeHandler();
    }
};
</script>
