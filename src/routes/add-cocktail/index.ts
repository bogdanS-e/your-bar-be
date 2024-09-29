import { NextFunction, Request, Response, Router } from 'express';
import { z, ZodError } from 'zod';
import uploadImage from '../../utils/uploadImage';
import multerUpload from '../middlewares/multer';
import { IResError } from '../../types/common';
import { addNewCocktail } from '../../db/schemas/cocktails';
import { CocktailTag, ICocktailIngredient } from '../../types/cocktail';
import { ObjectId } from 'mongodb';

interface IAddCocktailReq {
  name: string;
  description: string;
  recipe: string;
  tags: string; //pass string as Form data json array
  ingredients: string;
}

interface IAddCocktailRes {
  name: string;
  description: string;
  tags: CocktailTag[];
  image: string | null;
  ingredients: ICocktailIngredient[];
}

const cocktailSchema = z.object({
  name: z.string().min(1, 'Cocktail name is required').max(30, 'Name too long'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(800, 'Description too long'),
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
  ingredients: z.array(
    z.object({
      ingredientId: z.string(),
      isOptional: z.boolean(),
      isDecoration: z.boolean(),
      name: z
        .string()
        .min(1, 'Ingredient name is required')
        .max(30, 'Ingredient name too long'),
      value: z.number().min(1, 'Ingredient value must be greater than 0').max(1000, 'Ingredient value too large'),
      unit: z.number().min(0, 'Ingredient unit is required'),
    })
  )
    .min(1, 'At least 1 ingredient is required')
    .max(10, 'No cocktail has 10 ingredients')
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
      res.status(400).json({
        error: error.errors[0].message,
      });
    }
  }
}

export default function (app: Router) {
  const route = Router();
  app.use('/add-cocktail', route);

  route.post('/', multerUpload.single('image'), validateCocktail, async (req, res: Response<IAddCocktailRes | IResError>) => {
    const { name, description, recipe, ingredients, tags } = req.body as IAddCocktailReq;
    let imageUrl = null;

    try {
      // Upload the image to Cloudinary if present
      if (req.file) {
        imageUrl = await uploadImage(req.file, 'cocktails');
        console.log('Uploaded image URL:', imageUrl);
      }

      // Save ingredient to the database (with image URL if available)
      const ingredient = {
        name,
        description,
        recipe,
        tags: JSON.parse(tags).sort((a, b) => a - b) as CocktailTag[], // Parse tags since they are sent as JSON
        ingredients: JSON.parse(ingredients) as ICocktailIngredient[], // Parse ingredients since they are sent as JSON
        image: imageUrl,
      };

      await addNewCocktail({
        nameEn: ingredient.name,
        descriptionEn: ingredient.description,
        recipeEn: ingredient.recipe,
        tags: ingredient.tags,
        ingredients: ingredient.ingredients.map(({ ingredientId, value, unit, isOptional, isDecoration }) => ({
          ingredientId: new ObjectId(ingredientId),
          value,
          unit,
          isOptional,
          isDecoration
        })),
        image: imageUrl,
      });

      res.status(201).json(ingredient);
    } catch (error) {
      console.error('Error uploading image', error);
      res.status(500).json({
        error: 'Error while adding new cocktail',
      });
    }
  });

  return route;
}