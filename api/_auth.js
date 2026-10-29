const crypto = require('node:crypto');
function sign(value) { return crypto.createHmac('sha256', process.env.ADMIN_SESSION_SECRET || '').update(value).digest('hex'); }
function cookie(req, name) { const row=(req.headers.cookie||'').split(';').map(v=>v.trim()).find(v=>v.startsWith(name+'=')); return row ? decodeURIComponent(row.slice(name.length+1)) : ''; }
function isAdmin(req) { const value=cookie(req,'vci_admin'); if(!value || !process.env.ADMIN_SESSION_SECRET) return false; const [stamp, signature]=value.split('.'); if(!stamp || !signature || Date.now()-Number(stamp)>1000*60*60*8) return false; const expected=sign(stamp); return signature.length===expected.length && crypto.timingSafeEqual(Buffer.from(signature),Buffer.from(expected)); }
function requireAdmin(req,res) { if(!isAdmin(req)){res.status(401).json({error:'Authentication required.'});return false;} return true; }
function sessionCookie() { const stamp=String(Date.now()); return `${stamp}.${sign(stamp)}`; }
module.exports = { isAdmin, requireAdmin, sessionCookie };
