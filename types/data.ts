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
  { key: "linkedin", logo: "/images/linkedin.svg" },
  { key: "website", logo: "/images/web.svg" },
] as const;
