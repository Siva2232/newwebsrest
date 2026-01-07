import React, { useEffect, useState } from "react";
import { UtensilsCrossed } from "lucide-react";

export default function RestaurantLoader({
  text = "Loading...",
  onFinish,
}) {
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      // start exit animation
      setExiting(true);

      // wait for animation to finish
      setTimeout(() => {
        setVisible(false);
        if (onFinish) onFinish();
      }, 600); // ⏱️ exit animation duration
    }, 2000); // ⏱️ loader visible time

    return () => clearTimeout(timer);
  }, [onFinish]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center
      transition-all duration-500 ease-in-out
      ${exiting ? "opacity-0 scale-95 blur-sm" : "opacity-100 scale-100"}
      bg-gradient-to-br from-orange-50 via-amber-50 to-rose-50`}
    >
      {/* Glow */}
      <div
        className={`absolute inset-0 bg-gradient-to-r from-orange-400/20 via-amber-400/20 to-rose-400/20 blur-3xl
        transition-opacity duration-500
        ${exiting ? "opacity-0" : "opacity-100"}`}
      />

      <div
        className={`relative flex flex-col items-center gap-6
        transition-all duration-500
        ${exiting ? "translate-y-6 opacity-0" : "translate-y-0 opacity-100"}`}
      >
        {/* Plate */}
        <div className="relative flex items-center justify-center">
          <div className="h-28 w-28 rounded-full bg-white shadow-xl border-4 border-slate-200 flex items-center justify-center animate-bounceSlow">
            <UtensilsCrossed className="text-orange-500" size={42} />
          </div>

          {/* Steam */}
          <span className="absolute -top-6 left-1/2 -translate-x-1/2 flex gap-2">
            <span className="steam delay-0" />
            <span className="steam delay-1" />
            <span className="steam delay-2" />
          </span>
        </div>

        {/* Text */}
        <p className="text-sm sm:text-base font-semibold text-slate-700 tracking-wide">
          {text}
        </p>

        {/* Dots */}
        <div className="flex gap-2">
          <span className="dot delay-0" />
          <span className="dot delay-1" />
          <span className="dot delay-2" />
        </div>
      </div>
    </div>
  );
}
