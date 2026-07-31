"use client";
import { useState, useEffect } from "react";

export default function RetailerGreeting() {
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/retailer/account")
      .then(r => r.json())
      .then(j => {
        if (j.data) setName(j.data.contact_name || j.data.business_name || null);
      })
      .catch(() => {});
  }, []);

  if (!name) return <>Retailer Dashboard</>;
  return <>Hi, {name}</>;
}
