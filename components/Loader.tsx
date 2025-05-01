"use client"; // ✅ Required for client-side hooks

import Spinner from "@/components/forms/Spin/Spinner"

interface LoaderProps {
  height?: number;
}

function Loader({ height }: LoaderProps) {
  return (
    <div 
      className="flex justify-center items-center"
      style={{ minHeight: height ? `${height}px` : "50vh" }}
    >
      <Spinner  className=" w-[60px] h-[60px]" />
    </div>
  );
}

export default Loader;
