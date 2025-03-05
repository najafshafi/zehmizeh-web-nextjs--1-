"use client";

import { useState } from "react";
import Logo from "@/icons/logo.svg";
import Image from "next/image";

type VideoComponentProps = {
  videosrc: string;
};

const VideoComponent: React.FC<VideoComponentProps> = ({ videosrc }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="relative border-[18px] border-[#f0f0f0] rounded-lg z-10 min-h-[340px]">
      <div className="absolute top-[-17px] left-0 w-full h-[18px] z-10 bg-[#f0f0f085]" />
      <div className="absolute bottom-[-17px] left-0 w-full h-[18px] z-10 bg-[#f0f0f085]" />
      <video
        className={`block ${!show ? "pointer-events-none" : ""} opacity-0`}
        width="100%"
        height="100%"
        autoPlay
        controls
      />

      {show && (
        <video
          className="absolute top-0 left-0 w-full h-full object-fill aspect-square"
          width="100%"
          height="100%"
          autoPlay
          controls
          src={videosrc}
        />
      )}

      {show && (
        <button
          className="absolute top-[-26px] right-[-26px] z-[9999] bg-transparent text-black text-2xl"
          onClick={() => setShow(false)}
        >
          &times;
        </button>
      )}

      <div
        className={`absolute top-0 left-0 w-full h-full bg-white transition-opacity duration-200 ${
          show ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <Logo className="absolute w-32 h-32 top-[45%] left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        <Image
          src="/images/home-play-icon.svg"
          alt="Play"
          className="absolute top-0 right-0 bottom-0 left-0 m-auto transition-all duration-200 ease-in-out cursor-pointer"
          width={50}
          height={50}
          onClick={() => setShow(true)}
        />
      </div>
    </div>
  );
};

export default VideoComponent;