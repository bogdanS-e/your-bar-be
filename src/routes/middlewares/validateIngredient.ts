import { z, ZodError } from 'zod';
import { NextFunction, Request, Response } from 'express';
import { IResError } from '../../types/common';
import { getMaxIngredientTagId } from '../../db/schemas/ingredient-tags';
import { IAddIngredientReq } from '../ingredient/add';

const ingredientSchema = z.object({
  name: z.string().min(1, 'Ingredient name is required').max(30, 'Name is too long'),
  description: z.string().max(800, 'Description too long'),
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
};

export default validateIngredient;
