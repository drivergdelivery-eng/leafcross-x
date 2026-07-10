"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "leafcross_age_verified";

export function AgeGate() {
  const [verified, setVerified] = useState(true);

  useEffect(() => {
    setVerified(window.localStorage.getItem(STORAGE_KEY) === "true");
  }, []);

  if (verified) {
    return null;
  }

  return (
    <div className="ageGate" role="dialog" aria-modal="true">
      <div className="ageGatePanel">
        <p className="eyebrow">Age verification</p>
        <h2>You must be 19 years old to enter</h2>
        <button
          className="button"
          onClick={() => {
            window.localStorage.setItem(STORAGE_KEY, "true");
            setVerified(true);
          }}
        >
          I am 19+
        </button>
        <a className="underage" href="https://www.google.com">
          I am under 19
        </a>
      </div>
    </div>
  );
}
