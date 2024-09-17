import { cn } from "@/lib/utils";
import * as React from "react";
import { IconProps } from "react-feather";
import { FieldError } from "react-hook-form";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export interface IIconInputProps extends InputProps {
  icon: React.ComponentType<IconProps>;
  error?: FieldError;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 autofill:bg-transparent",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

const IconInput = React.forwardRef<HTMLInputElement, IIconInputProps>(
  ({ className, type, icon: IconComponent, error: errors, ...props }, ref) => {
    const ICONS_STYLES: IconProps = {
      size: 22,
      opacity: 0.7,
      className: "text-foreground",
    };

    return (
      <div>
        <div
          className={cn(
            "bg-background flex items-center shadow-sm rounded-md px-3 py-1",
            errors && "border border-destructive",
            className
          )}
        >
          {IconComponent && <IconComponent {...ICONS_STYLES} />}
          <Input
            type={type}
            className="bg-background border-none shadow-none focus-visible:ring-0"
            ref={ref}
            {...props}
          />
        </div>
        {errors?.message && (
          <p className="text-destructive text-sm ml-2 mt-1">
            * {errors.message}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
IconInput.displayName = "IconInput";

export { IconInput, Input };
