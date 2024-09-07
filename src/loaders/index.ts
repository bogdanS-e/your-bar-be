import expressLoader from './express';
import type { Express } from 'express';
import './mongoDB';

export default async function (app: Express) {
  expressLoader(app);
  console.log('express loaded');
}