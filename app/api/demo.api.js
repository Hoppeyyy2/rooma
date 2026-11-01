import { demoRoommates, demoUser } from "../config/demo.config";

const STORAGE_KEY = "rooma-demo-state";
const INVITE_CODE = "ROOM24";
const UPDATE_EVENT = "rooma-demo-update";

const atDayOffset = (offset) => {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  date.setHours(12, 0, 0, 0);
  return date.toISOString();
};

const calendarDateOffset = (offset) => {
  const date = new Date(atDayOffset(offset));
  date.setHours(0, 0, 0, 0);
  return `${date.toISOString().replace(/T.*$/, "")}T00:00:00.000Z`;
};

const createInitialState = () => {
  const schedules = [
    {
      id: "demo-schedule-kitchen",
      title: "Wipe down the kitchen",
      points: 20,
      assignedUsers: [demoUser.id, demoRoommates[1].id],
      days: ["Monday", "Wednesday", "Friday"],
    },
    {
      id: "demo-schedule-plants",
      title: "Water the plants",
      points: 10,
      assignedUsers: [demoRoommates[2].id],
      days: ["Tuesday", "Saturday"],
    },
  ];

  const tasks = [
    {
      id: "demo-task-today",
      title: "Wipe down the kitchen",
      date: atDayOffset(0),
      userId: demoUser.id,
      status: "incomplete",
      color: "#F0C789",
      points: 20,
    },
    {
      id: "demo-task-tomorrow",
      title: "Water the plants",
      date: atDayOffset(1),
      userId: demoRoommates[2].id,
      status: "incomplete",
      color: "#ABCDED",
      points: 10,
    },
  ];

  return {
    user: { ...demoUser },
    roommates: demoRoommates.map((roommate) => ({
      ...roommate,
      preference: [...roommate.preference],
      clicked: false,
    })),
    schedules,
    tasks,
    events: [
      {
        id: "demo-event-today",
        title: "Roommate dinner",
        description: "Pasta night in the kitchen",
        startAt: calendarDateOffset(0),
        endAt: calendarDateOffset(0),
        color: "#F0C789",
      },
    ],
  };
};

const loadState = () => {
  if (typeof window === "undefined") {
    throw new Error("Demo data is only available in the browser.");
  }

  const savedState = window.localStorage.getItem(STORAGE_KEY);
  return savedState ? JSON.parse(savedState) : createInitialState();
};

const saveState = (state) => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  window.dispatchEvent(new Event(UPDATE_EVENT));
};

const response = (config, data) => ({
  data,
  status: 200,
  statusText: "OK",
  headers: {},
  config,
});

const parseRequestData = (data) => {
  if (typeof data !== "string") {
    return data || {};
  }

  return data ? JSON.parse(data) : {};
};

