"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Modal from "@/components/ui-components/modal";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSearchStore } from "@/store/useSearchStore";
import { useGlobalSearch } from "@/api/search/search.queries";
import type { SearchProject, SearchUser } from "@/api/search/search.model";
import { SearchNormal } from "iconsax-reactjs";

const SearchModal = () => {
  const router = useRouter();
  const { setShowSearch, searchQuery, setSearchQuery, showSearch } =
    useSearchStore();
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data, isFetching, isError } = useGlobalSearch(debouncedQuery, {
    enabled: showSearch,
  });

  const projects = data?.projects ?? [];
  const users = data?.users ?? [];
  const hasQuery = debouncedQuery.length >= 2;
  const hasResults = projects.length > 0 || users.length > 0;

  const closeSearch = () => {
    setShowSearch(false);
    setSearchQuery("");
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      closeSearch();
      return;
    }
    setShowSearch(true);
  };

  const openProject = (project: SearchProject) => {
    closeSearch();
    if (project.status === "draft") {
      router.push("/dashboard/ideas");
      return;
    }
    router.push(`/dashboard/projects/ongoing/${project._id}`);
  };

  const openUser = (_user: SearchUser) => {
    // Public profile pages are not wired yet — keep discovery visible in results
    closeSearch();
  };

  return (
    <Modal
      className="bg-[transparent]!"
      containerClassname="bg-[transparent]! flex flex-col gap-4 bg-none!"
      open={showSearch}
      onOpenChange={handleOpenChange}
    >
      <div className="relative rounded-[1.875rem] border-2 border-primary bg-white p-4 dark:bg-[#151515]">
        <div className="flex items-center gap-3 rounded-full bg-white dark:bg-[#151515]">
          <SearchNormal size={20} color="#8C8C8C" />
          <Input
            autoFocus
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search people and projects"
            className="border-none text-base text-brand-black shadow-none placeholder:text-brand-grey focus-visible:ring-0 dark:bg-[#151515] dark:text-white"
          />
        </div>
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#7F5CFF]/30 via-transparent to-[#5FE0FF]/20 blur-3xl dark:hidden"
          aria-hidden
        />
      </div>

      <div className="relative mt-4 h-[30rem] w-full overflow-hidden rounded-[1.875rem] bg-white dark:bg-[#151515]">
        <ScrollArea className="h-full">
          <div className="flex flex-col gap-6 p-4">
            {!hasQuery ? (
              <p className="py-16 text-center text-sm text-brand-grey">
                Type at least 2 characters to search
              </p>
            ) : isFetching && !data ? (
              <p className="py-16 text-center text-sm text-brand-grey">
                Searching...
              </p>
            ) : isError ? (
              <p className="py-16 text-center text-sm text-brand-grey">
                Couldn&apos;t search right now. Try again.
              </p>
            ) : !hasResults ? (
              <p className="py-16 text-center text-sm text-brand-grey">
                No results for &ldquo;{debouncedQuery}&rdquo;
              </p>
            ) : (
              <>
                {users.length > 0 && (
                  <section className="flex flex-col gap-2">
                    <h2 className="px-1 text-xs font-semibold tracking-wide text-brand-grey uppercase">
                      People
                    </h2>
                    <div className="flex flex-col gap-1">
                      {users.map((user) => {
                        const name =
                          `${user.firstname} ${user.lastname}`.trim();
                        const avatar =
                          user.profilePicture?.url ||
                          "/images/dummy-avatar.svg";
                        const roles = user.roles?.slice(0, 2).join(" · ");

                        return (
                          <button
                            key={user._id}
                            type="button"
                            onClick={() => openUser(user)}
                            className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors hover:bg-lavender dark:hover:bg-[#211E1E]"
                          >
                            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
                              <Image
                                src={avatar}
                                alt={name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate font-medium text-brand-black dark:text-white">
                                {name}
                              </p>
                              <p className="truncate text-xs text-brand-grey">
                                {roles || user.bio || "Member"}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </section>
                )}

                {projects.length > 0 && (
                  <section className="flex flex-col gap-2">
                    <h2 className="px-1 text-xs font-semibold tracking-wide text-brand-grey uppercase">
                      Projects
                    </h2>
                    <div className="flex flex-col gap-1">
                      {projects.map((project) => (
                        <button
                          key={project._id}
                          type="button"
                          onClick={() => openProject(project)}
                          className="flex w-full flex-col gap-1 rounded-2xl px-3 py-2.5 text-left transition-colors hover:bg-lavender dark:hover:bg-[#211E1E]"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <p className="truncate font-medium text-brand-black dark:text-white">
                              {project.title}
                            </p>
                            <span className="shrink-0 rounded-full bg-[#E9E9E9] px-2 py-0.5 text-[0.6875rem] capitalize text-brand-grey dark:bg-[#80808026]">
                              {project.status}
                            </span>
                          </div>
                          {project.description ? (
                            <p className="line-clamp-2 text-xs text-brand-grey">
                              {project.description}
                            </p>
                          ) : null}
                        </button>
                      ))}
                    </div>
                  </section>
                )}
              </>
            )}
          </div>
        </ScrollArea>
      </div>
    </Modal>
  );
};

export default SearchModal;
