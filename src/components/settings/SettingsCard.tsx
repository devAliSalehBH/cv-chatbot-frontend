import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SettingsCardProps {
  icon: ReactNode;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}

/** Card used on the settings pages: header (icon, title, description) + body. */
export default function SettingsCard({
  icon,
  title,
  description,
  children,
  className,
  bodyClassName,
}: SettingsCardProps) {
  return (
    <section
      className={cn(
        // No overflow-hidden: dropdowns inside the card (e.g. phone country list) must not be clipped
        "relative w-full rounded-[24px] border border-[#E5E7EB] bg-[#F9FAFB]",
        className
      )}
    >
      <header className="flex items-start gap-2 border-b border-[#E5E7EB] px-4 py-5 md:px-6 md:py-6">
        <span className="mt-0.5 shrink-0 text-[#64748B]">{icon}</span>
        <div className="flex flex-col gap-2">
          <h2 className="text-[16px] md:text-[20px] leading-7 font-medium text-[#111827]">{title}</h2>
          {description && (
            <p className="text-[13px] md:text-[16px] leading-6 text-[#64748B]">{description}</p>
          )}
        </div>
      </header>
      <div className={cn("px-4 py-5 md:px-6 md:py-6", bodyClassName)}>{children}</div>
    </section>
  );
}

/** "in" LinkedIn square icon. */
export function LinkedInIcon({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-[3px] bg-[#0A66C2] text-white font-bold leading-none",
        className ?? "w-6 h-6 text-[14px]"
      )}
      aria-hidden
    >
      in
    </span>
  );
}
