//do not change the keys. it is associated with the actual dataset.
var InteractionType = {
    types : {
        "Think_aloud": {
            name: "Think Aloud",
            color: "#8dd3c7",
            onByDefault: true,
            disabled: true,
            capsName: "THINK_ALOUD",
            shape: "triangle_r",
            priority: 13,
        },
        "Doc_open": {
            name: "Doc Open",
            color: "#d9d9d9",
            onByDefault: true,
            disabled: false,
            capsName: "DOC_OPEN",
            shape: "rect",
            priority: 12,
        },
        "Reading": {
            name: "Doc Interact",
            color: "#bebada",
            onByDefault: true,
            disabled: false,
            capsName: "READING",
            shape: "rect",
            priority: 11,
        },
        "Search": {
            name: "Search",
            color: "#fb8072",
            onByDefault: true,
            disabled: false,
            capsName: "SEARCH",
            shape: "triangle_r",
            priority: 1,
        },
        "Highlight": {
            name: "Highlight",
            color: "#80b1d3",
            onByDefault: true,
            disabled: false,
            capsName: "HIGHLIGHT",
            shape: "diamond",
            priority: 2,
        },
        "Title_hover": {
            name: "Title Hover",
            color: "#fdb462",
            onByDefault: true,
            disabled: false,
            capsName: "BOOKMARK",
            shape: "wye_r",
            priority: 8,
        },
        "Mouse_hover": {
            name: "Mouse Hover",
            color: "#fdb462",
            onByDefault: true,
            disabled: true,
            capsName: "Mouse Hover",
            shape: "wye_r",
            priority: 9,
        },
        "BOOKMARK": {
            name: "Bookmark",
            color: "#fdb462",
            onByDefault: true,
            disabled: true,
            capsName: "BOOKMARK",
            shape: "rect",
            priority: 7,
        },
        "Connection": {
            name: "Connection",
            color: "#b3de69",
            onByDefault: true,
            disabled: false,
            capsName: "CONNECT",
            shape: "circle",
            priority: 6,
        },
        "Draging": {
            name: "Move",
            color: "#fccde5",
            onByDefault: true,
            disabled: false,
            capsName: "MOVE",
            shape: "wye",
            priority: 10,
        },
        "Create Note": {
            name: "Create Note",
            color: "#ccebc5",
            onByDefault: true,
            disabled: false,
            capsName: "CREATE_NOTE",
            shape: "rect",
            priority: 3,
        },
        "Add note": {
            name: "Write in Note",
            color: "#bc80bd",
            onByDefault: true,
            disabled: false,
            capsName: "WRITE_NOTE",
            shape: "triangle",
            priority: 4,
        },
        "Topic_change": {
            name: "Topic Change",
            color: "#ffed6f",
            onByDefault: true,
            disabled: false,
            capsName: "TOPIC_CHANGE",
            shape: "rect",
            priority: 5,
        }
    },
    capsList : {
        THINK_ALOUD: "Think_aloud",
        DOC_OPEN: "Doc_open",
        READING: "Reading",
        SEARCH: "Search",
        HIGHLIGHT: "Highlight",
        BOOKMARK: "Mouse_hover",
        CONNECT: "Connection",
        MOVE: "Draging",
        CREATE_NOTE: "Create Note",
        WRITE_NOTE: "Add note",
        TOPIC_CHANGE: "Topic_change"
      },
    methods: {
        isEqual: function(a, b) {
            return (a.duration == b.duration
                && a.InteractionType == b.InteractionType
                && a.ID == b.ID
                && a.time == b.time)
        }
    }
};

InteractionType.enabledInteractionTypeKeyArray = Object.keys(InteractionType.types).filter(function(interactionTypeKey){
    return InteractionType.types[interactionTypeKey].disabled == false;
});
InteractionType.onByDefaultInteractionTypeKeyArray = Object.keys(InteractionType.types).filter(function(interactionTypeKey){
    return InteractionType.enabledInteractionTypeKeyArray.includes(interactionTypeKey) && InteractionType.types[interactionTypeKey].onByDefault == true;
});

export default InteractionType;