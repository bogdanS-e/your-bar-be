import express from 'express';
import config from './config';
import load from './loaders';

const app = express();
load(app);

app
	.listen(config.app.port, () => console.log(`server running on port ${config.app.port}`))
	.on('error', (error) => {
		console.log(error.message);
		process.exit(1);
	});

export default app;

