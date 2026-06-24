"use client";

import { useEffect, useRef } from "react";

/** Loads the real embed script into an isolated mount point — exact same widget visitors of other sites would see. */
export default function WidgetPreview() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = "whf-lebenszeit-rechner";
    if (mountRef.current && !mountRef.current.id) mountRef.current.id = id;
    const script = document.createElement("script");
    script.src = "/embed/lebenszeit-rechner.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      script.remove();
      const styleTag = document.getElementById("whf-rechner-styles");
      styleTag?.remove();
    };
  }, []);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 flex items-center justify-center min-h-[420px]">
      <div ref={mountRef} />
    </div>
  );
}
