/**
 * Product Stability Test MVP - Main Entry Point
 * 
 * Serves static HTML files from the repository root
 * Main application: Stability_Capture_Mockup.html (React + Vite compiled)
 */

const http = require('http');
const path = require('path');
const fs = require('fs');
const url = require('url');

// Define the port
const PORT = process.env.PORT || 3000;

/**
 * Create HTTP Server
 * Serves static HTML files and documentation
 */
const server = http.createServer((req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Parse the URL
  const parsedUrl = url.parse(req.url, true);
  let pathname = parsedUrl.pathname;

  // Remove leading slash
  if (pathname === '/') {
    pathname = '/Stability_Capture_Mockup.html';
  }

  // Health check endpoint
  if (pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      status: 'healthy', 
      timestamp: new Date().toISOString(),
      app: 'Product Stability Test MVP'
    }));
    return;
  }

  // Security: prevent directory traversal
  if (pathname.includes('..')) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Bad Request' }));
    return;
  }

  // Construct file path
  const filepath = path.join(__dirname, pathname);

  // Check if file exists and serve it
  fs.stat(filepath, (err, stats) => {
    if (err || !stats.isFile()) {
      // File not found - try to serve index or list available files
      if (pathname !== '/Stability_Capture_Mockup.html') {
        // Redirect to main app
        res.writeHead(302, { 'Location': '/' });
        res.end();
      } else {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(get404Page());
      }
      return;
    }

    // Determine content type
    let contentType = 'application/octet-stream';
    const ext = path.extname(filepath);
    
    switch (ext) {
      case '.html':
        contentType = 'text/html; charset=utf-8';
        break;
      case '.css':
        contentType = 'text/css; charset=utf-8';
        break;
      case '.js':
        contentType = 'application/javascript; charset=utf-8';
        break;
      case '.json':
        contentType = 'application/json; charset=utf-8';
        break;
      case '.md':
        contentType = 'text/markdown; charset=utf-8';
        break;
      case '.csv':
        contentType = 'text/csv; charset=utf-8';
        break;
      case '.png':
        contentType = 'image/png';
        break;
      case '.jpg':
      case '.jpeg':
        contentType = 'image/jpeg';
        break;
      case '.gif':
        contentType = 'image/gif';
        break;
      case '.svg':
        contentType = 'image/svg+xml';
        break;
    }

    // Read and serve the file
    fs.readFile(filepath, (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
        return;
      }

      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600',
        'Content-Length': data.length
      });
      res.end(data);
    });
  });
});

/**
 * Generate 404 Page
 */
function get404Page() {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>404 - Not Found</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          margin: 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .container {
          text-align: center;
          background: white;
          padding: 40px;
          border-radius: 10px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.1);
        }
        h1 { color: #667eea; font-size: 3em; margin: 0; }
        p { color: #666; font-size: 1.2em; }
        a {
          display: inline-block;
          margin-top: 20px;
          padding: 10px 20px;
          background: #667eea;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          transition: background 0.3s;
        }
        a:hover { background: #764ba2; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>404</h1>
        <p>Page not found</p>
        <a href="/">Return to Main App</a>
      </div>
    </body>
    </html>
  `;
}

// Start the server
server.listen(PORT, '0.0.0.0', () => {
  console.log(`✓ Product Stability Test MVP running at http://localhost:${PORT}`);
  console.log(`✓ Main app: http://localhost:${PORT}/Stability_Capture_Mockup.html`);
  console.log(`✓ Health check: http://localhost:${PORT}/health`);
  console.log(`✓ Serving files from: ${__dirname}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received - shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

module.exports = server;
