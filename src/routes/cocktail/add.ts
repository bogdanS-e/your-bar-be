import { Request, Response, Router } from 'express';
import { uploadImage } from '../../utils/cloudinary';
import multerUpload from '../middlewares/multer';
import { IResError } from '../../types/common';
import { CocktailTag, ICocktailIngredient } from '../../types/cocktail';
import validateCocktail from '../middlewares/validateCocktail';
import { addNewCocktail } from '../../db/schemas/cocktails';
import { ObjectId } from 'mongodb';

export interface IAddCocktailReq {
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

const handler = async (req: Request, res: Response<IAddCocktailRes | IResError>) => {
  const { name, description, recipe, ingredients, tags } = req.body as IAddCocktailReq;
  let imageUrl = null;

  try {
    // Upload the image to Cloudinary if present
    if (req.file) {
      imageUrl = await uploadImage(req.file, 'cocktails');
      console.log('Uploaded image URL:', imageUrl);
    }

    const cocktail = {
      name,
      description,
      recipe,
      tags: JSON.parse(tags).sort((a, b) => a - b) as CocktailTag[], // Parse tags since they are sent as JSON
      ingredients: JSON.parse(ingredients) as ICocktailIngredient[], // Parse ingredients since they are sent as JSON
      image: imageUrl,
    };

    await addNewCocktail({
      nameEn: cocktail.name,
      descriptionEn: cocktail.description,
      recipeEn: cocktail.recipe,
      tags: cocktail.tags,
      ingredients: cocktail.ingredients.map(
        ({ ingredientId, value, unit, isOptional, isDecoration }) => ({
          ingredientId: new ObjectId(ingredientId),
          value,
          unit,
          isOptional,
          isDecoration,
        })
      ),
      image: imageUrl,
    });

    res.status(201).json(cocktail);
  } catch (error) {
    console.error('Error uploading image', error);
    res.status(500).json({
      error: 'Error while adding new cocktail',
    });
  }
};

const addCocktailRoute = (cocktailRouter: Router) => {
  cocktailRouter.post('/add', multerUpload.single('image'), validateCocktail, handler);
};

export default addCocktailRoute;
