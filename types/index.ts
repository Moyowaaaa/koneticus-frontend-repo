import { PORTFOLIO_FIELDS } from "./data";

export type PortfolioLinks = Record<
  (typeof PORTFOLIO_FIELDS)[number]["key"],
  string
>;

export type SignUpFormData = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  roles: string[];
  bio: string;
  portfolio: PortfolioLinks;
};

export const INITIAL_STATE: SignUpFormData = {
  email: "",
  firstName: "",
  lastName: "",
  password: "",
  roles: [],
  bio: "",
  portfolio: {
    website: "",
    behance: "",
    github: "",
  },
};
