// helpers/contexts/ClientOnly.tsx
import { useEffect, useState } from 'react';

function ClientOnly({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // Set to true after mounting on the client
  }, []);

  if (!mounted) {
    return null; // Prevent rendering on the server or before client-side mount
  }

  return children; // Render children only on the client
}

export default ClientOnly;