"use client";

import { X } from "lucide-react";
import React, { KeyboardEvent, useRef, useState } from "react";
import { ROLE_SUGGESTIONS } from "@/types/data";

interface TagInputProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  placeholder?: string;
  suggestions?: string[];
  disabled?: boolean;
  className?: string;
}

const TagInput = ({
  selectedTags,
  onTagsChange,
  placeholder = "Enter tags e.g Designer",
  suggestions = ROLE_SUGGESTIONS,
  disabled = false,
  className = "",
}: TagInputProps) => {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter suggestions: exclude selected ones and filter by input text
  const filteredSuggestions = suggestions.filter(
    (suggestion) =>
      !selectedTags.includes(suggestion) &&
      (inputValue === "" ||
        suggestion.toLowerCase().includes(inputValue.toLowerCase()))
  );

  const handleAddTag = (tag?: string) => {
    const tagToAdd = (tag ?? inputValue).trim();
    if (!tagToAdd) return;

    // Avoid duplicates
    if (!selectedTags.includes(tagToAdd)) {
      onTagsChange([...selectedTags, tagToAdd]);
    }
    setInputValue("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onTagsChange(selectedTags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (inputValue.trim()) {
        handleAddTag();
      }
    } else if (
      event.key === "Backspace" &&
      !inputValue &&
      selectedTags.length > 0
    ) {
      // Remove last tag when pressing backspace on empty input
      handleRemoveTag(selectedTags[selectedTags.length - 1]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Input with selected tags inline */}
      <div
        className="flex flex-wrap items-center gap-2 w-full py-3 border-y border-[#E9E9E9] dark:border-[#80808026] cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        {/* Selected Tags */}
        {selectedTags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-full min-h-8 bg-purple-light px-3 py-1 text-sm text-brand-black"
          >
            {tag}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveTag(tag);
              }}
              className="text-primary/70 hover:text-primary transition-colors"
              disabled={disabled}
              aria-label={`Remove ${tag}`}
            >
              <X size={14} className="text-[#211E1E]" />
            </button>
          </span>
        ))}

        {/* Input Field */}
        <input
          ref={inputRef}
          type="text"
          className="flex-1 min-w-[120px] bg-transparent 
          placeholder:text-[#E6E4FF]
          text-sm outline-none dark:bg-transparent  
          py-2
          dark:placeholder:text-brand-grey"
          placeholder={selectedTags.length === 0 ? placeholder : "Add more..."}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
        />
      </div>

      {/* Inline Suggestions */}
      {inputValue.length > 0 && filteredSuggestions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {filteredSuggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => handleAddTag(suggestion)}
              disabled={disabled}
              className="rounded-full border border-[#E9E9E9] px-3 py-1 text-sm text-grey transition hover:border-primary hover:text-primary disabled:opacity-50"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TagInput;
