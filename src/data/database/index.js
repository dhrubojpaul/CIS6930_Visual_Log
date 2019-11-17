import documents_1 from "./dataset1/documents";
import segments_1_1 from "./dataset1/segments/user1";
import segments_1_2 from "./dataset1/segments/user2";
import segments_1_3 from "./dataset1/segments/user3";
import segments_1_4 from "./dataset1/segments/user4";
import segments_1_5 from "./dataset1/segments/user5";
import segments_1_6 from "./dataset1/segments/user6";
import segments_1_7 from "./dataset1/segments/user7";
import segments_1_8 from "./dataset1/segments/user8";
import interactions_1_1 from "./dataset1/interactions/user1";
import interactions_1_2 from "./dataset1/interactions/user2";
import interactions_1_3 from "./dataset1/interactions/user3";
import interactions_1_4 from "./dataset1/interactions/user4";
import interactions_1_5 from "./dataset1/interactions/user5";
import interactions_1_6 from "./dataset1/interactions/user6";
import interactions_1_7 from "./dataset1/interactions/user7";
import interactions_1_8 from "./dataset1/interactions/user8";

import documents_2 from "./dataset2/documents";
import segments_2_1 from "./dataset2/segments/user1";
import segments_2_2 from "./dataset2/segments/user2";
import segments_2_3 from "./dataset2/segments/user3";
import segments_2_4 from "./dataset2/segments/user4";
import segments_2_5 from "./dataset2/segments/user5";
import segments_2_6 from "./dataset2/segments/user6";
import segments_2_7 from "./dataset2/segments/user7";
import segments_2_8 from "./dataset2/segments/user8";
import interactions_2_1 from "./dataset2/interactions/user1";
import interactions_2_2 from "./dataset2/interactions/user2";
import interactions_2_3 from "./dataset2/interactions/user3";
import interactions_2_4 from "./dataset2/interactions/user4";
import interactions_2_5 from "./dataset2/interactions/user5";
import interactions_2_6 from "./dataset2/interactions/user6";
import interactions_2_7 from "./dataset2/interactions/user7";
import interactions_2_8 from "./dataset2/interactions/user8";

import documents_3 from "./dataset3/documents";
import segments_3_1 from "./dataset3/segments/user1";
import segments_3_2 from "./dataset3/segments/user2";
import segments_3_3 from "./dataset3/segments/user3";
import segments_3_4 from "./dataset3/segments/user4";
import segments_3_5 from "./dataset3/segments/user5";
import segments_3_6 from "./dataset3/segments/user6";
import segments_3_7 from "./dataset3/segments/user7";
import segments_3_8 from "./dataset3/segments/user8";
import interactions_3_1 from "./dataset3/interactions/user1";
import interactions_3_2 from "./dataset3/interactions/user2";
import interactions_3_3 from "./dataset3/interactions/user3";
import interactions_3_4 from "./dataset3/interactions/user4";
import interactions_3_5 from "./dataset3/interactions/user5";
import interactions_3_6 from "./dataset3/interactions/user6";
import interactions_3_7 from "./dataset3/interactions/user7";
import interactions_3_8 from "./dataset3/interactions/user8";


