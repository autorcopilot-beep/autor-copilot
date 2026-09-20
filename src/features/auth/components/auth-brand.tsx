import Image from 'next/image';
import Link from 'next/link';
import { BookOpenText } from 'lucide-react';

import { brandImage } from '@/lib/brand-image';

export function AuthBrand() {
  return (
    <Link href="/" className="inline-flex min-h-11 items-center gap-3 rounded-control px-2 text-sm font-semibold tracking-wide text-ink">
      {brandImage ? (
        <Image src={brandImage} alt="" width={30} height={30} className="size-[30px] object-contain" priority />
      ) : (
        <BookOpenText className="size-7 text-accent" aria-hidden="true" />
      )}
      AUTOR COPILOT
    </Link>
  );
}
