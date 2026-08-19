import { describe, expect, it } from "vitest";
import type { FeedItem } from "./feed.model";
import {
  findFeedItem,
  patchFeedItem,
  prependFeedItem,
  removeFeedItem,
  replaceFeedItem,
  type FeedInfiniteData,
} from "./feed.cache";

const makeItem = (id: string, title = id): FeedItem => ({
  _id: id,
  title,
  description: `${title} description`,
  collaborators: [],
  media: [],
  status: "pending",
  teamSize: 2,
  conversationId: null,
  author: {
    _id: "author-1",
    email: "a@example.com",
    userProfile: {
      _id: "profile-1",
      firstname: "Ada",
      lastname: "Lovelace",
    },
  },
  requiredRoles: ["Designer"],
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  __v: 0,
});

const makeData = (ids: string[]): FeedInfiniteData => ({
  pages: [
    {
      message: "Feed",
      items: ids.map((id) => makeItem(id)),
      pagination: {
        nextCursor: "cursor",
        hasMore: true,
        limit: 20,
      },
    },
  ],
  pageParams: [undefined],
});

describe("feed.cache", () => {
  it("prepends onto an empty feed", () => {
    const item = makeItem("new");
    const result = prependFeedItem(undefined, item);

    expect(result.pages).toHaveLength(1);
    expect(result.pages[0].items.map((i) => i._id)).toEqual(["new"]);
  });

  it("prepends to the first page and dedupes", () => {
    const data = makeData(["a", "b"]);
    const withNew = prependFeedItem(data, makeItem("c"));
    expect(withNew.pages[0].items.map((i) => i._id)).toEqual(["c", "a", "b"]);

    const deduped = prependFeedItem(withNew, makeItem("c", "c-again"));
    expect(deduped.pages[0].items.map((i) => i._id)).toEqual(["c", "a", "b"]);
    expect(deduped.pages[0].items[0].title).toBe("c");
  });

  it("removes an item across pages", () => {
    const data: FeedInfiniteData = {
      pages: [
        {
          message: "Feed",
          items: [makeItem("a"), makeItem("b")],
          pagination: { nextCursor: "x", hasMore: true, limit: 20 },
        },
        {
          message: "Feed",
          items: [makeItem("c")],
          pagination: { nextCursor: null, hasMore: false, limit: 20 },
        },
      ],
      pageParams: [undefined, "x"],
    };

    const result = removeFeedItem(data, "b");
    expect(result?.pages[0].items.map((i) => i._id)).toEqual(["a"]);
    expect(result?.pages[1].items.map((i) => i._id)).toEqual(["c"]);
  });

  it("replaces an optimistic id with the real item", () => {
    const data = makeData(["optimistic-1", "a"]);
    const real = makeItem("real-1", "Real");
    const result = replaceFeedItem(data, "optimistic-1", real);

    expect(result?.pages[0].items.map((i) => i._id)).toEqual(["real-1", "a"]);
    expect(result?.pages[0].items[0].title).toBe("Real");
  });

  it("does not duplicate when replacing if real id already exists", () => {
    const data = makeData(["optimistic-1", "real-1"]);
    const real = makeItem("real-1", "Updated");
    const result = replaceFeedItem(data, "optimistic-1", real);

    expect(result?.pages[0].items.map((i) => i._id)).toEqual(["real-1"]);
  });

  it("patches a matching item", () => {
    const data = makeData(["a", "b"]);
    const result = patchFeedItem(data, "b", { status: "ongoing", title: "B2" });

    expect(findFeedItem(result, "b")).toMatchObject({
      _id: "b",
      status: "ongoing",
      title: "B2",
    });
    expect(findFeedItem(result, "a")?.title).toBe("a");
  });
});
