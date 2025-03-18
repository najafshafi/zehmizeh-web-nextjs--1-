'use client';

export default function JobDetailsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto py-4 md:px-0 px-6">
      {children}
    </div>
  );
} 