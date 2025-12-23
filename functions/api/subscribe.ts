export const onRequestPost: PagesFunction<{
  KV_SUBS: EMAIL_SUBS;
}> = async (context) => {
  const formData = await context.request.formData();
  const email = formData.get('email')?.toString().trim().toLowerCase();
  const name = formData.get('name')?.toString().trim() || 'Anonymous';
  const honeypot = formData.get('honeypot')?.toString().trim();

  // Honeypot check: If filled, it's a bot
  if (honeypot && honeypot.length > 0) {
    return new Response('Spam detected. Nice try, bot.', { status: 400 });
  }

  // Basic validation
  if (!email) {
    return new Response('Email is required.', { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return new Response('Invalid email format.', { status: 400 });
  }

  // Rate limiting: Max 5 per hour per IP
  const ip = context.request.headers.get('CF-Connecting-IP') || 'unknown';
  const rateKey = `rate:${ip}`;
  const now = Date.now();
  const hourAgo = now - 3600000; // 1 hour in ms

  let count = 0;
  const existingRate = await context.env.KV_SUBS.get(rateKey);
  if (existingRate) {
    const parsed = JSON.parse(existingRate);
    if (parsed.timestamp > hourAgo) {
      count = parsed.count;
    }
  }

  if (count >= 5) {
    return new Response('Too many submissions from this IP. Try again later.', { status: 429 });
  }

  // Increment rate counter
  await context.env.KV_SUBS.put(rateKey, JSON.stringify({ count: count + 1, timestamp: now }), { expirationTtl: 3600 });

  // Prevent duplicate emails
  const existing = await context.env.KV_SUBS.get(email);
  if (existing) {
    return new Response('You\'re already subscribed. No duplicates.', { status: 409 });
  }

  // Store subscriber
  const timestamp = new Date().toISOString();
  const value = JSON.stringify({
    name,
    email,
    subscribedAt: timestamp,
    ip, // Optional: for debugging
  });

  try {
    await context.env.KV_SUBS.put(email, value);
  } catch (err) {
    return new Response('Failed to save. Try again.', { status: 500 });
  }

  return new Response('Subscribed successfully! Expect brutal truth soon.', { status: 200 });
};