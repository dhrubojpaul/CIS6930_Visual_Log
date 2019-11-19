import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

import InteractionType from "../data/interactionType.js";

var generateInteractionData = function(user, timeline){
  var data = {}, allInteractions = user.interactions;

  Object.keys(InteractionType.capsList).forEach(function(capsKey){
    var type = InteractionType.capsList[capsKey];

    var interactions;
    if (type == "Doc_open") {
      interactions = allInteractions.filter(function(interaction){
        return interaction.InteractionType == type;
      }).filter(function(typeMatchedInteraction){
          return typeMatchedInteraction.time + typeMatchedInteraction.duration >= timeline.range[0] 
            && typeMatchedInteraction.time <= timeline.range[1];
      });
    } else {
      interactions = allInteractions.filter(function(interaction){
        return interaction.InteractionType == type;
      }).filter(function(typeMatchedInteraction){
        return typeMatchedInteraction.time >= timeline.range[0] 
          && typeMatchedInteraction.time <= timeline.range[1];
      });
    }

    if (data[capsKey] != null) {
      var commonItems = interactions;
      commonItems.forEach(function (newActions, index) {
        data[capsKey].forEach(function (currentActions) {
          if (InteractionType.methods.isEqual(newActions, currentActions)) {
            commonItems[index] = currentActions;
          }
        });
      });
      data[capsKey] = commonItems;
    } else {
      data[capsKey] = interactions;
    }
  });
  return data;
};

export default new Vuex.Store({
  state: {
    //
    timeline: {
			min: 0,
      max: 55000,
      range: [4000, 20000]
		},
    //only the selected item ids are kept here
    selected: {
      datasetID: undefined,
      userID: undefined,
      users: [],
      interactionTypes: []
    },
    //this is the complete database, not a good idea, but had to do it for this project
    database: {},
    //some global flags
    snack: {flag : false,text: ""},
    drawer: false,
    //the actual selected items are kept in the following objects
    selectedUser: undefined,
    selectedUsers: undefined,
    selectedInteractionTypes: undefined,
    //generatedInteractionData for interaction view
    interactionViewData: undefined,
    //dataset end time
    datasetEndTime: undefined,
    //document view
    selectedDocument: {title:""},
    documentViewFlag: false
  },
  mutations: {
    setTime(state, timeline){
      state.timeline = timeline;
      if(state.selectedUser && state.timeline){
        state.interactionViewData = generateInteractionData(state.selectedUser, state.timeline);
      }
    },
    setSelected(state, selected){
      state.selected = selected;
      if(selected.datasetID){
        state.datasetEndTime = state.database.find(function(dataset){return dataset.id == selected.datasetID}).endTime;
        if(selected.userID){
          state.selectedUser = state.database.find(function(dataset){return dataset.id == selected.datasetID})
                                .users.find(function(user){return user.id == selected.userID});
          state.timeline.max = state.selectedUser.endTime;
        }
        if(selected.users){
          state.selectedUsers = state.database.find(function(dataset){return dataset.id == selected.datasetID})
                                .users.filter(function(user){return selected.users.includes(user.id);});
        }
      } else {
        state.selectedUser = undefined;
        state.selectedUsers = undefined;
      }
      
      if(state.selected.interactionTypes){
        state.selectedInteractionTypes = {};
        state.selected.interactionTypes.forEach(function(interactionTypeKey){
          var capsKey = InteractionType.types[interactionTypeKey].capsName;
          state.selectedInteractionTypes[capsKey] = true;
        });
      }

      if(state.selectedUser && state.timeline){
        state.interactionViewData = generateInteractionData(state.selectedUser, state.timeline);
      }
      
    },
    setDatabase(state, database){//this is called once
      state.database = database;
    },
    setSnack(state,snack){
      state.snack = snack;
    },
    showSnack(state, text){
      state.snack.text = text;
      state.snack.flag = true;
    },
    setDrawer(state,drawer){
      state.drawer = drawer;
    },
    setSheetFlag(state,flag){
      state.documentViewFlag = flag;
    },
    setCurrentDocument(state, currentDocumentID){
      var documentIDMerged = currentDocumentID.replace(/\s/g, ''),
          datasetName = "";
      if(documentIDMerged.includes("Armsdealing")){
        currentDocumentID = documentIDMerged.replace("Armsdealing", "ArmsDealing");
        datasetName = "Arms Dealing";
      } else if(documentIDMerged.includes("TerroristActivity")){
        currentDocumentID = currentDocumentID.replace("  ", " ");
        datasetName = "Terrorist Activity";
      } else if(documentIDMerged.includes("Disappearance")){
        currentDocumentID = documentIDMerged.replace("Disappearance", "").replace(/\s/g, '');
        currentDocumentID = "Disappearance " + currentDocumentID; 
        datasetName = "Disappearance";
      }
      var temporarySelectedDocument = state.database.find(function(dataset){return dataset.id == state.selected.datasetID})
                                .documents.find(function(document){return document.id == currentDocumentID});
      temporarySelectedDocument.datasetName = datasetName;
      state.selectedDocument = temporarySelectedDocument;
    }
  },
  actions: {},
  modules: {}
});
