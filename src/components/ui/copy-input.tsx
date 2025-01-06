import React, { useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";


interface CopyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value'> {
  copyLabel?: string;
  showToast?: boolean;
  value?: string;
  defaultValue?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

const CopyInput = React.forwardRef<HTMLInputElement, CopyInputProps>(
  ({ 
    className, 
    copyLabel = "Copied to clipboard!", 
    showToast = true, 
    value,
    defaultValue,
    onChange,
    ...props 
  }, ref) => {
    const [copied, setCopied] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleCopy = () => {
      const textToCopy = value ?? inputRef.current?.value ?? '';
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      
      if (showToast) {
        toast.success(copyLabel);
      }
      
      setTimeout(() => setCopied(false), 1500);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(e);
      }
    };

    return (
      <div className="space-y-2">
        <div className="relative">
          <input
            {...props}
            ref={inputRef}
            value={value}
            defaultValue={defaultValue}
            onChange={handleChange}
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pe-9",
              className
            )}
          />
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleCopy}
                  className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg border border-transparent text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed"
                  aria-label={copied ? "Copied" : "Copy to clipboard"}
                  disabled={copied}
                  type="button"
                >
                  <div
                    className={cn(
                      "transition-all",
                      copied ? "scale-100 opacity-100" : "scale-0 opacity-0"
                    )}
                  >
                    <Check
                      className="stroke-emerald-500"
                      size={16}
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                  </div>
                  <div
                    className={cn(
                      "absolute transition-all",
                      copied ? "scale-0 opacity-0" : "scale-100 opacity-100"
                    )}
                  >
                    <Copy size={16} strokeWidth={2} aria-hidden="true" />
                  </div>
                </button>
              </TooltipTrigger>
              <TooltipContent className="px-2 py-1 text-xs">
                Copy to clipboard
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    );
  }
);

CopyInput.displayName = "CopyInput";

export { CopyInput };