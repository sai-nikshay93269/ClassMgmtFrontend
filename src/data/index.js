import { faker } from "@faker-js/faker";
import { useSelector } from "react-redux";
import { format, isSameDay, parseISO } from "date-fns";
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

const useChatHistory = () => {
  const allMessages = useSelector((state) => {
    const selectedGroup = state.app.selectedGroup;
    const selectedClass = state.app.selectedClass;
    const roomId = selectedGroup
      ? `group-${selectedGroup.id}`
      : selectedClass
      ? `class-${selectedClass.id}`
      : null;

    return state.chat.messages[roomId] || [];
  });

  const authUserId = useSelector((state) => state.auth.user.id);

  const transformedMessages = [];

  let lastMessageDate = null;

  allMessages.forEach((chat) => {
    const messageDate = parseISO(chat.timestamp);
    if (!lastMessageDate || !isSameDay(lastMessageDate, messageDate)) {
      transformedMessages.push({
        
        type: "divider",
        text: format(messageDate, "eeee, MMMM d"), // e.g. Monday, April 8
      });
      lastMessageDate = messageDate;
    }

    const isOutgoing = chat.senderId === authUserId;
    const isIncoming = !isOutgoing;

    const base = {
      type: "msg",
      message: chat.message,
      incoming: isIncoming,
      outgoing: isOutgoing,
      senderId: chat.senderId,
    };

    switch (chat.subtype) {
      case "img":
        transformedMessages.push({
          ...base,
          subtype: "img",
          img: chat.img || faker.image.abstract(),
        });
        break;
      case "doc":
        transformedMessages.push({
          ...base,
          subtype: "doc",
          fileUrl: chat.fileUrl || faker.system.commonFileName(),
        });
        break;
      case "link":
        transformedMessages.push({
          ...base,
          subtype: "link",
          preview: chat.preview || faker.image.business(),
        });
        break;
      case "reply":
        transformedMessages.push({
          ...base,
          subtype: "reply",
          reply: chat.reply || "Replied message",
        });
        break;
      default:
        transformedMessages.push(base);
    }
  });

  return transformedMessages;
};

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

const useProjectsList = () => {
  const projects = useSelector((state) => state.project.projects); // or state.project.projectList depending on your slice
  console.log("Projects are: "+ projects)
  return projects.map((project) => ({
    id: project.id,
    classId: project.classId,
    title: project.title,
    description: project.description || "No description provided",
    dueDate: project.dueDate
  }));
};

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

const useSubProjectsList = () => {
  const subProjects = useSelector((state) => state.project.subProjects); // or state.project.projectList depending on your slice
  console.log("SubProjects are: "+ subProjects)
  return subProjects.map((subProject) => ({
    id: subProject.id,
    projectId: subProject.projectId,
    groupId: subProject.groupId || "",
    title: subProject.title,
    description: subProject.description || "No description provided",
    dueDate: subProject.dueDate
  }));
};

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

const useTasksList = () => {
  const tasks = useSelector((state) => state.project.tasks); // Fetched via fetchTasks thunk

  return tasks.map((task) => ({
    id: task.id,
    projectId: task.projectId,
    subProjectId: task.subProjectId || null, // May be null for direct project-level tasks
    assignedTo: task.assignedTo,
    title: task.title,
    description: task.description || "No description provided",
    status: task.status,
    dueDate: task.dueDate,
  }));
};


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

const useNotificationsList = ({ filter = 'ALL' } = {}) => {
  const notifications = useSelector((state) => state.notification.notifications);

  return notifications
    .map((n) => ({
      id: n.id,
      userId: n.userId,
      classId: n.classId || null,
      message: n.message || "No message",
      creationTimestamp: n.creationTimestamp,
      readStatus: n.readStatus || "UNREAD",
    }))
    .filter((n) => {
      if (filter === 'READ') return n.readStatus === 'READ';
      if (filter === 'UNREAD') return n.readStatus === 'UNREAD';
      return true;
    });
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
  useNotificationsList,
  useChatHistory,
  useProjectsList,
  useSubProjectsList,
  useTasksList
};
