import dotenv from 'dotenv';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
console.log(envFound);
console.log(process.env.NODE_ENV);

if (process.env.NODE_ENV === 'development' && envFound.error) {
  throw new Error('no .env file found');
}

export default {
  app: {
    port: parseInt(process.env.PORT, 10),
    apiPrefix: process.env.API_PREFIX
  },
  mongodb: {
    password: process.env.DB_PASS,
    user: process.env.DB_USER,
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.API_SECRET,
  }
}