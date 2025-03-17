'use client';

export default function JobDetailsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto py-4">
      {children}
    </div>
  );
} 