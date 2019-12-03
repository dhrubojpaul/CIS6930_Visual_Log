<template>
  <v-container style="margin-top:10vh;">
    <v-layout text-center wrap>

      <v-flex mb-4>
        <iframe width="800" height="450" src="https://www.youtube.com/embed/XKevaCDapkY" frameborder="0" 
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      </v-flex>
      
    </v-layout>
    <v-btn icon to="/" style="position:fixed;top:20px;right:20px;"><v-icon>mdi-close</v-icon></v-btn>
  </v-container>
</template>

<script>

export default {
  mounted(){
    this.$store.commit("setDrawer", false);
  }
};
</script>
