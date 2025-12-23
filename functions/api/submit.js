export async function onRequestPost(context) {
  const { request, env } = context;
  const formData = await request.formData();
  
  // Convert to object
  const data = {};
  for (const [key, value] of formData.entries()) {
    data[key] = value || null;  // Handle empty fields as null
  }
  
  // Basic validation
  if (!data.name || !data.email || !data.message) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  try {
    // Insert into D1
    const result = await env.DB.prepare(
      `INSERT INTO contacts (name, age, gender, status, email, phone, message)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(data.name, data.age, data.gender, data.status, data.email, data.phone, data.message)
      .run();
    
    // Success!
    return new Response(JSON.stringify({ success: true, id: result.meta.last_row_id }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Database error', details: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
