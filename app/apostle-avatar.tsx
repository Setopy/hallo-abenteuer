import { avatars } from '@/lib/profiles.mjs';
export default function ApostleAvatar({ id }: { id: string }) {
  const apostle = avatars.find((a) => a.id === id);
  if (!apostle)
    return (
      <span className="apostle-unknown" aria-label="Choose an apostle avatar">
        ?
      </span>
    );
  const i = apostle.index % 6;
  return (
    <svg
      className="apostle-portrait"
      viewBox={`${(i % 3) * 512} ${Math.floor(i / 3) * 512} 512 512`}
      role="img"
      aria-label={'Illustrated avatar of ' + apostle.name}
      focusable="false"
    >
      <image
        href={`./apostles/portraits-${Math.floor(apostle.index / 6) + 1}.webp`}
        width="1536"
        height="1024"
      />
    </svg>
  );
}
