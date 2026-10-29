const { sql, send } = require('./_db');
module.exports = async (req,res) => { if(req.method !== 'GET') return send(res,405,{error:'Method not allowed.'}); try { const rows=await sql()`SELECT content_key, content_value, updated_at FROM site_content ORDER BY content_key`; return send(res,200,{items:rows}); } catch(e){ console.error(e); return send(res,200,{items:[], configured:false}); } };
