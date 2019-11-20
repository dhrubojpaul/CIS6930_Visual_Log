<template>
<v-card>
<v-row no-gutters style="height:36vh">
  <v-col cols=12>
    <div style="padding:5px;"><h4>Doc Open</h4></div>
    <v-list dense style="height:26vh;overflow-x:hidden;overflow-y:scroll">
      <v-list-item v-for="(word,wordIndex) in globalWords" :key=wordIndex>{{word}}</v-list-item>
    </v-list>
  </v-col>
</v-row>
<v-row no-gutters style="height:36vh">
  <v-col cols=12>
    <div style="padding:5px;"><h4>User Interactions</h4></div>
    <v-list dense style="height:26vh;overflow-x:hidden;overflow-y:scroll">
      <v-list-item v-for="(word,wordIndex) in localWords" :key=wordIndex>{{word}}</v-list-item>
    </v-list>
  </v-col>
</v-row>
</v-card>
</template>

<script>

export default {
  data() {
    return {
      size: {
        width: 0,
        height: 0,
      }
    }
  },
  props: ["resizewatcher"],
  watch: {
  },
  computed: {
    globalWords: function(){
      return ["minsky","minsky","minsky","minsky","minsky","minsky","minsky","minsky"]
    },
    localWords: function(){
      return ["Nigeria","Nigeria","Nigeria","Nigeria","Nigeria","Nigeria","Nigeria","Nigeria"]
    }
  },
  mounted() {
    this.resizeWithWindow();
    window.onresize = this.resizeWithWindow;

  },
  methods: {
    resizeWithWindow: function () {
      this.initializeVariables();
      this.calculateWords();
    },
    initializeVariables: function(){
        this.size.width = window.innerWidth * 0.2;
        this.size.height = window.innerHeight * 0.712;
    },
    calculateWords: function(){
      console.log(window.histograms1);
    }
  }
};
</script>
