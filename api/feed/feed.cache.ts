import type { InfiniteData } from "@tanstack/react-query";
import type { PaginatedResponse } from "../appConfig";
import type { ILoginUserData } from "../auth/auth.model";
import type { ICreateProjectPayload, Project } from "../projects/projects.model";
import type { FeedItem } from "./feed.model";

export type FeedInfiniteData = InfiniteData<PaginatedResponse<FeedItem>>;

export function isOptimisticFeedId(id: string): boolean {
  return id.startsWith("optimistic-");
}

export function mapProjectToFeedItem(
  project: Project,
  user?: ILoginUserData | null,
): FeedItem {
  const authorFromProject =
    typeof project.author === "object" && project.author !== null
      ? project.author
      : null;

  const authorId =
    authorFromProject?._id ||
    (typeof project.author === "string" ? project.author : user?._id) ||
    "";

  const profile = authorFromProject?.userProfile;
  const rawPicture = profile?.profilePicture;
  const profilePicture = rawPicture?.url
    ? {
        url: rawPicture.url,
        id: rawPicture.id || rawPicture._id || "",
        _id: rawPicture._id || rawPicture.id || "",
      }
    : user?.profilePicture
      ? { url: user.profilePicture, id: "", _id: "" }
      : undefined;

  return {
    _id: project._id,
    title: project.title,
    description: project.description,
    collaborators: [],
    media: project.media ?? [],
    status: project.status,
    teamSize: project.teamSize,
    conversationId: project.conversationId,
    author: {
      _id: authorId,
      email: authorFromProject?.email || user?.email || "",
      userProfile: {
        _id: profile?._id || authorId,
        firstname: profile?.firstname || user?.firstname || "",
        lastname: profile?.lastname || user?.lastname || "",
        profilePicture,
        roles: profile?.roles || user?.roles,
      },
    },
    requiredRoles: project.requiredRoles,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
    __v: project.__v ?? 0,
  };
}

export function buildOptimisticFeedItem(
  payload: ICreateProjectPayload,
  user: ILoginUserData | null | undefined,
  optimisticId: string,
): FeedItem {
  const now = new Date().toISOString();
  const media =
    payload.media?.map((file, index) => ({
      url: URL.createObjectURL(file),
      id: `local-${index}`,
      _id: `local-${index}`,
    })) ?? [];

  return {
    _id: optimisticId,
    title: payload.title,
    description: payload.description,
    collaborators: [],
    media,
    status: "draft",
    teamSize: payload.teamSize,
    conversationId: null,
    author: {
      _id: user?._id || "",
      email: user?.email || "",
      userProfile: {
        _id: user?._id || "",
        firstname: user?.firstname || "",
        lastname: user?.lastname || "",
        profilePicture: user?.profilePicture
          ? { url: user.profilePicture, id: "", _id: "" }
          : undefined,
        roles: user?.roles,
      },
    },
    requiredRoles: payload.requiredRoles,
    createdAt: now,
    updatedAt: now,
    __v: 0,
  };
}

export function revokeOptimisticMediaUrls(item: FeedItem | undefined): void {
  if (!item || !isOptimisticFeedId(item._id)) return;
  for (const media of item.media) {
    if (media.url.startsWith("blob:")) {
      URL.revokeObjectURL(media.url);
    }
  }
}

export function prependFeedItem(
  data: FeedInfiniteData | undefined,
  item: FeedItem,
): FeedInfiniteData {
  if (!data?.pages?.length) {
    return {
      pages: [
        {
          message: "Feed",
          items: [item],
          pagination: {
            nextCursor: null,
            hasMore: false,
            limit: 20,
          },
        },
      ],
      pageParams: [undefined],
    };
  }

  const pages = data.pages.map((page, pageIndex) => {
    if (pageIndex !== 0) return page;
    if (page.items.some((existing) => existing._id === item._id)) return page;
    return { ...page, items: [item, ...page.items] };
  });

  return { ...data, pages };
}

export function removeFeedItem(
  data: FeedInfiniteData | undefined,
  id: string,
): FeedInfiniteData | undefined {
  if (!data?.pages?.length) return data;

  return {
    ...data,
    pages: data.pages.map((page) => ({
      ...page,
      items: page.items.filter((item) => item._id !== id),
    })),
  };
}

export function replaceFeedItem(
  data: FeedInfiniteData | undefined,
  optimisticId: string,
  item: FeedItem,
): FeedInfiniteData | undefined {
  if (!data?.pages?.length) {
    return prependFeedItem(undefined, item);
  }

  let replaced = false;

  const pages = data.pages.map((page, pageIndex) => {
    const withoutOptimistic = page.items.filter(
      (existing) => existing._id !== optimisticId,
    );

    if (pageIndex === 0) {
      const alreadyPresent = withoutOptimistic.some(
        (existing) => existing._id === item._id,
      );
      replaced = true;
      return {
        ...page,
        items: alreadyPresent ? withoutOptimistic : [item, ...withoutOptimistic],
      };
    }

    return { ...page, items: withoutOptimistic };
  });

  if (!replaced) return prependFeedItem(data, item);
  return { ...data, pages };
}

export function patchFeedItem(
  data: FeedInfiniteData | undefined,
  id: string,
  patch: Partial<FeedItem>,
): FeedInfiniteData | undefined {
  if (!data?.pages?.length) return data;

  return {
    ...data,
    pages: data.pages.map((page) => ({
      ...page,
      items: page.items.map((item) =>
        item._id === id ? { ...item, ...patch } : item,
      ),
    })),
  };
}

export function findFeedItem(
  data: FeedInfiniteData | undefined,
  id: string,
): FeedItem | undefined {
  if (!data?.pages) return undefined;
  for (const page of data.pages) {
    const match = page.items.find((item) => item._id === id);
    if (match) return match;
  }
  return undefined;
}
