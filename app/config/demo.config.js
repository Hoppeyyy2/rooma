export const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

export const demoUser = {
  id: "demo-user",
  name: "Alex Rivera",
  email: "alex@example.com",
  pfp: "/Avatar2.png",
  phone: "555-0101",
  points: 240,
  interests: "Cooking, hiking, and discovering new music.",
  age: "26",
  pronouns: "they/them",
  occupation: "Designer",
  school: "Rooma Community",
  preference: ["Quiet evenings", "Shared meals", "Clean spaces"],
  roomId: "demo-room",
};

export const demoRoommates = [
  demoUser,
  {
    id: "demo-roommate-1",
    name: "Jordan Lee",
    pfp: "/Avatar3.png",
    phone: "555-0102",
    points: 185,
    interests: "Plants, weekend markets, and board games.",
    age: "28",
    pronouns: "she/her",
    occupation: "Teacher",
    school: "Rooma Community",
    preference: ["Plants", "Board games", "Shared meals"],
  },
  {
    id: "demo-roommate-2",
    name: "Sam Taylor",
    pfp: "/Avatar4.png",
    phone: "555-0103",
    points: 130,
    interests: "Cycling, films, and trying new recipes.",
    age: "25",
    pronouns: "he/him",
    occupation: "Developer",
    school: "Rooma Community",
    preference: ["Cycling", "Movie nights", "Clean spaces"],
  },
];
