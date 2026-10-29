const { sql, send } = require('../_db');
const { requireAdmin } = require('../_auth');
module.exports = async (req,res) => {
  if(!requireAdmin(req,res)) return;
  if(req.method !== 'GET') return send(res,405,{error:'Method not allowed.'});
  try { return send(res,200,{items:await sql()`SELECT id,file_name,url,content_type,size_bytes,created_at FROM media_assets ORDER BY created_at DESC LIMIT 100`}); }
  catch { return send(res,500,{error:'Media library is unavailable.'}); }
};
