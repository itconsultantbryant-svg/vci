const { sql, send, readBody } = require('./_db');
module.exports = async (req,res) => {
  if(req.method !== 'POST') return send(res,405,{error:'Method not allowed.'});
  try { const b=await readBody(req); const required=['name','email','service','message']; if(required.some(k=>!String(b[k]||'').trim()) || !/^\S+@\S+\.\S+$/.test(b.email)) return send(res,400,{error:'Please complete all required fields with a valid email address.'});
    const q=sql(); await q`INSERT INTO contact_submissions (full_name, organization, email, phone, service_interest, message) VALUES (${String(b.name).trim()}, ${String(b.organization||'').trim()||null}, ${String(b.email).trim().toLowerCase()}, ${String(b.phone||'').trim()||null}, ${String(b.service).trim()}, ${String(b.message).trim()})`;
    return send(res,201,{ok:true,message:'Thank you. Your message has been received.'});
  } catch(e) { console.error(e); return send(res,500,{error:'We could not submit your message at this time. Please use the email or telephone details instead.'}); }
};
