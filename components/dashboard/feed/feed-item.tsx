import React from "react";
import { FeedItem } from "@/store/useFeedStore";
import ButtonV2 from "@/components/ui-components/button";
import Image from "next/image";

interface FeedItemProps {
  item: FeedItem;
}

const FeedItemComponent: React.FC<FeedItemProps> = ({ item }) => {
  return (
    <div
      className="w-full bg-white border
    
    border-gray-100 rounded-lg p-6 mb-4 shadow-sm"
    >
      {/* User Info Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
          <Image
            src={item.user.avatar}
            alt={item.user.name}
            width={40}
            height={40}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                item.user.name
              )}&background=6366f1&color=fff`;
            }}
          />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-900">
            {item.user.name}
          </span>
          <span className="text-xs text-gray-500">{item.timeAgo}</span>
        </div>
      </div>

      {/* Idea Title */}
      <h3 className="text-base font-semibold text-gray-900 mb-3">
        {item.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-gray-600 leading-relaxed mb-4">
        {item.description}
        {item.description.length > 150 && (
          <button className="text-blue-600 hover:text-blue-700 ml-1 font-medium">
            More
          </button>
        )}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {item.tags.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Show Interest Button */}
      <div className="flex justify-end">
        <ButtonV2
          type="button"
          className="px-6! py-2! text-sm!"
          variant="default"
          onClick={() => {
            // Handle show interest action
            console.log(`Showing interest in idea: ${item.id}`);
          }}
        >
          Show Interest
        </ButtonV2>
      </div>
    </div>
  );
};

export default FeedItemComponent;
