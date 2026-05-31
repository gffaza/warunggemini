import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils/cn";

interface LogoProps {
  size?: number;
  className?: string;
  alt?: string;
}

export function Logo({
  size = 64,
  className,
  alt = siteConfig.name,
}: LogoProps) {
  return (
    <img
      src={siteConfig.logo}
      alt={alt}
      width={size}
      height={size}
      className={cn("shrink-0", className)}
    />
  );
}
