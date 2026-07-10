"use client";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LogOut } from "lucide-react";

export default function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <button
      onClick={handleSignOut}
      style={{
        marginTop: "auto",
        display: "flex",
        alignItems: "center",
        gap: 8,
        background: "none",
        border: "none",
        borderTop: "1px solid rgba(0,0,0,0.08)",
        paddingTop: 16,
        color: "rgba(0,0,0,0.45)",
        fontSize: 13,
        fontWeight: 700,
        cursor: "pointer",
        textAlign: "left",
        width: "100%",
        letterSpacing: "0.02em",
      }}
    >
      <LogOut size={15} strokeWidth={2} />
      Sign Out
    </button>
  );
}
