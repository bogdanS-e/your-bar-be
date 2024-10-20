import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import config from '../config';
import indexRoute from '../routes';
import { notFoundHandler, globalErrorHandler } from '../routes/middlewares/errors';
import type { Express } from 'express';
import '../db/mongoDB';

const loadApp = (app: Express) => {
  // status checkpoints
  app.get('/status', (_, res) => res.sendStatus(200).end());
  app.head('/status', (_, res) => res.sendStatus(200).end());

  // reveal real origin ip behind reverse proxies
  app.enable('trust proxy');

  // middlewares
  app.use(
    helmet({
      contentSecurityPolicy: false,
    })
  );
  app.use(cors());
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json({}));

  // routes
  app.use(config.app.apiPrefix, indexRoute());

  // erorr handlers
  app.use(notFoundHandler);
  app.use(globalErrorHandler);
};

export default loadApp;
