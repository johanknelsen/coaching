export async function onRequestPost(context) {
  const request = context.request;
  const formData = await request.formData();
  
  // Convert FormData to object
  const data = {};
  for (const [key, value] of formData.entries()) {
    data[key] = value;
  }
  
  // Basic validation (you can add more)
  if (!data.name || !data.email || !data.message) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  // Here: Extend to send email or store data
  // Example: console.log(data); // In real logs
  // For email: Use MailChannels (add env vars and fetch to 'https://api.mailchannels.net/tx/v1/send')
  
  return new Response(JSON.stringify({ success: true, submitted: data }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
