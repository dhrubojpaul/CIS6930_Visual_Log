<template>
    <v-container>
        <v-row>
            <v-col cols=9>
                <legends :width=windowWidth*0.55></legends>
                <v-row no-gutters>
                    <v-col cols=8><chart :resizewatcher=windowWidth></chart></v-col>
                    <v-col cols=4><histogram :resizewatcher=windowWidth></histogram></v-col>
                </v-row>
                <v-row no-gutters>
                    <v-col cols=12><timepicker :resizewatcher=windowWidth></timepicker></v-col>
                </v-row>
            </v-col>
            <v-col cols=3>
                <v-row no-gutters>
                    <v-col cols=12><wordlist :resizewatcher=windowWidth></wordlist></v-col>
                </v-row>
            </v-col>
        </v-row>
        <documentview></documentview>
    </v-container>
</template>

<script>
import chart from "../components/Chart";
import timepicker from "../components/Timepicker";
import histogram from "../components/Summary";
import documentview from "../components/DocumentView";
import wordlist from "../components/WordList";
import legends from "../components/Legends";

export default {
    components: {
        chart,
        histogram,
        timepicker,
        documentview,
        wordlist,
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
