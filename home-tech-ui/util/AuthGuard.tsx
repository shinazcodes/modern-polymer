import { useEffect } from "react";
import { useRouter } from "next/router";

function AuthGuard({ children }: { children: any }) {
  const router = useRouter();
  useEffect(() => {
    if (
      router.pathname.includes("admin") &&
      localStorage.getItem("userType") !== "admin"
    ) {
      router.replace("/auth/login");
    }
    if (
      router.pathname.includes("home") ||
      (router.pathname.includes("jobs") &&
        localStorage.getItem("userType") !== "technician")
    ) {
      router.replace("/auth/login");
    }
  }, [router.pathname]);
  return <>{children}</>;
}

export default AuthGuard;
