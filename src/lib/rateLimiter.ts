const rateLimiter = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 15;
const WINDOW_MS = 60 * 1000;

export function checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const userLimit = rateLimiter.get(ip);

    if (!userLimit || now > userLimit.resetTime) {
        rateLimiter.set(ip, { count: 1, resetTime: now + WINDOW_MS });
        return true;
    }

    if (userLimit.count >= RATE_LIMIT) {
        return false;
    }

    userLimit.count++;
    return true;
}