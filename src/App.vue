<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app clipped>
      <v-list dense>
        <v-list-item v-if="this.$route.name=='timeline'">
          <v-btn block to="/overview">Back to Overview</v-btn>
        </v-list-item>
        <v-subheader>Dataset</v-subheader>
        <v-list-item>
          <v-select :items="selectionList.dataset" label="Select Dataset" item-text="name" item-value="id"
            v-model="selectionList.selected.datasetID" solo></v-select>
        </v-list-item>
        <v-subheader v-if="this.$route.name=='timeline'">User</v-subheader>
        <v-list-item v-if="this.$route.name=='timeline'">
          <v-select :items="selectionList.users" label="Select User" item-text="name" item-value="id"
            v-model="selectionList.selected.userID" solo></v-select>
        </v-list-item>
        <v-subheader v-if="this.$route.name=='overview'">Users</v-subheader>
        <v-list-item v-if="this.$route.name=='overview'">
          <v-select :items="selectionList.users" label="Select Users" item-text=name item-value=id 
            v-model="selectionList.selected.users" multiple solo></v-select>
        </v-list-item>
        <v-subheader v-if="this.$route.name=='timeline'">Interaction Types</v-subheader>
        <v-list-item v-if="this.$route.name=='timeline'">
          <v-select :items="selectionList.interactionType" label="Select Interactions" item-text=name item-value=key 
            v-model="selectionList.selected.interactionTypes" multiple solo></v-select>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app clipped-left color="blue" dense dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" v-if="this.$route.name !='home'"/>
      <v-toolbar-title class="mr-12 align-center" >
        <span class="title">Visual Summary of Log Data</span>
      </v-toolbar-title>
      <v-spacer/>
      <div v-if="this.$route.name!='home'">
        <v-btn icon to="/"><v-icon>mdi-home</v-icon></v-btn>
        <v-btn text to="/overview">Overview</v-btn>
        <v-btn text to="/timeline">Timeline</v-btn>
      </div>
      <!--<v-btn icon @click="infoFlag = !infoFlag"><v-icon>mdi-information</v-icon></v-btn>-->
    </v-app-bar>

    <v-bottom-sheet v-model="infoFlag">
      <v-sheet height="80vh">
        <v-row style="padding:5vh 10vw 2vh 10vw;">
            <v-col cols=12>
                <div style="max-height:70vh;overflow-x:hidden;overflow-y:scroll;">
                  <h2>Query Panel</h2>
                    hello
                  <h2>Relevant Words Panel</h2>
                    hello
                  <h2>User Comparison View</h2>
                    hello
                  <h2>Interaction Exploration View</h2>
                    hello
                </div>
            </v-col>
        </v-row>
      </v-sheet>
    </v-bottom-sheet>

    <v-snackbar color="cyan darken-2" v-model="snack.flag">{{ snack.text }}
      <v-btn text @click="snack.flag = false">Close</v-btn>
    </v-snackbar>

    <v-content>
      <v-container>
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

export default {
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
    infoFlag: {
      get: function(){
        return this.$store.state.infoFlag;
      },
      set: function(newValue){
        this.$store.commit("setInfoFlag", newValue);
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