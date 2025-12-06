import { Collaborator, Project } from ".";

export const STEP_TITLES = ["Information", "Roles", "Profile"];
export const TOTAL_STEPS = STEP_TITLES.length + 1; // include initial email capture step
export const LAST_STEP_INDEX = TOTAL_STEPS - 1;

export const SOCIAL_PROVIDERS = [
  { label: "Continue with Google", icon: "/images/google.svg" },
  { label: "Continue with Github", icon: "/images/github.svg" },
  { label: "Continue with Microsoft", icon: "/images/microsoft.svg" },
];

export const ROLE_SUGGESTIONS = [
  "UI/UX Designer",
  "Writer",
  "Print Designer",
  "3D Artist",
  "Illustrator",
];

export const PORTFOLIO_FIELDS = [
  { key: "github", logo: "/images/github.svg" },
  { key: "behance", logo: "/images/behance.svg" },

  { key: "website", logo: "/images/web.svg" },
] as const;

export const mockProjects: Project[] = [
  {
    id: "1",
    title: "Idea title would be in this place",
    description: "Here, the description would be well appreciated about the...",
    status: "pending",
    image: "/images/project.png",
    createdAt: "2024-09-26",
    updatedAt: "2024-09-26",
  },
  {
    id: "2",
    title: "Creative Design System",
    description:
      "Building a comprehensive design system for modern web applications...",
    status: "pending",
    image: "/images/project2.png",

    createdAt: "2024-09-25",
    updatedAt: "2024-09-26",
  },
  {
    id: "3",
    title: "Mobile App Collaboration",
    description:
      "Developing a mobile application for creative collaboration...",
    status: "ongoing",
    image: "/images/project.png",

    collaborators: ["John", "Sarah", "Mike", "Anna"],
    createdAt: "2024-09-20",
    updatedAt: "2024-09-26",
  },
];

export const dummyUsers: Collaborator[] = [
  {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    role: "Creator",
  },
  {
    firstName: "Durodoluwa",
    lastName: "Jade",
    email: "jade.durodoluwa@example.com",
    role: "Collaborator",
  },
  {
    firstName: "Sandra",
    lastName: "Johnson",
    email: " sandra.johnson@example.com",
    role: "Creator",
  },
];
