import TopBar from "@/components/ui-components/top-bar";
import React from "react";

export const RecentActivitiesEmptyState = () => {
  return (
    <div className="h-[25rem] flex items-center justify-center  w-full">
      <p className="text-brand-black text-[0.875rem]">
        There are no recent activities
      </p>
    </div>
  );
};

const RecentActivities = () => {
  const dummyActivities: {
    id: string;
    date: string;
    timeAgo: string;
    title: string;
  }[] = [
    {
      id: "1",
      date: "24/09/26",
      timeAgo: "24 ago",
      title: "Your idea [Idea Title] has been published as a project.",
    },
    {
      id: "2",
      date: "24/09/26",
      timeAgo: "7hr ago",
      title: "Sandra requested to join [Project Title] as a Writer",
    },
    {
      id: "3",
      date: "24/09/26",
      timeAgo: "7hr ago",
      title: "A new file was added to [Project Title]",
    },
  ];

  return (
    <>
      <div className="flex flex-col gap-10 w-full pt-6 ">
        <TopBar className="">
          <h1 className="text-[1.125rem] font-semibold text-brand-black">
            Recent Activities
          </h1>
        </TopBar>

        {/* <RecentActivitiesEmptyState /> */}

        <>
          {dummyActivities.map((activity) => (
            <div
              className="flex w-full  items-center justify-between font-[sora-light] text-[0.875rem] text-brand-black"
              key={activity.id}
            >
              <p className="">{activity.title}</p>
              <div className="flex items-center gap-2">
                <p>{activity.timeAgo}</p>
                <p>{activity.date}</p>
              </div>
            </div>
          ))}
        </>
      </div>
    </>
  );
};

export default RecentActivities;
