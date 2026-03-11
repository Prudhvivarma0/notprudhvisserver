"use client";
import { ReactNode } from "react";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const BentoGrid = ({
  children,
  className,
}: {
  children:  ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("grid w-full auto-rows-[22rem] grid-cols-3 gap-4", className)}>
      {children}
    </div>
  );
};

const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
}: {
  name:        string;
  className:   string;
  background:  ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Icon:        any;
  description: string;
  href:        string;
  cta:         string;
}) => (
  <div
    className={cn(
      "group relative col-span-3 flex flex-col justify-end overflow-hidden rounded-xl h-full",
      "transform-gpu dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
      className
    )}
    style={{
      background:           "var(--bg-card)",
      backdropFilter:       "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      border:               "1px solid var(--muted)",
    }}
  >
    <div>{background}</div>

    <div className="pointer-events-none z-10 flex transform-gpu flex-col gap-1 p-5 transition-all duration-300 group-hover:-translate-y-8">
      <Icon
        className="h-12 w-12 origin-left transform-gpu transition-all duration-300 ease-in-out group-hover:scale-75"
        style={{ color: "var(--accent)" }}
      />
      <h3 className="text-xl font-semibold font-display" style={{ color: "var(--text)" }}>
        {name}
      </h3>
      <p className="max-w-lg line-clamp-4" style={{ color: "var(--muted)", fontSize: "clamp(12px,1.1vw,13px)" }}>
        {description}
      </p>
    </div>

    {/* Gradient overlay at bottom — fades in on hover so CTA is readable */}
    <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      style={{ background: "linear-gradient(to top, var(--bg-card) 60%, transparent)" }} />

    <div className="pointer-events-none absolute bottom-0 flex w-full translate-y-10 transform-gpu flex-row items-center p-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
      <Button
        asChild
        size="sm"
        className="pointer-events-auto rounded-md px-3 py-1.5 text-xs font-mono font-semibold transition-colors"
        style={{ background: "var(--accent)", color: "var(--bg)", border: "none" }}
      >
        <a href={href} target={href === "#" ? undefined : "_blank"} rel="noopener noreferrer">
          {cta}
          <ArrowRightIcon className="ml-2 h-4 w-4" />
        </a>
      </Button>
    </div>

    <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-black/[.03] group-hover:dark:bg-neutral-800/10" />
  </div>
);

export { BentoCard, BentoGrid };
