const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:postgres@postgres:5432/postgres',
});

// Initialize database tables
async function initializeDatabase() {
  try {
    console.log('DB: Creating users table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(100) DEFAULT 'user',
        status VARCHAR(50) DEFAULT 'active',
        blocked BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('DB: Users table created or already exists.');

    // Drop and recreate the table to ensure correct structure
    // await pool.query('DROP TABLE IF EXISTS users CASCADE');
    console.log('DB: Creating users table again (redundant, should be removed)...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(100) DEFAULT 'user',
        status VARCHAR(50) DEFAULT 'active',
        blocked BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('DB: Users table (redundant) created or already exists.');

    console.log('DB: Creating role_cards table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS role_cards (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        role_type VARCHAR(100) NOT NULL,
        webhook_url VARCHAR(500),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('DB: role_cards table created or already exists.');

    console.log('DB: Inserting default role cards...');
    await pool.query(`
      INSERT INTO role_cards (title, description, role_type, webhook_url) VALUES
      ('Customer Engineer', 'Get support and assistance for customer engineering workflows', 'customer_engineer', 'http://localhost:5678/webhook/122742ad-e48e-468a-905d-e7b5b3cd24c6/chat'),
      ('Azure Engineer', 'Access Azure-specific workflows and automation tools', 'azure_engineer', 'http://localhost:5678/webhook/122742ad-e48e-468a-905d-e7b5b3cd24c6/chat'),
      ('Project Manager', 'Manage projects and track progress with automated workflows', 'project_manager', 'http://localhost:5678/webhook/122742ad-e48e-468a-905d-e7b5b3cd24c6/chat'),
      ('Service Manager', 'Oversee service delivery and customer satisfaction workflows', 'service_manager', 'http://localhost:5678/webhook/122742ad-e48e-468a-905d-e7b5b3cd24c6/chat')
      ON CONFLICT DO NOTHING
    `);
    console.log('DB: Default role cards inserted or already exist.');

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}

// JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Routes
app.post('/api/register', async (req, res) => {
  try {
    const { email, password, company_role } = req.body;
    if (!email || !password || !company_role) {
      return res.status(400).json({ error: 'Email, password, and company role are required' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (email, password_hash, company_role, status) VALUES ($1, $2, $3, $4) RETURNING id, email, role, company_role, status',
      [email, hashedPassword, company_role, 'pending']
    );
    const token = jwt.sign({ id: result.rows[0].id, email }, JWT_SECRET);
    res.json({ token, user: { id: result.rows[0].id, email, role: result.rows[0].role, company_role: result.rows[0].company_role, status: result.rows[0].status } });
  } catch (error) {
    if (error.code === '23505') {
      res.status(400).json({ error: 'Email already exists' });
    } else {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const result = await pool.query(
      'SELECT id, email, password_hash, role, blocked, status FROM users WHERE email = $1',
      [email]
    );
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials', debug: { found: false, email } });
    }
    const user = result.rows[0];
    if (user.blocked) {
      return res.status(403).json({ error: 'Account is blocked', debug: { blocked: true, user } });
    }
    if (user.status !== 'approved') {
      return res.status(403).json({ error: 'Account not approved by admin yet', debug: { status: user.status } });
    }
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials', debug: { user, password, password_hash: user.password_hash, validPassword } });
    }
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
    res.json({ token, user: { id: user.id, email: user.email, role: user.role }, debug: { user, password, password_hash: user.password_hash, validPassword } });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', debug: { error: error.toString() } });
  }
});

// Role cards endpoints
app.get('/api/role-cards', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM role_cards WHERE is_active = true ORDER BY created_at ASC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Role cards error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin routes
app.get('/api/admin/users', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, email, role, status, blocked, created_at FROM users ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Admin users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/admin/users/:id/block', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('UPDATE users SET blocked = true WHERE id = $1', [id]);
    res.json({ message: 'User blocked successfully' });
  } catch (error) {
    console.error('Block user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/admin/users/:id/unblock', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('UPDATE users SET blocked = false WHERE id = $1', [id]);
    res.json({ message: 'User unblocked successfully' });
  } catch (error) {
    console.error('Unblock user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Role card management
app.get('/api/admin/role-cards', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM role_cards ORDER BY created_at ASC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Admin role cards error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/admin/role-cards', authenticateToken, async (req, res) => {
  try {
    const { title, description, role_type, webhook_url } = req.body;
    const result = await pool.query(
      'INSERT INTO role_cards (title, description, role_type, webhook_url) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, description, role_type, webhook_url]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Create role card error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/admin/role-cards/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, role_type, webhook_url, is_active } = req.body;
    const result = await pool.query(
      'UPDATE role_cards SET title = $1, description = $2, role_type = $3, webhook_url = $4, is_active = $5 WHERE id = $6 RETURNING *',
      [title, description, role_type, webhook_url, is_active, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update role card error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// WebSocket connection for chat
wss.on('connection', (ws) => {
  console.log('New WebSocket connection');

  ws.on('message', async (message) => {
    try {
      console.log('WebSocket message received from client:', message); // Log incoming message
      const data = JSON.parse(message);
      
      // Get the webhook URL for the specific role
      let webhookUrl = 'http://localhost:5678/webhook/122742ad-e48e-468a-905d-e7b5b3cd24c6/chat';
      
      if (data.roleType) {
        const result = await pool.query(
          'SELECT webhook_url FROM role_cards WHERE role_type = $1 AND is_active = true',
          [data.roleType]
        );
        
        if (result.rows.length > 0) {
          webhookUrl = result.rows[0].webhook_url;
        }
      }
      
      // Relay message to n8n webhook
      const payload = {
        chatInput: data.text || data.chatInput || '',
        sessionId: data.sessionId || data.user || data.email || data.roleType || (Date.now() + '-' + Math.random()),
        ...data
      };
      console.log('Sending payload to n8n webhook:', webhookUrl, payload); // Log payload and URL
      const n8nResponse = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const responseData = await n8nResponse.json();
      console.log('Received response from n8n:', responseData); // Log n8n response
      
      // Send response back to client
      ws.send(JSON.stringify({
        type: 'response',
        data: responseData
      }));
      console.log('Sent response back to WebSocket client.'); // Log send
    } catch (error) {
      console.error('WebSocket message error:', error);
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Failed to process message'
      }));
    }
  });

  ws.on('close', () => {
    console.log('WebSocket connection closed');
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3001;

// Start server
async function startServer() {
  try {
    console.log('Starting server initialization...');
    await initializeDatabase();
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Fatal error during server startup:', err);
    process.exit(1);
  }
}

startServer(); 