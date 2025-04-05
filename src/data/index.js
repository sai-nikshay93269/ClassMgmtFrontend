import { faker } from "@faker-js/faker";
import { useSelector } from "react-redux";
import {
  ChatCircleDots,
  Gear,
  GearSix,
  Phone,
  SignOut,
  User,
  Users,
  Bell
} from "phosphor-react";

const Profile_Menu = [
  {
    title: "Profile",
    icon: <User />,
  },
  {
    title: "Settings",
    icon: <Gear />,
  },
  {
    title: "Logout",
    icon: <SignOut />,
  },
];

const Nav_Buttons = [
  {
    index: 0,
    icon: <ChatCircleDots />,
  },
  {
    index: 4,
    title: "Notifications",
    icon: <Bell size={20} />,
  }
  
];

const Nav_Setting = [
  {
    index: 3,
    icon: <GearSix />,
  },
];



const MembersList = [
  {
    id:0,
    img: faker.image.avatar(),
    name: faker.name.firstName(),
    online: true
  },
  {
    id:1,
    img: faker.image.avatar(),
    name: faker.name.firstName(),
    online: false
  },
  {
    id:2,
    img: faker.image.avatar(),
    name: faker.name.firstName(),
    online: true
  },
  {
    id:3,
    img: faker.image.avatar(),
    name: faker.name.firstName(),
    online: false
  },
  {
    id:4,
    img: faker.image.avatar(),
    name: faker.name.firstName(),
    online: true
  }
];

const useChatList = () => {
  const classes = useSelector((state) => state.class.classes);

  return classes.map((classItem) => ({
      id: classItem.id,
      img: faker.image.avatar(), 
      name: classItem.name, 
      description: classItem.description || "No description available",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), 
      unread: 0, 
      pinned: false, 
      online: false,
      members: classItem.members || [], 
  }));
};

const Chat_History = [
  {
    type: "msg",
    message: "Hi 👋🏻, How are ya ?",
    incoming: true,
    outgoing: false,
  },
  {
    type: "divider",
    text: "Today",
  },
  {
    type: "msg",
    message: "Hi 👋 Panda, not bad, u ?",
    incoming: false,
    outgoing: true,
  },
  {
    type: "msg",
    message: "Can you send me an abstarct image?",
    incoming: false,
    outgoing: true,
  },
  {
    type: "msg",
    message: "Ya sure, sending you a pic",
    incoming: true,
    outgoing: false,
  },

  {
    type: "msg",
    subtype: "img",
    message: "Here You Go",
    img: faker.image.abstract(),
    incoming: true,
    outgoing: false,
  },
  {
    type: "msg",
    message: "Can you please send this in file format?",
    incoming: false,
    outgoing: true,
  },

  {
    type: "msg",
    subtype: "doc",
    message: "Yes sure, here you go.",
    incoming: true,
    outgoing: false,
  },
  {
    type: "msg",
    subtype: "link",
    preview: faker.image.cats(),
    message: "Yep, I can also do that",
    incoming: true,
    outgoing: false,
  },
  {
    type: "msg",
    subtype: "reply",
    reply: "This is a reply",
    message: "Yep, I can also do that",
    incoming: false,
    outgoing: true,
  },
];

const Message_options = [
  {
    title: "Reply",
  },
  {
    title: "Star message",
  },
  {
    title: "Delete Message",
  },
];

const SHARED_LINKS = [
  {
    type: "msg",
    subtype: "link",
    preview: faker.image.cats(),
    message: "Yep, I can also do that",
    incoming: true,
    outgoing: false,
  },
  {
    type: "msg",
    subtype: "link",
    preview: faker.image.cats(),
    message: "Yep, I can also do that",
    incoming: true,
    outgoing: false,
  },
  {
    type: "msg",
    subtype: "link",
    preview: faker.image.cats(),
    message: "Yep, I can also do that",
    incoming: true,
    outgoing: false,
  },
  {
    type: "msg",
    subtype: "link",
    preview: faker.image.cats(),
    message: "Yep, I can also do that",
    incoming: true,
    outgoing: false,
  }
]

