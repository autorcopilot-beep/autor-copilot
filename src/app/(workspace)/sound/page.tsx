import { redirect } from 'next/navigation';

export default function LegacySoundPage() {
  redirect('/write/editor?sound=open');
}
