import expressLoader from './express';
import type { Express } from 'express';
import '../db/mongoDB';

export default async function (app: Express) {
  expressLoader(app);
  console.log('express loaded');
}
