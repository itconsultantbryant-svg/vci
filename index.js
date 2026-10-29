/** Vercel-safe Node entrypoint. Browser code lives exclusively in client.js. */
const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
const publicRoot = path.join(root, 'public');
const types = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.jpeg':'image/jpeg','.jpg':'image/jpeg','.xml':'application/xml','.txt':'text/plain','.ico':'image/x-icon'};
const apiRoutes = {
  '/api/contact': require('./lib/api/contact'),
  '/api/subscribe': require('./lib/api/subscribe'),
  '/api/content': require('./lib/api/content'),
  '/api/track': require('./lib/api/track'),
  '/api/admin/login': require('./lib/api/admin/login'),
  '/api/admin/logout': require('./lib/api/admin/logout'),
  '/api/admin/dashboard': require('./lib/api/admin/dashboard'),
  '/api/admin/content': require('./lib/api/admin/content'),
  '/api/admin/submissions': require('./lib/api/admin/submissions'),
  '/api/admin/upload': require('./lib/api/admin/upload'),
  '/api/admin/media': require('./lib/api/admin/media')
};
function apiResponse(res) { res.status = code => { res.statusCode=code; return res; }; res.json = data => { res.setHeader('Content-Type','application/json; charset=utf-8'); res.end(JSON.stringify(data)); }; return res; }
module.exports = async (req,res) => {
  const clean = decodeURIComponent((req.url || '/').split('?')[0]);
  if(apiRoutes[clean]) { try { return await apiRoutes[clean](req,apiResponse(res)); } catch(error) { console.error(error); return apiResponse(res).status(500).json({error:'Server error.'}); } }
  const requested = clean === '/' ? 'index.html' : clean.replace(/^\//,'');
  let file = path.resolve(publicRoot, requested);
  if (!file.startsWith(publicRoot) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) file = path.join(publicRoot,'index.html');
  const ext = path.extname(file);
  res.statusCode=200;
  res.setHeader('Content-Type',types[ext] || 'application/octet-stream');
  res.setHeader('Cache-Control',ext==='.html'?'no-cache':'public, max-age=3600');
  fs.createReadStream(file).pipe(res);
};
