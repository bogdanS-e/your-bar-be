import { ObjectId, WithId } from 'mongodb';
import getDatabase from '../mongoDB';
import { ICustomIngredient, IIngredient } from '../../types/ingredient';
import generateUniqueSlug from '../../utils/generateSlug';
import { deleteImage } from '../../utils/cloudinary';

const database = getDatabase();
const collection = database.collection<ICustomIngredient>('custom-ingredients');

export const getAllCustomIngredientsByEmail = async (email: string) => {
  const ingredients = await collection
    .find(
      { visibleTo: { $in: [email] } },
      { projection: { visibleTo: 0 } } // Exclude the visibleTo field
    )
    .toArray();

  return ingredients;
};

export const getCustomIngredientByEmailAndId = async (
  email: string,
  id: string
): Promise<WithId<IIngredient> | null> => {
  const ingredient = await collection.findOne(
    {
      _id: new ObjectId(id),
      visibleTo: { $in: [email] },
    },
    { projection: { visibleTo: 0 } } // Exclude the visibleTo field
  );

  return ingredient;
};

export const addNewCustomIngredient = async (
  ingredient: Omit<IIngredient, 'slug'>,
  email: string
) => {
  const slug = await generateUniqueSlug(ingredient.nameEn, collection);

  await collection.insertOne({
    ...ingredient,
    slug,
    visibleTo: [email],
  });
};

export const editCustomIngredientById = async (
  id: string,
  ingredient: Omit<IIngredient, 'slug' | 'visibleTo'>
) => {
  const updateData = {
    $set: {
      ...ingredient,
    },
  };

  await collection.updateOne({ _id: new ObjectId(id) }, updateData);
};

export const removeEmailFromCustomIngredient = async (email: string, id: string) => {
  const result = await collection.updateOne(
    { _id: new ObjectId(id) },
    {
      $pull: { visibleTo: email },
    }
  );

  //check if `visibleTo` array is empty
  if (result.modifiedCount > 0) {
    const ingredient = await collection.findOne({ _id: new ObjectId(id) });

    if (!ingredient.visibleTo.length) {
      await collection.deleteOne({ _id: new ObjectId(id) });

      if (ingredient.image) {
        await deleteImage(ingredient.image);
      }
    }
  }
};
