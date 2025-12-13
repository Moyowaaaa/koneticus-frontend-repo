"use client";

import React from "react";
import Image from "next/image";
import { useProfileModalStore } from "@/store/useProfileModalStore";
import Modal from "@/components/ui-components/modal";
import { Button } from "@/components/ui/button";
import { MessageCircle, UserPlus, MoreHorizontal } from "lucide-react";
import { PORTFOLIO_FIELDS } from "@/types/data";

const UserProfileModal = () => {
  const { isOpen, user, closeModal } = useProfileModalStore();

  if (!user) return null;

  const handleSendMessage = () => {
    // TODO: Implement send message functionality
    console.log("Send message to:", user.username);
    closeModal();
  };

  const handleConnect = () => {
    // TODO: Implement connect functionality
    console.log("Connect with:", user.username);
    closeModal();
  };

  return (
    <Modal
      open={isOpen}
      onOpenChange={closeModal}
      className="sm:max-w-[627px]   "
    >
      <div className="flex flex-col items-center space-y-6 py-4 p-4 pb-10">
        {/* Profile Image */}
        <div className="relative">
          <div className="relative h-24 w-24 rounded-full overflow-hidden">
            <Image
              src={user.profile_photo || "/images/dummy-avatar.svg"}
              alt={`${user.first_name} ${user.last_name}`}
              fill
              className="object-cover"
            />
          </div>
          {/* Status Indicator */}
        </div>

        {/* User Info */}
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold text-brand-black">
            {user.first_name} {user.last_name}
          </h3>
          {/* <p className="text-sm text-brand-grey">@{user.username}</p>
          <p className="text-xs text-brand-grey capitalize">
            {user.status || "offline"}
          </p> */}
        </div>

        <div className="w-full min-h-[8rem] p-6 text-base font-[sora-light] border rounded-[1.875rem]">
          {user?.bio}
        </div>

        <div className="space-y-3 w-full">
          {PORTFOLIO_FIELDS.map((field) => (
            <div
              key={field.key}
              className="flex
                          min-h-[3.5rem]
                          items-center gap-3 rounded-[1.875rem] border border-[#E9E9E9] bg-white px-5 py-3"
            >
              <div className="relative h-6 w-6 ">
                <Image src={field.logo} alt={field.key} fill />
              </div>
              <div className="h-5 border border-[#808080]" />
              <input
                className="flex-1 bg-transparent text-sm outline-none"
                placeholder={`Add link..`}
                readOnly
                value={user?.links && user.links[field.key]}
              />
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        {/* <div className="flex gap-3 w-full">
          <Button
            onClick={handleSendMessage}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Message
          </Button>
          <Button
            onClick={handleConnect}
            variant="outline"
            className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Connect
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div> */}
      </div>
    </Modal>
  );
};

export default UserProfileModal;
