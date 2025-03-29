"use client";

import PostJob from "./PostJob";
import { PostJobContextProvider } from "./context";

export default function Page({
  params,
}: {
  params: { id?: string; type?: string };
}) {
  return (
    <PostJobContextProvider params={params}>
      <PostJob params={params} />
    </PostJobContextProvider>
  );
}
