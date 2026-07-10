"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError || !user) {
      setError("Invalid email or password.");
      setLoading(false);
      return;
    }

    // Check role and redirect accordingly
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const role = profile?.role;
    if (role === "admin" || role === "manager") {
      router.push("/admin");
    } else {
      router.push("/retailer");
    }
    router.refresh();
  };

  return (
    <form className="grid formPanel" style={{ gap: 18 }} onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="you@yourbusiness.com"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </div>
      <div className="field">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </div>

      {error && (
        <p style={{ margin: 0, color: "#ff4d4d", fontSize: 14, textAlign: "center" }}>
          {error}
        </p>
      )}

      <button
        className="button"
        type="submit"
        disabled={loading}
        style={{ marginTop: 4, opacity: loading ? 0.7 : 1 }}
      >
        {loading ? "Logging in…" : "Log in"}
      </button>
    </form>
  );
}
