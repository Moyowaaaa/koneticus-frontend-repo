"use client";

import React, { useState } from "react";
import TopBar from "../ui-components/top-bar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ProfileSettings from "./profile-settings";
import SecuritySettings from "./security-settings";
import SubscriptionSettings from "./subscription-settings";
import PostHistory from "./post-history";

const SettingsComponent = () => {
  const [activeTab, setActiveTab] = useState("personal");

  return (
    <div className="flex flex-col w-full min-h-screen">
      <div className="flex flex-col gap-6 w-full pt-6 px-6">
        <TopBar>
          <h1 className="text-[2rem] font-semibold text-foreground">Profile</h1>
        </TopBar>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-transparent p-0 h-auto gap-1 border-b border-border/30 rounded-none w-full justify-start">
            <TabsTrigger
              value="personal"
              className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=inactive]:text-muted-foreground rounded-none px-4 py-3 text-sm font-medium transition-colors hover:text-foreground"
            >
              Personal Information
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=inactive]:text-muted-foreground rounded-none px-4 py-3 text-sm font-medium transition-colors hover:text-foreground"
            >
              Security
            </TabsTrigger>
            <TabsTrigger
              value="subscription"
              className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=inactive]:text-muted-foreground rounded-none px-4 py-3 text-sm font-medium transition-colors hover:text-foreground"
            >
              Plans & Subscriptions
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=inactive]:text-muted-foreground rounded-none px-4 py-3 text-sm font-medium transition-colors hover:text-foreground"
            >
              History
            </TabsTrigger>
          </TabsList>

          <div className="pt-8 pb-6">
            <TabsContent value="personal" className="mt-0">
              <ProfileSettings />
            </TabsContent>
            <TabsContent value="security" className="mt-0">
              <SecuritySettings />
            </TabsContent>
            <TabsContent value="subscription" className="mt-0">
              <SubscriptionSettings />
            </TabsContent>
            <TabsContent value="history" className="mt-0">
              <PostHistory />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default SettingsComponent;
