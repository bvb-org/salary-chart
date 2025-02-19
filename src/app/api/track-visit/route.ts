import { NextResponse } from 'next/server';
import { totalVisitsCounter, pageVisitsCounter } from '@/lib/metrics';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const { page } = await request.json();

    // Increment total visits counter
    totalVisitsCounter.inc();
    
    // Increment page-specific counter
    pageVisitsCounter.inc({ page });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking visit:', error);
    return NextResponse.json({ error: 'Failed to track visit' }, { status: 500 });
  }
}