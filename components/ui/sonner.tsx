"use client";

import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-[#161616] group-[.toaster]:text-foreground group-[.toaster]:border-white/10 group-[.toaster]:shadow-glass group-[.toaster]:rounded-xl",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-brand-yellow group-[.toast]:text-brand-black",
          cancelButton:
            "group-[.toast]:bg-white/10 group-[.toast]:text-foreground",
          success: "group-[.toast]:text-emerald-400",
          error: "group-[.toast]:text-red-400",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