const SHARED_DOCS = [
  {
    type: "msg",
    subtype: "doc",
    message: "Yes sure, here you go.",
    incoming: true,
    outgoing: false,
  },
  {
    type: "msg",
    subtype: "doc",
    message: "Yes sure, here you go.",
    incoming: true,
    outgoing: false,
  },
  {
    type: "msg",
    subtype: "doc",
    message: "Yes sure, here you go.",
    incoming: true,
    outgoing: false,
  },
  {
    type: "msg",
    subtype: "doc",
    message: "Yes sure, here you go.",
    incoming: true,
    outgoing: false,
  },
 
]

const ProjectsList = [
  {
    id: "proj-1",
    classId: "101",
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    dueDate: faker.date.future(),
  },
  {
    id: "proj-2",
    classId: "101",
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    dueDate: faker.date.future(),
  },
  {
    id: "proj-3",
    classId: "101",
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    dueDate: faker.date.future(),
  },
  {
    id: "proj-4",
    classId: "101",
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    dueDate: faker.date.future(),
  },
  {
    id: "proj-5",
    classId: "101",
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    dueDate: faker.date.future(),
  },
  {
    id: "3",
    classId: "102",
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    dueDate: faker.date.future(),
  },
  {
    id: "4",
    classId: "103",
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    dueDate: faker.date.future(),
  },
];

const SubProjectsList = [
  {
    id: "subproj-1",
    projectId: "proj-1",
    groupId: "group-1",
    title: "Database Schema Design",
    description: faker.commerce.productDescription(),
    dueDate: "2025-04-10T23:59:00"
  },
  {
    id: "subproj-2",
    projectId: "proj-1",
    groupId: "group-2",
    title: "API Development",
    description: faker.commerce.productDescription(),
    dueDate: "2025-04-15T23:59:00"
  },
  {
    id: "subproj-3",
    projectId: "proj-1",
    groupId: "group-2",
    title: "API Development",
    description: faker.commerce.productDescription(),
    dueDate: "2025-04-15T23:59:00"
  },
  {
    id: "subproj-4",
    projectId: "proj-1",
    groupId: "group-2",
    title: "API Development",
    description: faker.commerce.productDescription(),
    dueDate: "2025-04-15T23:59:00"
  },
  {
    id: "subproj-3",
    projectId: "proj-2",
    groupId: null,
    title: "Frontend UI Implementation",
    description: faker.commerce.productDescription(),
    dueDate: "2025-04-12T23:59:00"
  }
];


const TasksList = [
  {
    id: "task-1",
    projectId: "proj-1",
    subProjectId: "subproj-1",
    assignedTo: "user-101",
    title: "Create ER Diagram",
    description: "Design the ER diagram for the project database",
    status: "Pending",
    dueDate: "2025-04-05T23:59:00"
  },
  {
    id: "task-2",
    projectId: "proj-1",
    subProjectId: "subproj-2",
    assignedTo: "user-102",
    title: "Implement Authentication API",
    description: "Develop authentication endpoints using Spring Security",
    status: "In Progress",
    dueDate: "2025-04-08T23:59:00"
  },
  {
    id: "task-3",
    projectId: "proj-2",
    subProjectId: null,
    assignedTo: "user-103",
    title: "Design Login Page",
    description: "Create a login page with React and Tailwind CSS",
    status: "Completed",
    dueDate: "2025-04-07T23:59:00"
  }
];

const NotificationsList = () => {
  return Array.from({ length: 5 }).map((_, index) => ({
    id: faker.datatype.uuid(),
    userId: faker.datatype.uuid(),
    classId: faker.datatype.uuid(),
    message: faker.lorem.sentence(),
    creationTimestamp: faker.date.recent(),
    readStatus: Math.random() > 0.5 ? "READ" : "UNREAD", // Randomly mark as read/unread
  }));
};


export {
  ProjectsList,
  SubProjectsList,
  TasksList,
  Profile_Menu,
  Nav_Setting,
  Nav_Buttons,
  useChatList,
  Chat_History,
  Message_options,
  SHARED_DOCS,
  SHARED_LINKS,
  MembersList,
  NotificationsList
};
