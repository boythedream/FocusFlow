"use client";

import React from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Loader2, Play } from "lucide-react";

const StartButton = ({ children }: { children?: React.ReactNode }) => {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="gap-2 w-full">
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Starting...
        </>
      ) : (
        <>
          <Play className="h-4 w-4" />
          {children || "Start Now"}
        </>
      )}
    </Button>
  );
};

export default StartButton;
