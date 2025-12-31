import { NextRequest, NextResponse } from 'next/server';

// In-memory store for rate limiting (use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

interface RateLimitConfig {
  interval: number; // Time window in milliseconds
  limit: number; // Max requests per interval
}

const defaultConfig: RateLimitConfig = {
  interval: 60 * 1000, // 1 minute
  limit: 60, // 60 requests per minute
};

export function rateLimit(config: Partial<RateLimitConfig> = {}) {
  const { interval, limit } = { ...defaultConfig, ...config };

  return async function checkRateLimit(
    req: NextRequest
  ): Promise<{ success: boolean; remaining: number; reset: number }> {
    const ip = req.headers.get('x-forwarded-for') || 
               req.headers.get('x-real-ip') || 
               'anonymous';
    const key = `${ip}:${req.nextUrl.pathname}`;
    const now = Date.now();
    
    const record = rateLimitStore.get(key);
    
    if (!record || now > record.resetTime) {
      // Create new record
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + interval,
      });
      return { success: true, remaining: limit - 1, reset: now + interval };
    }
    
    if (record.count >= limit) {
      return { 
        success: false, 
        remaining: 0, 
        reset: record.resetTime 
      };
    }
    
    // Increment count
    record.count += 1;
    rateLimitStore.set(key, record);
    
    return { 
      success: true, 
      remaining: limit - record.count, 
      reset: record.resetTime 
    };
  };
}

// Clean up expired entries periodically
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, value] of rateLimitStore.entries()) {
      if (now > value.resetTime) {
        rateLimitStore.delete(key);
      }
    }
  }, 60 * 1000); // Clean up every minute
}

export function rateLimitResponse(reset: number): NextResponse {
  return NextResponse.json(
    { error: 'Too many requests. Please try again later.' },
    { 
      status: 429,
      headers: {
        'Retry-After': Math.ceil((reset - Date.now()) / 1000).toString(),
        'X-RateLimit-Reset': reset.toString(),
      }
    }
  );
}
