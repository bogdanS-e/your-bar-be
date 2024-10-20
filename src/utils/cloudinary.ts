import cloudinary from 'cloudinary';

cloudinary.v2.config({
  cloud_name: 'dl6mqzurj',
  api_key: '585146522535568',
  api_secret: 'htKUp58BJEoYw-t65_GQGWzmGOU',
});

const extractPublicIdFromUrl = (url: string): string => {
  const urlParts = url.split('/');
  // The public ID is the last part of the URL without the file extension
  // Remove the cloudinary base URL part and take the part before the last extension
  const publicIdWithExtension = urlParts.slice(7).join('/'); // Skip the first 7 parts (cloud name, 'image', 'upload', etc.)
  const publicId = publicIdWithExtension.split('.')[0]; // Remove the extension
  return publicId ? publicId : '';
};

export const uploadImage = async (
  file: Express.Multer.File,
  folder: 'cocktails' | 'ingredients' | 'custom-ingredients'
): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    cloudinary.v2.uploader
      .upload_stream(
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
      )
      .end(file.buffer); // Use the buffer directly
  });
};

export const deleteImage = async (url: string): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    cloudinary.v2.uploader.destroy(extractPublicIdFromUrl(url), (error, result) => {
      console.log('Delete image result', result);
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
};

export const replaceImage = async (
  oldImageUrl: string,
  newFile: Express.Multer.File,
  folder: 'cocktails' | 'ingredients' | 'custom-ingredients'
): Promise<string> => {
  console.log('Init replace image', oldImageUrl);

  await deleteImage(oldImageUrl);
  const newImageUrl = await uploadImage(newFile, folder);

  return newImageUrl;
};
