import { z, ZodError } from 'zod';
import { NextFunction, Request, Response } from 'express';
import { IResError } from '../../types/common';
import { IAddCocktailReq } from '../cocktail/add';

const cocktailSchema = z.object({
  name: z.string().min(1, 'Cocktail name is required').max(30, 'Name too long'),
  description: z.string().min(1, 'Description is required').max(800, 'Description too long'),
  recipe: z.string().min(1, 'Recipe is required').max(1000, 'Recipe too long'),
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
  ingredients: z
    .array(
      z.object({
        ingredientId: z.string().min(1, 'Ingredient is required'),
        isOptional: z.boolean(),
        isDecoration: z.boolean(),
        value: z
          .number()
          .min(1, 'Ingredient value must be greater than 0')
          .max(1000, 'Ingredient value too large'),
        unit: z.number().min(0, 'Ingredient unit is required'),
      })
    )
    .min(1, 'At least 1 ingredient is required')
    .max(10, 'No cocktail has 10 ingredients'),
});

const validateCocktail = async (req: Request, res: Response<IResError>, next: NextFunction) => {
  const { name, description, recipe, ingredients, tags } = req.body as IAddCocktailReq;
  const image = req.file;

  /* const maxId = await getMaxIngredientTagId();

  for (const tagId of JSON.parse(tags)) {
    if (tagId > maxId || tagId < 0) {
      res.status(400).json({
        error: `Unknown tag with id: ${tagId}`,
      });
      return;
    }
  } */

  // Create a new object to validate
  const formData = {
    name,
    description,
    recipe,
    tags: JSON.parse(tags), // Convert tags to numbers
    ingredients: JSON.parse(ingredients),
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
    cocktailSchema.parse(formData);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      console.log(error);

      res.status(400).json({
        error: error.errors[0].message,
      });
    }
  }
};

export default validateCocktail;
