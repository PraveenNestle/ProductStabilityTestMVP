/**
 * Product Stability Test MVP - Main Entry Point
 * 
 * This is the root entry point for the application.
 * For development, the actual application servers are located at:
 * - Frontend: sdct/frontend/ (React + Vite)
 * - Backend API: sdct/backend/api/ (Express.js)
 */

const http = require('http');
const path = require('path');
const fs = require('fs');

// Define the port
const PORT = process.env.PORT || 3000;

/**
 * Create HTTP Server
 * Serves a welcome page with links to documentation
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

  // Route handling
  if (req.url === '/' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(getWelcomePage());
  } else if (req.url === '/health' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'healthy', timestamp: new Date().toISOString() }));
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found', message: 'Endpoint not found' }));
  }
});

/**
 * Generate Welcome Page HTML
 */
function getWelcomePage() {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Product Stability Test MVP</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          line-height: 1.6;
          max-width: 900px;
          margin: 0 auto;
          padding: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          color: #333;
        }
        .container {
          background: white;
          border-radius: 10px;
          padding: 40px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.1);
        }
        h1 {
          color: #667eea;
          margin-top: 0;
        }
        h2 {
          color: #764ba2;
          border-bottom: 2px solid #667eea;
          padding-bottom: 10px;
          margin-top: 30px;
        }
        .status {
          background: #d4edda;
          border: 1px solid #c3e6cb;
          color: #155724;
          padding: 15px;
          border-radius: 5px;
          margin: 20px 0;
        }
        .links {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 15px;
          margin: 20px 0;
        }
        .link-card {
          background: #f8f9fa;
          border-left: 4px solid #667eea;
          padding: 15px;
          border-radius: 5px;
          text-decoration: none;
          color: #333;
          transition: all 0.3s ease;
        }
        .link-card:hover {
          background: #e9ecef;
          transform: translateX(5px);
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .link-card h3 {
          margin: 0 0 5px 0;
          color: #667eea;
        }
        .link-card p {
          margin: 0;
          font-size: 14px;
          color: #666;
        }
        .tech-stack {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 5px;
          margin: 20px 0;
        }
        .tech-stack ul {
          margin: 10px 0;
          padding-left: 20px;
        }
        .tech-stack li {
          margin: 5px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🚀 Product Stability Test MVP</h1>
        <p>Capture, review, extract and analyze product stability testing data</p>
        
        <div class="status">
          <strong>✓ Status: Running</strong><br>
          Server is operational and ready to serve requests.
        </div>

        <h2>📚 Documentation & Resources</h2>
        <div class="links">
          <a href="/README.md" class="link-card">
            <h3>README</h3>
            <p>Project overview and getting started guide</p>
          </a>
          <a href="/ARCHITECTURE_DECISIONS.md" class="link-card">
            <h3>Architecture Decisions</h3>
            <p>Technical architecture and design decisions</p>
          </a>
          <a href="/SCHEMA_SUMMARY.md" class="link-card">
            <h3>Schema Summary</h3>
            <p>Data model and schema definitions</p>
          </a>
          <a href="/REQUIREMENTS_TRACEABILITY.md" class="link-card">
            <h3>Requirements Traceability</h3>
            <p>Requirements mapping and compliance tracking</p>
          </a>
        </div>

        <h2>🛠️ Technology Stack</h2>
        <div class="tech-stack">
          <h3>Frontend</h3>
          <ul>
            <li><strong>Framework:</strong> React 18.3</li>
            <li><strong>Build Tool:</strong> Vite 5.4</li>
            <li><strong>Auth:</strong> Azure MSAL</li>
          </ul>
          
          <h3>Backend</h3>
          <ul>
            <li><strong>Runtime:</strong> Node.js 22.x</li>
            <li><strong>Framework:</strong> Express.js</li>
            <li><strong>Storage:</strong> Azure Blob Storage</li>
            <li><strong>Security:</strong> Helmet, CORS, JWT</li>
          </ul>
        </div>

        <h2>🔗 API Endpoints</h2>
        <ul>
          <li><code>GET /</code> - Welcome page (this page)</li>
          <li><code>GET /health</code> - Health check endpoint</li>
        </ul>

        <h2>📦 Project Structure</h2>
        <pre style="background: #f8f9fa; padding: 15px; border-radius: 5px; overflow-x: auto;">
ProductStabilityTestMVP/
├── sdct/
│   ├── frontend/          # React + Vite frontend application
│   └── backend/api/       # Express.js backend API
├── index.js               # This file - root entry point
├── package.json           # Root package configuration
├── README.md              # Project documentation
└── [HTML/Documentation]   # Analysis reports and documentation files
        </pre>

        <h2>⚙️ Environment</h2>
        <ul>
          <li><strong>Node Version:</strong> ${process.version}</li>
          <li><strong>Port:</strong> ${PORT}</li>
          <li><strong>Environment:</strong> ${process.env.NODE_ENV || 'development'}</li>
          <li><strong>Platform:</strong> ${process.platform}</li>
        </ul>

        <hr style="margin: 40px 0; border: none; border-top: 1px solid #ddd;">
        <p style="text-align: center; color: #666; font-size: 14px;">
          Product Stability Test MVP © 2024 | Powered by Node.js & Express
        </p>
      </div>
    </body>
    </html>
  `;
}

// Start the server
server.listen(PORT, () => {
  console.log(`✓ Server running at http://localhost:${PORT}`);
  console.log(`✓ Health check: http://localhost:${PORT}/health`);
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
