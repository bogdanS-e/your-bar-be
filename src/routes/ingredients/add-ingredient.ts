import { NextFunction, Request, Response, Router } from 'express';
import { z, ZodError } from 'zod';
import uploadImage from '../../utils/uploadImage';
import multerUpload from '../middlewares/multer';
import { addNewIngredient } from '../../db/schemas/Ingredients';

const ingredientSchema = z.object({
  name: z
    .string()
    .min(1, 'Ingredient name is required')
    .max(100, 'Name too long'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(500, 'Description too long'),
  tags: z.array(z.number()).nonempty('At least one tag is required'),
  image: z
    .object({
      buffer: z.instanceof(Buffer),
      originalname: z.string(),
      mimetype: z.string(),
      size: z.number(),
    })
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: 'Image size should be less than 5MB',
    })
    .nullable(),
});


const validateIngredient = (req: Request, res: Response, next: NextFunction) => {
  const { name, description, tags } = req.body;
  const image = req.file;

  // Create a new object to validate
  const formData = {
    name,
    description,
    tags: JSON.parse(tags), // Convert tags to numbers
    image: image
      ? {
        buffer: image.buffer,
        originalname: image.originalname,
        mimetype: image.mimetype,
        size: image.size,
      }
      : null,
  };

  try {
    ingredientSchema.parse(formData);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        errors: error.errors,
      });
    }
  }
}

export default function (app: Router) {
  const route = Router();

  app.post('/add-ingredient', multerUpload.single('image'), validateIngredient, async (req, res) => {
    const { name, description, tags } = req.body;
    let imageUrl = null;

    try {
      // Upload the image to Cloudinary if present
      if (req.file) {
        imageUrl = await uploadImage(req.file);
        console.log('Uploaded image URL:', imageUrl); // Log URL to debug
      }

      // Save ingredient to the database (with image URL if available)
      const ingredient = {
        name,
        description,
        tags: JSON.parse(tags), // Parse tags since they are sent as JSON
        imageUrl,
      };

      await addNewIngredient({
        nameEn: ingredient.name,
        descriptionEn: ingredient.description,
        tags: ingredient.tags,
        image: imageUrl,
      });

      res.status(201).json({ message: 'Ingredient created', data: ingredient });
    } catch (error) {
      console.error('Error uploading image', error);
      res.status(500).json({
        message: 'Erro when add new ingredien',
        error
      });
    }

    /* try {
      await addNewIngredient({
        nameEn: name,
        descriptionEn: description,
        tags: tags.split(',').map((num) => parseInt(num))
      });
    } catch (error) {
      res.status(500);
      res.json({ error: { message: 'STOP here DO not continue Koryafff'} });
      return;
    } */
  });

  route;
}