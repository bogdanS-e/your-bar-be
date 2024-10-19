import { Response, Router } from 'express';
import multerUpload from '../middlewares/multer';
import { IResError } from '../../types/common';
import { CocktailTag, ICocktailIngredient } from '../../types/cocktail';
import validateCocktail from '../middlewares/validateCocktail';
import { editCocktailById, getCocktailById } from '../../db/schemas/cocktails';
import { ObjectId } from 'mongodb';
import { deleteImage, replaceImage, uploadImage } from '../../utils/cloudinary';

export interface IEditCocktailReq {
  name: string;
  description: string;
  recipe: string;
  tags: string; //pass string as Form data json array
  ingredients: string;
}

interface IEditCocktailRes {
  name: string;
  description: string;
  tags: CocktailTag[];
  image: string | null;
  ingredients: ICocktailIngredient[];
}

const editCocktailRoute = (cocktailRouter: Router) => {
  cocktailRouter.put('/edit/:cocktailId', multerUpload.single('image'), validateCocktail, async (req, res: Response<IEditCocktailRes | IResError>) => {
    const { name, description, recipe, ingredients, tags } = req.body as IEditCocktailReq;
    const { cocktailId } = req.params;
    let imageUrl = null;

    const oldCocktail = await getCocktailById(cocktailId);

    if (!oldCocktail) {
      res.status(404).json({
        error: 'Cocktail not found',
      });

      return;
    }

    try {
      const oldImage = oldCocktail.image;
      const newImage = req.file;

      if (oldImage && !newImage) {
        await deleteImage(oldCocktail.image);
      } else if (newImage && !oldImage) {
        imageUrl = await uploadImage(newImage, 'cocktails');
      } else if (oldImage && newImage) {
        imageUrl = await replaceImage(oldCocktail.image, newImage, 'cocktails');
      }

      const cocktail = {
        name,
        description,
        recipe,
        tags: JSON.parse(tags).sort((a, b) => a - b) as CocktailTag[], // Parse tags since they are sent as JSON
        ingredients: JSON.parse(ingredients) as ICocktailIngredient[], // Parse ingredients since they are sent as JSON
        image: imageUrl,
      };

      await editCocktailById(cocktailId, {
        nameEn: cocktail.name,
        descriptionEn: cocktail.description,
        recipeEn: cocktail.recipe,
        tags: cocktail.tags,
        ingredients: cocktail.ingredients.map(({ ingredientId, value, unit, isOptional, isDecoration }) => ({
          ingredientId: new ObjectId(ingredientId),
          value,
          unit,
          isOptional,
          isDecoration
        })),
        image: imageUrl,
      });

      res.status(200).json({
        ...oldCocktail,
        ...cocktail,
      });
    } catch (error) {
      console.error('Error while editing cocktail', error);
      res.status(500).json({
        error: 'Error while editing cocktail',
      });
    }
  });
}

export default editCocktailRoute;