var database = [
    {
        id: 1, short: "Arms", name: "Armsdealing",
        documents: documents_1,
        users: [
            {id: 1, name: "User 1", segments: segments_1_1, interactions: interactions_1_1},
            {id: 2, name: "User 2", segments: segments_1_2, interactions: interactions_1_2},
            {id: 3, name: "User 3", segments: segments_1_3, interactions: interactions_1_3},
            {id: 4, name: "User 4", segments: segments_1_4, interactions: interactions_1_4},
            {id: 5, name: "User 5", segments: segments_1_5, interactions: interactions_1_5},
            {id: 6, name: "User 6", segments: segments_1_6, interactions: interactions_1_6},
            {id: 7, name: "User 7", segments: segments_1_7, interactions: interactions_1_7},
            {id: 8, name: "User 8", segments: segments_1_8, interactions: interactions_1_8},
        ]
    },
    {
        id: 2, short: "Terrorist", name: "TerroristActivity",
        documents: documents_2,
        users: [
            {id: 1, name: "User 1", segments: segments_2_1, interactions: interactions_2_1},
            {id: 2, name: "User 2", segments: segments_2_2, interactions: interactions_2_2},
            {id: 3, name: "User 3", segments: segments_2_3, interactions: interactions_2_3},
            {id: 4, name: "User 4", segments: segments_2_4, interactions: interactions_2_4},
            {id: 5, name: "User 5", segments: segments_2_5, interactions: interactions_2_5},
            {id: 6, name: "User 6", segments: segments_2_6, interactions: interactions_2_6},
            {id: 7, name: "User 7", segments: segments_2_7, interactions: interactions_2_7},
            {id: 8, name: "User 8", segments: segments_2_8, interactions: interactions_2_8},
        ]
    },
    {
        id: 3, short: "Disappearance", name: "Disappearance",
        documents: documents_3,
        users: [
            {id: 1, name: "User 1", segments: segments_3_1, interactions: interactions_3_1},
            {id: 2, name: "User 2", segments: segments_3_2, interactions: interactions_3_2},
            {id: 3, name: "User 3", segments: segments_3_3, interactions: interactions_3_3},
            {id: 4, name: "User 4", segments: segments_3_4, interactions: interactions_3_4},
            {id: 5, name: "User 5", segments: segments_3_5, interactions: interactions_3_5},
            {id: 6, name: "User 6", segments: segments_3_6, interactions: interactions_3_6},
            {id: 7, name: "User 7", segments: segments_3_7, interactions: interactions_3_7},
            {id: 8, name: "User 8", segments: segments_3_8, interactions: interactions_3_8},
        ]
    }
];


//segment ending and interaction ending does not match all the time. that is being corrected here
(function () {
    database.forEach(function(dataset){
        var datasetEndTime = 0;
        dataset.users.forEach(function(user){
  
            var lastSegment = user.segments[user.segments.length-1], 
                interactionMax = user.interactions[user.interactions.length-1].time + user.interactions[user.interactions.length-1].duration;

            if (interactionMax > lastSegment.end * 10) {
                user.segments.push({
                    ID: parseInt(lastSegment.ID) + 1,
                    start: lastSegment.end,
                    end: interactionMax/10,
                    "length (sec)": (interactionMax - (parseInt(lastSegment.end) * 10))/10,
                });
            }

            user.endTime = interactionMax;
            datasetEndTime = interactionMax>datasetEndTime ? interactionMax : datasetEndTime;
        });

        dataset.endTime = datasetEndTime;
        dataset.users.forEach(function(user){
            user.weight = user.endTime / dataset.endTime;
        });
    });
}());


//inject interaction information inside a segment. because segment is meaningful in the dataset.
import InteractionType from "../interactionType.js";

(function () {
    database.forEach(function (dataset) {
        dataset.users.forEach(function (user) {
            user.segments.forEach(function (segment) {
                //
                segment.interactions = [];
                segment.totalInteractionTypeCount = 0;
                segment.interactionTypes = {};
                //
                var segmentStart = segment.start * 10, segmentEnd = segment.end * 10;
                segment.weight = (segmentEnd - segmentStart)/user.endTime;

                user.interactions.forEach(function (interaction) {
                    var interactionStart = interaction.time, interactionEnd = interaction.time + interaction.duration;
                    if ( (interactionStart >= segmentStart && interactionStart <= segmentEnd) || (interactionEnd >= segmentStart && interactionEnd <= segmentEnd)) {
                        if(InteractionType.enabledInteractionTypeKeyArray.includes(interaction.InteractionType)){
                            var interactionInsideSegment = { interactionType: interaction.InteractionType, documentID: interaction.ID};
                            if (!Object.keys(segment.interactionTypes).includes(interaction.InteractionType)) {
                                segment.interactionTypes[interaction.InteractionType] = {count: 0,weight: 0};
                            }
                            segment.totalInteractionTypeCount++;
                            segment.interactionTypes[interaction.InteractionType].count++;
                            interactionInsideSegment.start = interactionStart < segmentStart ? segmentStart : interactionStart;
                            interactionInsideSegment.end = interactionEnd > segmentEnd ? segmentEnd : interactionEnd;
                            interactionInsideSegment.key = interaction.InteractionType;
                            segment.interactions.push(interactionInsideSegment);
                        }
                    }
                });

                Object.keys(segment.interactionTypes).forEach(function(interactionType){
                    segment.interactionTypes[interactionType].weight = segment.interactionTypes[interactionType].count/(segment.totalInteractionTypeCount)*100;
                    segment.interactionTypes[interactionType].color = InteractionType.types[interactionType].color;
                });
            });
        });
    });
}());

export default database;