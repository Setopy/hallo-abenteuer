import { firebaseConfig } from '@/app/firebase-config';
export const dynamic = 'force-dynamic';
export function GET() {
  return Response.json(
    { config: firebaseConfig() },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
