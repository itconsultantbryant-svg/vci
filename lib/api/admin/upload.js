const { put } = require('@vercel/blob');
const { sql, send, readBody } = require('../_db');
const { requireAdmin } = require('../_auth');
const safeName = value => String(value||'upload').replace(/[^a-z0-9._-]/gi,'-').slice(0,100);
module.exports = async (req,res) => {
  if(!requireAdmin(req,res)) return;
  if(req.method !== 'POST') return send(res,405,{error:'Method not allowed.'});
  try {
    if(!process.env.BLOB_READ_WRITE_TOKEN) return send(res,503,{error:'Media uploads are not configured. Add BLOB_READ_WRITE_TOKEN in Vercel.'});
    const {name,type,data}=await readBody(req);
    if(!/^image\/(jpeg|png|webp|gif)$/.test(String(type||''))) return send(res,400,{error:'Upload a PNG, JPEG, WebP, or GIF image.'});
    const source=String(data||'').replace(/^data:[^;]+;base64,/,'');
    const buffer=Buffer.from(source,'base64');
    if(!buffer.length || buffer.length>4*1024*1024) return send(res,400,{error:'Choose an image smaller than 4 MB.'});
    const blob=await put(`vci-media/${Date.now()}-${safeName(name)}`,buffer,{access:'public',contentType:type,token:process.env.BLOB_READ_WRITE_TOKEN});
    await sql()`INSERT INTO media_assets (file_name, url, content_type, size_bytes) VALUES (${safeName(name)}, ${blob.url}, ${type}, ${buffer.length})`;
    return send(res,201,{ok:true,url:blob.url});
  } catch(error) { console.error(error); return send(res,500,{error:'Unable to upload this image.'}); }
};
