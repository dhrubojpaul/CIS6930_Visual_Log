<template>
  <v-bottom-sheet v-model="sheetFlag" persistent>
      <v-sheet height="80vh">
        <v-row style="padding-left:10vw;padding-right:10vw;">
            <v-col cols=12>
                <h2>{{selectedDocument.title}}</h2>
                <br/>
                <h4>{{selectedDocument.id}}</h4>
                <h3>{{selectedDocument.datasetName}}</h3>
                <br/>
                <br/>
                <p v-html="selectedDocument.contents"></p>
            </v-col>
        </v-row>
        <v-btn style="margin-left:10vw;" class="mt-6" @click="closeSheet">Close Document</v-btn>
      </v-sheet>
    </v-bottom-sheet>
</template>

<script>
export default {
    data() {
        return {
            sheetFlag: false
        }
    },
    methods: {
        closeSheet: function(){
            this.$store.commit("setSheetFlag", false);
        }
    },
    watch: {
        documentViewFlag: function(value){
            this.sheetFlag = value;
        }
    },
    computed: {
        selectedDocument: function(){
            return this.$store.state.selectedDocument;
        },
        documentViewFlag: function(){
            return this.$store.state.documentViewFlag;
        }
    }
}
</script>