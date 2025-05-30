"use client";

import { useUser } from "@clerk/nextjs";

export const WelcomeMsg = () => {
  const { user, isLoaded } = useUser();

  return (
    <div className="mb-4 space-y-2">
      <h2 className="text-2xl font-medium text-white lg:text-4xl">
        Welcome back {isLoaded ? ", " : " "}
        {user?.firstName} 👋
      </h2>
      <p className="text-sm text-[#c5f9e6] lg:text-base">
      Navigate Your Financial Future with Confidence.
      </p>
    </div>
  );
};
