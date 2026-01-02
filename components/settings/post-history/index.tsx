"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";

// Chevron icon for dropdowns
const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4 6L8 10L12 6"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Calendar icon
const CalendarIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12.6667 2.66667H3.33333C2.59695 2.66667 2 3.26362 2 4V13.3333C2 14.0697 2.59695 14.6667 3.33333 14.6667H12.6667C13.403 14.6667 14 14.0697 14 13.3333V4C14 3.26362 13.403 2.66667 12.6667 2.66667Z"
      stroke="currentColor"
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.667 1.33333V4"
      stroke="currentColor"
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.33301 1.33333V4"
      stroke="currentColor"
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2 6.66667H14"
      stroke="currentColor"
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

interface FilterButtonProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}

const FilterButton = ({ label, value, icon, onClick }: FilterButtonProps) => (
  <button
    onClick={onClick}
    className="flex items-center gap-2 px-4 py-2 rounded-full border border-border/50 bg-card/50 hover:border-primary/30 transition-colors"
  >
    <span className="text-sm text-foreground">{label}:</span>
    <span className="text-sm text-muted-foreground">{value}</span>
    {icon || <ChevronDownIcon className="w-4 h-4 text-muted-foreground" />}
  </button>
);

interface PostCardProps {
  title?: string;
  content: string;
  onDelete: () => void;
}

const PostCard = ({ title, content, onDelete }: PostCardProps) => (
  <div className="flex flex-col gap-4">
    <div className="relative flex flex-col p-6 rounded-2xl border border-transparent bg-[#F4F3FF] min-h-[250px]">
      <div className="flex-1 space-y-3">
        {title && (
          <p className="text-sm font-semibold text-foreground">{title}</p>
        )}
        <p className="text-sm text-brand-black leading-relaxed whitespace-pre-wrap">
          {content}
        </p>
      </div>
    </div>
    <div>
      <Button
        onClick={onDelete}
        className="px-6 py-2 rounded-full text-sm bg-[#D85C5C] hover:bg-[#C44B4B] text-white border-none shadow-none"
      >
        Delete
      </Button>
    </div>
  </div>
);

// Sample post data
const samplePosts = [
  {
    id: 1,
    title: "Dear Jordan,",
    content: `I am excited to apply for the position at your company. With my skills and experience, I am confident I can contribute effectively to your team. I look forward to discussing how I can add value to your organization.

Thank you for considering my application.

Best regards,
[Your Name]`,
  },
  {
    id: 2,
    title: "Hey everyone!",
    content: `I'm looking to collaborate on a UX writing project that focuses on enhancing user experiences through clear and engaging content. If you're passionate about crafting user-friendly interfaces and want to join forces, let's connect! Drop a comment or DM me if you're interested. Together, we can create something amazing!`,
  },
];

const PostHistory = () => {
  const [posts, setPosts] = useState(samplePosts);
  const [filters] = useState({
    type: "All",
    status: "All",
    date: "",
  });

  const handleDelete = (id: number) => {
    setPosts((prev) => prev.filter((post) => post.id !== id));
  };

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">History</h2>
        <p className="text-sm text-muted-foreground">
          Manage your posts and collaborations
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <FilterButton label="Type" value={filters.type} />
        <FilterButton label="Status" value="All" />
        <FilterButton
          label="Date"
          value=""
          icon={<CalendarIcon className="w-4 h-4 text-muted-foreground" />}
        />
      </div>

      {/* Posts Grid */}
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              title={post.title}
              content={post.content}
              onDelete={() => handleDelete(post.id)}
            />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-muted-foreground"
              />
              <path
                d="M14 2V8H20"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-muted-foreground"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            No posts yet
          </h3>
          <p className="text-sm text-muted-foreground">
            Your post history will appear here once you create some content.
          </p>
        </div>
      )}
    </div>
  );
};

export default PostHistory;
