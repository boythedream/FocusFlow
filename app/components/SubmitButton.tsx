"use client";

import React from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Save, Loader2 } from "lucide-react";

const SubmitButton = ({ children }: { children?: React.ReactNode }) => {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="gap-2">
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Saving...
        </>
      ) : (
        <>
          <Save className="h-4 w-4" />
          {children || "Save Changes"}
        </>
      )}
    </Button>
  );
};

export default SubmitButton;
