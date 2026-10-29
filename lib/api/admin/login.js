const crypto = require('node:crypto');
const { send, readBody } = require('../_db');
const { sessionCookie } = require('../_auth');
const normalize = value => String(value || '').trim().replace(/^(['"])(.*)\1$/, '$2');
module.exports = async (req,res) => {
  if(req.method !== 'POST') return send(res,405,{error:'Method not allowed.'});
  try {
    const {username,password}=await readBody(req);
    const expectedUser=normalize(process.env.ADMIN_USERNAME || 'admin');
    const expected=normalize(process.env.ADMIN_PASSWORD);
    const input=normalize(password);
    if(!expected) return send(res,503,{error:'Admin login is not configured. Add ADMIN_PASSWORD to the Production environment and redeploy.'});
    if(normalize(username)!==expectedUser || input.length!==expected.length || !crypto.timingSafeEqual(Buffer.from(input),Buffer.from(expected))) return send(res,401,{error:'Invalid username or password.'});
    res.setHeader('Set-Cookie',`vci_admin=${encodeURIComponent(sessionCookie())}; Path=/; HttpOnly; SameSite=Strict; Max-Age=28800${process.env.VERCEL ? '; Secure' : ''}`);
    return send(res,200,{ok:true});
  } catch { return send(res,400,{error:'Unable to sign in.'}); }
};
