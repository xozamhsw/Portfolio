import type { ReactNode } from "react";

interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  right?: ReactNode;
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  right,
}: SectionHeadingProps) {
  return (
    <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[.22em] text-violet-300">
          {eyebrow}
        </p>

        <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          {title}
        </h2>

        {description && (
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
            {description}
          </p>
        )}
      </div>

      {right && <div>{right}</div>}
    </div>
  );
}
