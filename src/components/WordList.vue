<template>
    <v-card>
      <svg :height=size.height :width=size.width></svg>
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
  },
  mounted() {
    this.resizeWithWindow();
    window.onresize = this.resizeWithWindow;

  },
  methods: {
    resizeWithWindow: function () {
      this.initializeVariables();
    },
    initializeVariables: function(){
        this.size.width = window.innerWidth * 0.2;
        this.size.height = window.innerHeight * 0.712;
    }
  }
};
</script>
