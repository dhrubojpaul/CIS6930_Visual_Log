import InteractionType from "./interactionType";

var LegendValues = {
    THINK_ALOUD: {
        name: "Think Aloud",
        class: "int-think-aloud",
        classTT: "int-toolt-think-aloud",
        shape: "triangle_r",
        type: InteractionType.types.THINK_ALOUD
    },
    DOC_OPEN: {
        name: "Open Doc",
        class: "int-doc-open",
        classTT: "int-toolt-doc-open",
        shape: "rect",
        type: InteractionType.types.DOC_OPEN
    },
    READING: {
        name: "Doc Interact",
        class: "int-mouse-over",
        classTT: "int-toolt-mouse-over",
        shape: "rect",
        type: InteractionType.types.READING
    },
    SEARCH: {
        name: "Search",
        class: "int-search",
        classTT: "int-toolt-search",
        shape: "triangle_r",
        type: InteractionType.types.SEARCH
    },
    HIGHLIGHT: {
        name: "Highlight",
        class: "int-highlight",
        classTT: "int-toolt-highlight",
        shape: "diamond",
        type: InteractionType.types.HIGHLIGHT
    },
    MOVE:{
        name: "Move",
        class: "int-move",
        classTT: "int-toolt-move",
        shape: "wye",
        type: InteractionType.types.MOVE

    },
    BOOKMARK: {
        name: "Title Hover",
        class: "int-mouse-hover",
        classTT: "int-toolt-mouse-hover",
        shape: "wye_r",
        type: InteractionType.types.BOOKMARK
    },
    CONNECT: {
        name: "Connection",
        class: "int-connection",
        classTT: "int-toolt-connection",
        shape: "circle",
        type: InteractionType.types.CONNECT
    },
    CREATE_NOTE: {
        name: "Create Note",
        class: "int-create-note",
        classTT: "int-toolt-create-note",
        shape: "rect",
        type: InteractionType.types.CREATE_NOTE
    },
    WRITE_NOTE: {
        name: "Add Note",
        class: "int-add-note",
        classTT: "int-toolt-add-note",
        shape: "triangle",
        type: InteractionType.types.WRITE_NOTE
    },
    TOPIC_CHANGE: {
        name: "Topic Change",
        class: "int-topic-change",
        classTT: "int-toolt-topic-change",
        shape: "rect",
        type: InteractionType.types.TOPIC_CHANGE
    }
};

export default LegendValues;