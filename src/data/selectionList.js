var SelectionList = {
    dataset: [{
        id: 1,
        short: "Arms",
        name: "Armsdealing"
      },
      {
        id: 2,
        short: "Terrorist",
        name: "TerroristActivity"
      },
      {
        id: 3,
        short: "Disappearance",
        name: "Disappearance"
      },
    ],
    interactionType: [
      /*
      {
        key: "Think_aloud",
        value: true,
        name: "Think Aloud"
      },
      */
      {
        key: "Doc_open",
        value: true,
        name: "Document Open"
      },
      {
        key: "Reading",
        value: true,
        name: "Document Interact"
      },
      {
        key: "Search",
        value: true,
        name: "Search"
      },
      {
        key: "Highlight",
        value: true,
        name: "Highlight"
      },
      {
        key: "Draging",
        value: true,
        name: "Move"
      },
      {
        key: "Mouse_hover",
        value: true,
        name: "Title Hover"
      },
      {
        key: "Connection",
        value: true,
        name: "Connection"
      },
      {
        key: "Create Note",
        value: true,
        name: "Create Note"
      },
      {
        key: "Add note",
        value: true,
        name: "Write in Note"
      },
      {
        key: "Topic_change",
        value: true,
        name: "Topic Change"
      },
      /*
      {
        key: "BOOKMARK",
        value: true,
        name: "Bookmark"
      },
      */
    ],
    users: [
      {id:1, name: "User 1", selectFlag: true},
      {id:2, name: "User 2", selectFlag: true},
      {id:3, name: "User 3", selectFlag: true},
      {id:4, name: "User 4", selectFlag: true},
      {id:5, name: "User 5", selectFlag: true},
      {id:6, name: "User 6", selectFlag: true},
      {id:7, name: "User 7", selectFlag: true},
      {id:8, name: "User 8", selectFlag: true},
      
    ],
    selected: {}
};

export default SelectionList;