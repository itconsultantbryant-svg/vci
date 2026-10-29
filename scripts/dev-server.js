require('dotenv').config({ path: '.env.local' });
const http = require('node:http');
const handler = require('../index');
const port = process.env.PORT || 4173;
http.createServer(handler).listen(port, () => console.log(`Vivacious site running at http://localhost:${port}`));
