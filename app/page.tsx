"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import Head from "next/head";
import Modal from "@/components/ui-components/modal";

export default function Home() {
  return (
    <>
      <h1>App</h1>
      <div className="w-full max-w-full mx-auto absolute top-2 flex items-center justify-center text-[#211E1E] font-semibold text-[0.875rem] font-sora">
        LOGO
      </div>
    </>
  );
}
