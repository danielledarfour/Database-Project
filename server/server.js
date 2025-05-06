require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const config = require('./config');
const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());

// Verify OpenAI API Key
if (!process.env.OPENAI_API_KEY && !config.openai_api_key) {
  console.warn('Warning: OPENAI_API_KEY not found in environment variables or config. Chatbot functionality will not work properly.');
}

// Routes
app.use('/api', routes);

// Start server
app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
})