import { NextFunction, Request, Response, Router } from 'express';
import { z, ZodError } from 'zod';
import uploadImage from '../../utils/uploadImage';
import multerUpload from '../middlewares/multer';
import { addNewIngredient } from '../../db/schemas/Ingredients';
import { IResError } from '../../types/common';
import { getMaxIngredientTagId } from '../../db/schemas/ingredient-tags';
import { IngredientTag } from '../../types/ingredient';
import { addNewCustomIngredient } from '../../db/schemas/custom-ingredients';
import { protectedRoute } from '../middlewares/auth';

interface IAddIngredientReq {
  name: string;
  description: string;
  tags: string; //pass string as Form data json array
}

interface IAddIngredientRes {
  name: string;
  description: string;
  tags: IngredientTag[];
  image: string | null;
}

const ingredientSchema = z.object({
  name: z
    .string()
    .min(1, 'Ingredient name is required')
    .max(30, 'Name is too long'),
  description: z
    .string()
    .max(800, 'Description too long'),
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

const validateIngredient = async (req: Request, res: Response<IResError>, next: NextFunction) => {
  const { name, description, tags } = req.body as IAddIngredientReq;
  const image = req.file;

  const maxId = await getMaxIngredientTagId();

  for (const tagId of JSON.parse(tags)) {
    if (tagId > maxId || tagId < 0) {
      res.status(400).json({
        error: `Unknown tag with id: ${tagId}`,
      });
      return;
    }
  }

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
        error: error.errors[0].message,
      });
    }
  }
}

export default function (app: Router) {
  const route = Router();
  app.use('/add-ingredient', route);

  route.post('/', protectedRoute, multerUpload.single('image'), validateIngredient, async (req, res: Response<IAddIngredientRes | IResError>) => {
    const { name, description, tags } = req.body as IAddIngredientReq;
    let imageUrl = null;

    try {
      // Upload the image to Cloudinary if present
      if (req.file) {
        imageUrl = await uploadImage(req.file, 'custom-ingredients');
        console.log('Uploaded image URL:', imageUrl); // Log URL to debug
      }

      // Save ingredient to the database (with image URL if available)
      const ingredient = {
        name,
        description,
        tags: JSON.parse(tags).sort((a, b) => a - b) as IngredientTag[], // Parse tags since they are sent as JSON
        image: imageUrl,
      };

      await addNewCustomIngredient(
        {
          nameEn: ingredient.name,
          descriptionEn: ingredient.description,
          tags: ingredient.tags,
          image: imageUrl,
        },
        req.auth.payload.email as string
      );

      res.status(201).json(ingredient);
    } catch (error) {
      console.error('Error uploading image', error);
      res.status(500).json({
        error: 'Error while adding new ingredient',
      });
    }
  });

  return route;
}