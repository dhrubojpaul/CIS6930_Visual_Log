<template>
  <v-container style="margin-top:10vh;">
    <v-layout text-center wrap>

      <v-flex mb-4>
        <h1 class="display-2 font-weight-bold mb-3">
          Visual Summary of Log Data
        </h1>
        <p class="subheading font-weight-regular">
          This visualization has been done as a semester project for the course<br>
          Information Visualization<br>
          CIS6930
        </p>
      </v-flex>

      <v-flex mb-5 xs12>
        <h2 class="headline font-weight-bold mb-3">Team</h2>

        <v-layout justify-center>
          <span class="subheading mx-3">Jeremy Block</span>
          <span class="subheading mx-3">Donald Honeycutt</span>
          <span class="subheading mx-3">Kenneth King</span>
          <span class="subheading mx-3">Dhrubo Paul</span>
        </v-layout>
      </v-flex>

      <v-flex xs12 mb-5>
        <v-layout justify-center>
          <v-btn to="/overview">Get In</v-btn>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>

export default {
  mounted(){
    this.$store.commit("setDrawer", false);
  }
};
</script>
