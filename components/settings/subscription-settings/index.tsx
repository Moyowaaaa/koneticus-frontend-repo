"use client";

import React from "react";

const SubscriptionSettings = () => {
  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">
          Plans & Subscriptions
        </h2>
        <p className="text-sm text-muted-foreground">
          Manage your account security settings
        </p>
      </div>

      {/* Subscription content will go here */}
      <div className="py-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
            />
            <path
              d="M16 21V5C16 4.46957 15.7893 3.96086 15.4142 3.58579C15.0391 3.21071 14.5304 3 14 3H10C9.46957 3 8.96086 3.21071 8.58579 3.58579C8.21071 3.96086 8 4.46957 8 5V21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">
          No active subscription
        </h3>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Upgrade to a premium plan to unlock more features and enhance your
          experience.
        </p>
      </div>
    </div>
  );
};

export default SubscriptionSettings;
