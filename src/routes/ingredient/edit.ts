import { Request, Response, Router } from 'express';
import multerUpload from '../middlewares/multer';
import { IResError } from '../../types/common';
import { deleteImage, replaceImage, uploadImage } from '../../utils/cloudinary';
import { IngredientTag } from '../../types/ingredient';
import validateIngredient from '../middlewares/validateIngredient';
import {
  editCustomIngredientById,
  getCustomIngredientByEmailAndId,
} from '../../db/schemas/custom-ingredients';
import { protectedRoute } from '../middlewares/auth';

interface IEditIngredientReq {
  name: string;
  description: string;
  tags: string; //pass string as Form data json array
}

interface IEditIngredientRes {
  name: string;
  description: string;
  tags: IngredientTag[];
  image: string | null;
}

const handler = async (req: Request, res: Response<IEditIngredientRes | IResError>) => {
  const { name, description, tags } = req.body as IEditIngredientReq;
  const { ingredientId } = req.params;
  let imageUrl = null;

  const oldIngredient = await getCustomIngredientByEmailAndId(
    req.auth.payload.email as string,
    ingredientId
  );

  if (!oldIngredient) {
    res.status(404).json({
      error: 'Ingredient not found',
    });

    return;
  }

  try {
    const oldImage = oldIngredient.image;
    const newImage = req.file;

    if (oldImage && !newImage) {
      await deleteImage(oldIngredient.image);
    } else if (newImage && !oldImage) {
      imageUrl = await uploadImage(newImage, 'custom-ingredients');
    } else if (oldImage && newImage) {
      imageUrl = await replaceImage(oldIngredient.image, newImage, 'custom-ingredients');
    }

    const ingredient = {
      name,
      description,
      tags: JSON.parse(tags).sort((a, b) => a - b) as IngredientTag[], // Parse tags since they are sent as JSON
      image: imageUrl,
    };

    await editCustomIngredientById(ingredientId, {
      nameEn: ingredient.name,
      descriptionEn: ingredient.description,
      tags: ingredient.tags,
      image: ingredient.image,
    });

    res.status(200).json({
      ...oldIngredient,
      ...ingredient,
    });
  } catch (error) {
    console.error('Error while editing ingredient', error);
    res.status(500).json({
      error: 'Error while editing ingredient',
    });
  }
};

const editIngredientRoute = (ingredientRouter: Router) => {
  ingredientRouter.put(
    '/edit/:ingredientId',
    protectedRoute,
    multerUpload.single('image'),
    validateIngredient,
    handler
  );
};

export default editIngredientRoute;
