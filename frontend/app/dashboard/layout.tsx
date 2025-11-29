"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // 🔥 EXACT same logic as your ProtectedRoute
    const token = localStorage.getItem("accessToken");

    if (!token) {
      // Same as <Navigate to="/login" replace />
      router.replace("/login");
      return;
    }

    // If token exists → allow access
    setAuthorized(true);
  }, [router]);

  // Don't render children until we know
  if (!authorized) return null;

  // EXACT same as your return <>{children}</>;
  return <>{children}</>;
}
