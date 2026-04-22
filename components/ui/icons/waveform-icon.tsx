interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}

export const WaveformIcon = ({
  size = 24,
  color = '#4ade80',
  className,
}: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <rect x="2"  y="9"  width="2.5" height="6"  rx="1.25" fill={color} />
    <rect x="6"  y="5"  width="2.5" height="14" rx="1.25" fill={color} />
    <rect x="10" y="2"  width="2.5" height="20" rx="1.25" fill={color} />
    <rect x="14" y="6"  width="2.5" height="12" rx="1.25" fill={color} />
    <rect x="18" y="10" width="2.5" height="4"  rx="1.25" fill={color} />
  </svg>
);
