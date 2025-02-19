import { NextResponse } from 'next/server';
import { register, collectDefaultMetrics } from 'prom-client';
import { requestDurationHistogram } from '@/lib/metrics';

// Initialize default metrics
collectDefaultMetrics();

// Export metrics endpoint
export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    // Record request duration
    const start = Date.now();
    const metrics = await register.metrics();
    const duration = Date.now() - start;

    // Get the route path from the request
    const url = new URL(request.url);
    const route = url.pathname;

    // Observe the duration for this metrics endpoint
    requestDurationHistogram
      .labels('GET', route, '200')
      .observe(duration / 1000);

    return new NextResponse(metrics, {
      status: 200,
      headers: {
        'Content-Type': register.contentType,
      },
    });
  } catch (error) {
    console.error('Error generating metrics:', error);
    return new NextResponse('Error generating metrics', {
      status: 500,
    });
  }
}