"use client";

import ButtonV2 from "@/components/ui-components/button";
import TopBar from "@/components/ui-components/top-bar";
import { useDummyStore } from "@/store/useDummyStore";
import { useIdeaStore } from "@/store/useIdeaStore";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef } from "react";
import ProjectCard from "../projects/project-card";
import gsap from "gsap";
import EditIdeaModal from "../modals/edit-idea-modal";

const IdeasClient = () => {
  const router = useRouter();
  const { ideas } = useIdeaStore();
  const { useDummyData } = useDummyStore();

  // Refs for animation targets
  const containerRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const stringBigRef = useRef<HTMLDivElement>(null);
  const stringSmallRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  const pendingProjects = !useDummyData
    ? []
    : ideas.filter((p) => p.status === "pending");

  useEffect(() => {
    // Skip animations if empty state is not rendered
    if (!containerRef.current || !boxRef.current) return;

    const ctx = gsap.context(() => {
      // Initial state - hidden
      gsap.set(
        [
          boxRef.current,
          shadowRef.current,
          stringBigRef.current,
          stringSmallRef.current,
        ],
        {
          opacity: 0,
        }
      );
      gsap.set(textRef.current, { opacity: 0, y: 20 });

      // Master timeline for entrance animation
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Box drops in with a bounce
      tl.to(boxRef.current, {
        opacity: 1,
        duration: 0.8,
        ease: "back.out(1.7)",
      })
        // Shadow fades in
        .to(
          shadowRef.current,
          {
            opacity: 1,
            duration: 0.5,
          },
          "-=0.4"
        )
        // Strings pop in with stagger
        .to(
          [stringBigRef.current, stringSmallRef.current],
          {
            opacity: 1,
            duration: 0.4,
            stagger: 0.1,
            ease: "back.out(2)",
          },
          "-=0.3"
        )
        // Text fades in
        .to(
          textRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
          },
          "-=0.2"
        );

      // Shadow pulses
      gsap.to(shadowRef.current, {
        scaleX: 0.9,
        opacity: 0.7,
        duration: 2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: 0.8,
      });

      // String 1 sways gently
      gsap.to(stringBigRef.current, {
        rotation: 10,
        transformOrigin: "bottom center",
        duration: 1.5,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: 1,
      });

      // String 2 sways with offset timing
      gsap.to(stringSmallRef.current, {
        rotation: -8,
        transformOrigin: "bottom center",
        duration: 1.8,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: 1.2,
      });
    }, containerRef);

    return () => ctx.revert();
  }, [pendingProjects.length]);

  return (
    <>
      <EditIdeaModal />

      <div className="flex flex-col gap-10 w-full pt-6 px-6">
        <TopBar className="flex items-center gap-6">
          <h1 className="text-[2rem] font-semibold text-brand-black dark:text-[#FFFFFF]">
            Ideas
          </h1>
        </TopBar>

        {pendingProjects.length ? (
          <div className="grid grid-cols-4 gap-4">
            {pendingProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div
            ref={containerRef}
            className="relative h-[30rem] flex-col gap-4 flex items-center justify-center"
          >
            <div className="relative h-[143px] w-[143px] shrink-0">
              <div ref={boxRef} className="relative z-10">
                <Image
                  src="/images/package-box.svg"
                  alt="idea"
                  width={143}
                  height={143}
                />

                <div
                  ref={stringBigRef}
                  className="absolute -top-[16px] right-[20px]"
                >
                  <Image
                    src="/images/box-string-big.svg"
                    alt="string"
                    width={14}
                    height={23}
                  />
                </div>

                <div
                  ref={stringSmallRef}
                  className="absolute -top-[6px] left-[12px]"
                >
                  <Image
                    src="/images/box-string-small.svg"
                    alt="string"
                    width={17}
                    height={42}
                  />
                </div>
              </div>

              {/* Shadow - stays fixed at base */}
              <div
                ref={shadowRef}
                className="absolute bottom-[4px] left-[85px]"
              >
                <Image
                  src="/images/package-shadow.svg"
                  alt="shadow"
                  width={70}
                  height={26}
                />
              </div>
            </div>

            <p ref={textRef} className="text-brand-black dark:text-[#FFFFFF]">
              You do not have any projects ongoing yet
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default IdeasClient;
