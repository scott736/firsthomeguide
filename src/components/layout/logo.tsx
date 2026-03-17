import { cn } from '@/lib/utils';

interface LogoProps {
  iconClassName?: string;
  wordmarkClassName?: string;
  className?: string;
  href?: string;
  noLink?: boolean;
}

export default function Logo({
  iconClassName,
  wordmarkClassName,
  className,
  href = '/',
  noLink = false,
}: LogoProps) {
  const Element = noLink ? 'div' : 'a';

  return (
    <Element
      href={href}
      className={cn(
        'flex items-center gap-1.75 text-xl font-medium',
        className,
      )}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 26 28"
        fill="none"
        className={cn('w-7 object-contain', iconClassName)}
      >
        <path
          d="M13 4 L1 13 H4 V24 H10 V17 H16 V24 H22 V13 H25 Z"
          fill="#9A5CD0"
        />
      </svg>
      <span className={cn('', wordmarkClassName)}>FirstHomeGuide.ca</span>
    </Element>
  );
}
