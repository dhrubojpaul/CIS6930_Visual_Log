<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app clipped>
      <v-list dense>
        <v-list-item>
          <v-select :items="selectionList.dataset" label="Select Dataset" item-text="name" item-value="id"
            v-model="selectionList.selected.datasetID" solo></v-select>
        </v-list-item>
        <v-list-item v-if="this.$route.name=='timeline'">
          <v-select :items="selectionList.users" label="Select User" item-text="name" item-value="id"
            v-model="selectionList.selected.userID" solo></v-select>
        </v-list-item>
        <v-list-item v-if="this.$route.name=='overview'">
          <v-select :items="selectionList.users" label="Select Users" item-text=name item-value=id 
            v-model="selectionList.selected.users" multiple solo></v-select>
        </v-list-item>
        <v-list-item v-if="this.$route.name=='timeline'">
          <v-select :items="selectionList.interactionType" label="Select Interactions" item-text=name item-value=key 
            v-model="selectionList.selected.interactionTypes" multiple solo></v-select>
        </v-list-item>
        <v-list-item v-if="this.$route.name=='timeline'">
          <v-btn block to="/overview">Back to Overview</v-btn>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app clipped-left color="blue" dense dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" v-if="this.$route.name !='home'"/>
      <v-toolbar-title class="mr-12 align-center" >
        <span class="title">Visual Summary of Log Data</span>
      </v-toolbar-title>
      <v-spacer/>
      <v-btn icon to="/"><v-icon>mdi-home</v-icon></v-btn>
    </v-app-bar>

    <v-snackbar v-model="snack.flag">{{ snack.text }}<v-btn color="pink" text @click="snack.flag = false">Close</v-btn></v-snackbar>

    <v-content>
      <v-container>
        <legends></legends>
        <transition>
        <router-view></router-view>
        </transition>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import selectionList from "./data/selectionList";
import database from "./data/database";

import legends from "./components/Legends";

export default {
  components: {
    legends
  },
  props: {
    source: String,
  },
  data: () => ({
    selectionList,
  }),
  mounted() {
    var selectedInteractionTypes = [];
    this.selectionList.interactionType.forEach(function(interactionType){
      selectedInteractionTypes.push(interactionType.key);
    });
    this.selectionList.selected = {
      datasetID: 1,
      userID: 1,
      users: [1,2,3,4,5,6,7,8],
      interactionTypes: selectedInteractionTypes,
    };
  },
  watch: {
    "selectionList.selected": {
      deep: true,
      handler: function(value){
        this.$store.commit("setSelected", value);
      }
    },
    selectedFromState: {
      deep: true,
      handler: function(value){
        if(value.userID != selectionList.selected.userID){
          selectionList.selected.userID = value.userID;
        }
      }
    }
  },
  computed: {
    snack: {
      get: function(){
        return this.$store.state.snack;
      },
      set: function(newValue){
        this.$store.commit("setSnack", newValue);
      }
    },
    drawer: {
      get: function(){
        return this.$store.state.drawer;
      },
      set: function(newValue){
        this.$store.commit("setDrawer", newValue);
      }
    },
    selectedFromState: function(){
      return this.$store.state.selected;
    }
  },
  created(){
    this.$store.commit("setDatabase", database);
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>