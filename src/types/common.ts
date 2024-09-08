import { ObjectId } from "mongodb";

export interface IResError {
  error: string;
}

export interface IWithObjectId {
 _id: ObjectId;
}