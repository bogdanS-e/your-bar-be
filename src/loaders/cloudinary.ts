import cloudinaryInstance from 'cloudinary';

import config from '../config';

cloudinaryInstance.v2.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

export default cloudinaryInstance;