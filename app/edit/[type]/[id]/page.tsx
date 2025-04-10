"use client";

import React from "react";
import NewJob from "../../../post-new-job/NewJob";

export default function EditJobPage({
  params,
}: {
  params: { id?: string; type?: string };
}) {
  return (
    <div className="pt-[90px] bg-secondary h-[150vh]">
      <NewJob params={params} />
    </div>
  );
} 