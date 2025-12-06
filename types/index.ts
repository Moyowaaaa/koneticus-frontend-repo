import React from "react";
import { PORTFOLIO_FIELDS } from "./data";

export type PortfolioLinks = Record<
  (typeof PORTFOLIO_FIELDS)[number]["key"],
  string
>;

export type user = {
  firstName: string;
  lastName: string;
  profile_photo: string;
  email: string;
};

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

export type sideBarRoute = {
  title: string;
  icon: React.ElementType;
  route: string;
  comingSoon?: boolean;
};

export type ProjectStatus = "pending" | "ongoing";

export type Project = {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  image: string;
  collaborators?: (string | Collaborator)[];
  createdAt: string;
  updatedAt: string;
};

export type Collaborator = {
  firstName: string;
  lastName: string;
  email: string;
  role: "Creator" | "Collaborator";
};
