import { NextResponse } from 'next/server';

/** Container healthcheck. Cheap, dependency-free, and never cached. */
export const dynamic = 'force-dynamic';

export function GET() {
  return NextResponse.json({ status: 'ok', uptime: process.uptime() });
}
