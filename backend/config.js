module.exports = {
  // Server Configuration
  PORT: process.env.PORT || 3050,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Frontend URL
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3001',
  
  // JWT Secret
  JWT_SECRET: process.env.JWT_SECRET || 'alrabie-real-estate-super-secret-key-2024',
  
  // Database (Prisma + PostgreSQL)
  DATABASE_URL: process.env.DATABASE_URL,
  
  // CORS Origins
  CORS_ORIGINS: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : ['http://localhost:3001', 'http://localhost:3000'],
  
  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000, // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
};
