"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import Head from "next/head";
import CustomModal from "@/components/ui/custom-modal";
import Modal from "@/components/ui/modal";

export default function Home() {
  return (
    <>
      <h1>App</h1>

      {/* <Modal
        title="a modal"
        open={true}
        onOpenChange={() => console.log("false")}
        className=" h-max   border-none"
      >
        <h1>A modal</h1>
      </Modal> */}
    </>
  );
}
