export async function onRequestPost(context) {
  const { request, env } = context;
  
  // Check if DB binding exists (safety)
  if (!env.DB) {
    return new Response(JSON.stringify({ error: 'Database not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  const formData = await request.formData();
  
  const data = {
    name: formData.get('name')?.trim() || null,
    age: formData.get('age') ? parseInt(formData.get('age')) : null,
    gender: formData.get('gender')?.trim() || null,
    status: formData.get('status')?.trim() || null,
    email: formData.get('email')?.trim() || null,
    phone: formData.get('phone')?.trim() || null,
    message: formData.get('message')?.trim() || null,
  };
  
  // Validation
  if (!data.name || !data.email || !data.message || !data.status) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  try {
    const result = await env.DB.prepare(`
      INSERT INTO contacts (name, age, gender, status, email, phone, message)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      data.name,
      data.age,
      data.gender,
      data.status,
      data.email,
      data.phone,
      data.message
    ).run();
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Saved successfully',
      id: result.meta.last_row_id 
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('D1 Insert Error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to save to database',
      details: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