export const requestDemoApi = (config) => {
  const method = (config.method || "get").toLowerCase();
  const url = new URL(config.url, config.baseURL || window.location.origin);
  const path = url.pathname.replace(/\/+$/, "").replace(/\s+$/, "");
  const data = parseRequestData(config.data);
  const state = loadState();
  let result;

  if (method === "get" && path.endsWith("/user/roommates")) {
    result = { roommates: state.roommates };
  } else if (method === "get" && path.endsWith("/task/list")) {
    result = { tasks: state.tasks };
  } else if (method === "get" && path.endsWith("/task/schedule")) {
    result = { schedules: state.schedules };
  } else if (method === "post" && path.endsWith("/task/create")) {
    const assignedUsers = data.assignedUsers?.length
      ? data.assignedUsers
      : [state.user.id];
    const days = data.days?.length
      ? data.days
      : [new Date().toLocaleDateString("en-US", { weekday: "long" })];
    const schedule = {
      id: `demo-schedule-${Date.now()}`,
      title: data.title,
      points: Number(data.points) || 10,
      assignedUsers,
      days,
    };

    state.schedules.push(schedule);
    for (let offset = 0; offset < 7; offset += 1) {
      const date = new Date();
      date.setDate(date.getDate() + offset);
      const weekday = date.toLocaleDateString("en-US", { weekday: "long" });
      if (days.includes(weekday)) {
        assignedUsers.forEach((userId) => {
          const roommate = state.roommates.find((member) => member.id === userId);
          state.tasks.push({
            id: `demo-task-${Date.now()}-${offset}-${userId}`,
            title: data.title,
            date: atDayOffset(offset),
            userId,
            status: "incomplete",
            color: roommate?.color || "#C0B6FF",
            points: schedule.points,
          });
        });
      }
    }

    saveState(state);
    result = { schedule };
  } else if (method === "post" && path.endsWith("/task/complete")) {
    const task = state.tasks.find(
      (item) => item.id === data.id && item.userId === data.userId
    );
    if (task) {
      task.status = "complete";
      const roommate = state.roommates.find(
        (member) => member.id === task.userId
      );
      if (roommate) {
        roommate.points = (Number(roommate.points) || 0) + task.points;
      }
      if (state.user.id === task.userId) {
        state.user.points = (Number(state.user.points) || 0) + task.points;
      }
    }
    saveState(state);
    result = { task };
  } else if (method === "get" && path.endsWith("/event/list")) {
    const startAt = new Date(url.searchParams.get("startAt") || 0).getTime();
    const endAt = new Date(
      url.searchParams.get("endAt") || Number.MAX_SAFE_INTEGER
    ).getTime();
    result = {
      events: state.events.filter((event) => {
        const eventTime = new Date(event.startAt).getTime();
        return eventTime >= startAt && eventTime <= endAt;
      }),
    };
  } else if (method === "post" && path.endsWith("/event/create")) {
    const event = {
      ...data,
      id: `demo-event-${Date.now()}`,
      color: data.color || "#F0C789",
    };
    state.events.push(event);
    saveState(state);
    result = { event };
  } else if (method === "delete" && path.includes("/event/delete/")) {
    const eventId = path.split("/").pop();
    state.events = state.events.filter((event) => event.id !== eventId);
    saveState(state);
    result = { success: true };
  } else if (method === "patch" && path.endsWith("/user/update")) {
    state.user = { ...state.user, ...data };
    state.roommates = state.roommates.map((roommate) =>
      roommate.id === state.user.id ? { ...roommate, ...data } : roommate
    );
    saveState(state);
    result = { user: state.user };
  } else if (method === "get" && path.endsWith("/room/invcode")) {
    result = { invcode: INVITE_CODE };
  } else if (method === "patch" && path.endsWith("/room/join")) {
    if (data.invcode !== INVITE_CODE) {
      throw new Error("Invalid demo invite code. Use ROOM24.");
    }
    result = { success: true };
  } else if (method === "patch" && path.endsWith("/room/leave")) {
    result = { success: true };
  } else if (method === "post" && path.endsWith("/room/create")) {
    result = { room: { id: "demo-room", ...data } };
  } else if (method === "get" && path.endsWith("/auth/local")) {
    result = { user: state.user };
  } else if (method === "post" && path.endsWith("/auth/local")) {
    state.user = {
      ...state.user,
      email: data.email || state.user.email,
      name: data.name || state.user.name,
    };
    saveState(state);
    result = { user: state.user };
  } else if (method === "post" && path.endsWith("/auth/local/register")) {
    result = { success: true };
  } else if (method === "get" && path.endsWith("/auth/authenticate")) {
    result = { user: state.user };
  } else if (
    method === "get" &&
    (path.endsWith("/user/logout") || path.endsWith("/auth/logout"))
  ) {
    result = { success: true };
  } else {
    throw new Error(`Demo API does not support ${method.toUpperCase()} ${path}.`);
  }

  return response(config, result);
};

export const demoApiAdapter = (config) => Promise.resolve(requestDemoApi(config));
export const demoUpdateEvent = UPDATE_EVENT;
