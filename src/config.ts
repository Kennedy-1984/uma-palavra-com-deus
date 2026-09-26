// Configuration Management
// ========================

import dotenv from 'dotenv';

dotenv.config();

const requiredEnvVars = [
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'ANTHROPIC_API_KEY',
  'STRIPE_SECRET_KEY',
  'BREVO_API_KEY',
];

// Validate required environment variables
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.warn(`⚠️  Missing environment variable: ${envVar}`);
  }
}

export const config = {
  app: {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '3000', 10),
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  },

  supabase: {
    url: process.env.SUPABASE_URL || '',
    anonKey: process.env.SUPABASE_ANON_KEY || '',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  },

  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY || '',
  },

  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  },

  brevo: {
    apiKey: process.env.BREVO_API_KEY || '',
  },
};

// Validate that critical configs are set
if (!config.supabase.url) {
  throw new Error('SUPABASE_URL is not configured');
}

if (!config.supabase.anonKey) {
  throw new Error('SUPABASE_ANON_KEY is not configured');
}

if (!config.anthropic.apiKey) {
  throw new Error('ANTHROPIC_API_KEY is not configured');
}

export default config;