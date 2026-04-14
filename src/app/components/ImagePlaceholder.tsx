import Image from "next/image";

type Props = {
  label?: string;
  className?: string;
  showLabel?: boolean;
  src?: string;
  alt?: string;
  priority?: boolean;
};

export default function ImagePlaceholder({
  label,
  className = "",
  showLabel = true,
  src,
  alt,
  priority = false,
}: Props) {
  if (src) {
    return (
      <div className={`img-placeholder ${className}`}>
        <Image
          src={src}
          alt={alt ?? label ?? ""}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div className={`img-placeholder ${className}`}>
      <svg
        className="ripples"
        width="100%"
        height="100%"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="hatch"
            width="10"
            height="10"
            patternTransform="rotate(45)"
            patternUnits="userSpaceOnUse"
          >
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="10"
              stroke="currentColor"
              strokeWidth="1"
              opacity="0.55"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hatch)" />
      </svg>
      {showLabel && label && <span>{label}</span>}
    </div>
  );
}
