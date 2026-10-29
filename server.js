require('dotenv').config({ path: '.env.local' });
/** Local production-like server: static SPA routes plus Vercel-compatible API functions. */
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
const types = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.jpeg':'image/jpeg','.jpg':'image/jpeg','.xml':'application/xml','.txt':'text/plain'};
function apiResponse(res) { res.status = code => { res.statusCode=code; return res; }; res.json = data => { res.setHeader('Content-Type','application/json; charset=utf-8'); res.end(JSON.stringify(data)); }; return res; }
const apiRoutes = {
  '/api/contact':'./api/contact','/api/subscribe':'./api/subscribe','/api/content':'./api/content','/api/track':'./api/track',
  '/api/admin/login':'./api/admin/login','/api/admin/logout':'./api/admin/logout','/api/admin/dashboard':'./api/admin/dashboard','/api/admin/content':'./api/admin/content','/api/admin/submissions':'./api/admin/submissions'
};
http.createServer(async (req,res) => {
  const clean = decodeURIComponent((req.url || '/').split('?')[0]);
  if(apiRoutes[clean]) { try { return await require(apiRoutes[clean])(req,apiResponse(res)); } catch(error) { console.error(error); return apiResponse(res).status(500).json({error:'Server error.'}); } }
  const requested = clean === '/' ? 'index.html' : clean.replace(/^\//,'');
  let file = path.resolve(root, requested);
  if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) file = path.join(root,'index.html');
  const ext = path.extname(file);
  res.writeHead(200, {'Content-Type': types[ext] || 'application/octet-stream', 'Cache-Control': 'no-cache'});
  fs.createReadStream(file).pipe(res);
}).listen(process.env.PORT || 4173, () => console.log(`Vivacious site running at http://localhost:${process.env.PORT || 4173}`));
