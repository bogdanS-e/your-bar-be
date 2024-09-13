import cloudinary from 'cloudinary';

cloudinary.v2.config({
  cloud_name: 'dl6mqzurj',
  api_key: '585146522535568',
  api_secret: 'htKUp58BJEoYw-t65_GQGWzmGOU',
});

const uploadImage = async (file: Express.Multer.File, folder: 'cocktails' | 'ingredients'): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    cloudinary.v2.uploader.upload_stream(
      {
        folder,
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result?.secure_url ?? '');
        }
      }
    ).end(file.buffer); // Use the buffer directly
  });
};

export default uploadImage;