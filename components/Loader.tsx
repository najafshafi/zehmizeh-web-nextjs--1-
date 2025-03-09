"use client"; // ✅ Required for client-side hooks

import { Spinner } from "react-bootstrap";

interface LoaderProps {
  height?: number;
}

function Loader({ height }: LoaderProps) {
  return (
    <div 
      className="flex justify-center items-center"
      style={{ minHeight: height ? `${height}px` : "50vh" }}
    >
      <Spinner animation="border" className="text-[0.75rem] w-[60px] h-[60px]" />
    </div>
  );
}

export default Loader;
