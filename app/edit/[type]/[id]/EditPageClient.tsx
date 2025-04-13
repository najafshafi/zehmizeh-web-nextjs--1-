"use client";

import React from "react";
import NewJob from "../../../post-new-job/NewJob";

type EditPageClientProps = {
  id: string;
  type: string;
};

export default function EditPageClient({ id, type }: EditPageClientProps) {
  return (
    <div className="pt-[90px] bg-secondary h-[150vh]">
      <NewJob params={{ id, type }} />
    </div>
  );
}
