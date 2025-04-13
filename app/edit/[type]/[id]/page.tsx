import React from "react";
import EditPageClient from "./EditPageClient";

// This is a server component
export default async function EditJobPage({
  params,
}: {
  params: Promise<{ id: string; type: string }>;
}) {
  const resolvedParams = await params;
  return <EditPageClient id={resolvedParams.id} type={resolvedParams.type} />;
}
