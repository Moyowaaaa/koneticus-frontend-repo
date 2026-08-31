export const PROJECT_PIPELINE_STATUSES = [
  "draft",
  "seeking_collaborators",
  "ongoing",
  "completed",
] as const;

export type ProjectPipelineStatus = (typeof PROJECT_PIPELINE_STATUSES)[number];

export type ProjectStatus =
  | ProjectPipelineStatus
  | "pending" // legacy alias from API
  | "deleted"
  | "archived";

/** Normalize legacy `pending` → `seeking_collaborators`. */
export const normalizeProjectStatus = (
  status: string | undefined | null,
): ProjectStatus | string => {
  if (!status) return status ?? "";
  if (status === "pending") return "seeking_collaborators";
  return status;
};

export const PROJECT_STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  pending: "Seeking collaborators",
  seeking_collaborators: "Seeking collaborators",
  ongoing: "Ongoing",
  completed: "Completed",
  deleted: "Deleted",
  archived: "Archived",
};

export const getProjectStatusLabel = (status: string): string =>
  PROJECT_STATUS_LABELS[normalizeProjectStatus(status)] || status;

/** Tailwind classes for feed / card status pills. */
export const getProjectStatusTagClass = (status: string): string => {
  const normalized = normalizeProjectStatus(status);
  switch (normalized) {
    case "draft":
      return "bg-[#F5F4FF] text-[#6155F5] dark:bg-[#6155F5]/15 dark:text-[#A8A1FF]";
    case "seeking_collaborators":
      return "bg-[#EEF8F1] text-[#1B7A3D] dark:bg-[#1B7A3D]/20 dark:text-[#7DDB9E]";
    case "ongoing":
      return "bg-[#EEF2FF] text-[#3B4CCA] dark:bg-[#3B4CCA]/20 dark:text-[#A5B4FC]";
    case "completed":
      return "bg-[#F3F4F6] text-[#4B5563] dark:bg-[#80808026] dark:text-[#B0B0B0]";
    default:
      return "bg-[#F5F4FF] text-[#6155F5] dark:bg-[#6155F5]/15";
  }
};

export const isDraftStatus = (status: string): boolean =>
  normalizeProjectStatus(status) === "draft";

export const isSeekingCollaboratorsStatus = (status: string): boolean =>
  normalizeProjectStatus(status) === "seeking_collaborators";

/** teamSize includes the author; collaborators fill the remaining seats. */
export const getMaxCollaboratorSlots = (teamSize: number): number =>
  Math.max(0, teamSize - 1);

export const isTeamFull = (
  collaboratorCount: number,
  teamSize: number,
): boolean => collaboratorCount >= getMaxCollaboratorSlots(teamSize);

/**
 * Seeking tag only while seats remain. When full, hide it until the project
 * moves to ongoing/completed (avoids false "still recruiting" signal).
 */
export const shouldShowFeedStatusTag = (
  status: string,
  collaboratorCount: number,
  teamSize: number,
): boolean => {
  const normalized = normalizeProjectStatus(status);
  if (normalized === "seeking_collaborators") {
    return !isTeamFull(collaboratorCount, teamSize);
  }
  return (
    normalized === "draft" ||
    normalized === "ongoing" ||
    normalized === "completed"
  );
};

type InterestGateOptions = {
  collaboratorCount: number;
  teamSize: number;
  isCollaborator?: boolean;
  myRequestStatus?: "pending" | "accepted" | "rejected" | null;
};

/** Show Interest only while recruiting, seats remain, and viewer hasn't applied/joined. */
export const canShowInterest = (
  status: string,
  options?: InterestGateOptions,
): boolean => {
  if (!isSeekingCollaboratorsStatus(status)) return false;
  if (!options) return true;
  if (options.isCollaborator) return false;
  if (
    options.myRequestStatus === "pending" ||
    options.myRequestStatus === "accepted"
  ) {
    return false;
  }
  if (isTeamFull(options.collaboratorCount, options.teamSize)) return false;
  return true;
};
