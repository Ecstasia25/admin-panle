"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import {  Copy, CopyCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
  value: string;
  label?: string;
  iconSizeClass?: string;
  className?: string;
}

export const CopyButton = ({
  value,
  label,
  iconSizeClass,
  className,
}: CopyButtonProps) => {
  const [copied, setCopied] = useState(false);

  const onCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    toast.success(`${label} copied to clipboard`);

    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <Button
      variant="outline"
      type="button"
      size="icon"
      className={cn(
        "transition-all duration-200 hover:bg-gray-200/20 w-10 h-10",
        className
      )}
      onClick={onCopy}
    >
      <div className="relative">
        <Copy
          className={cn(
            "h-4 w-4 transition-all duration-200",
            iconSizeClass,
            copied ? "scale-0 opacity-0" : "scale-100 opacity-100"
          )}
        />
        <CopyCheck
          className={cn(
            "absolute top-0 left-0 h-4 w-4 text-green-500 transition-all duration-200",
            iconSizeClass,
            copied ? "scale-100 opacity-100" : "scale-0 opacity-0"
          )}
        />
      </div>
    </Button>
  );
};
