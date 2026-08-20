import { cn } from "@/lib/utils";
import type { User } from "@/lib/types";

const sizes = {
  sm: "h-6 w-6 text-[10px]",
  md: "h-8 w-8 text-xs",
  lg: "h-11 w-11 text-sm",
};

export function UserAvatar({
  user,
  size = "md",
  className,
}: {
  user?: User | null | undefined;
  size?: keyof typeof sizes | undefined;
  className?: string | undefined;
}) {
  if (!user) {
    return (
      <span
        aria-label="Unassigned"
        className={cn(
          "inline-flex shrink-0 items-center justify-center rounded-full border border-dashed border-border text-muted-foreground",
          sizes[size],
          className,
        )}
      >
        ?
      </span>
    );
  }
  return (
    <span
      title={user.name}
      aria-label={user.name}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-background ring-2 ring-surface",
        sizes[size],
        className,
      )}
      style={{ backgroundColor: user.color }}
    >
      {user.initials}
    </span>
  );
}
