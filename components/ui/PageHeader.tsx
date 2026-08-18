import { ReactNode } from "react";

export default function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  description: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-white/[.06] pt-36 pb-16 sm:pt-40 sm:pb-20">
      <div className="pointer-events-none absolute left-1/4 top-12 size-72 rounded-full bg-violet-500/[.08] blur-[120px]" />
      <div className="pointer-events-none absolute right-0 top-20 size-64 rounded-full bg-cyan-400/[.05] blur-[110px]" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[.22em] text-violet-300">
          {eyebrow}
        </p>
        <h1 className="max-w-4xl text-4xl font-semibold tracking-[-.04em] text-white sm:text-6xl">
          {title}
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg">
          {description}
        </p>
        {children}
      </div>
    </section>
  );
}
