"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, getRoleId } from "@/lib/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoleId: number;
}

export default function ProtectedRoute({ children, requiredRoleId }: ProtectedRouteProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/auth/login");
      return;
    }

    const currentRoleId = getRoleId();
    if (currentRoleId !== requiredRoleId) {
      router.push("/auth/login");
      return;
    }

    setLoading(false);
  }, [router, requiredRoleId]);

  if (loading) {
    return null;
  }

  return <>{children}</>;
}
