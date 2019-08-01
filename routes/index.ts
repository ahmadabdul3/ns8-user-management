import express from 'express';
import path from 'path';
import fetch from 'node-fetch';
import http from 'src/services/http';
import userRouter from './users';
import eventRouter from './events';

const router = express.Router();

router.use('/users', userRouter);
router.use('/events', eventRouter);

// send all requests to index.html so browserHistory in React Router works
router.get('*', (req, res) => {
  const filePath = path.join(__dirname, '../views/index.pug');
  res.render(path.resolve(filePath));
});

export default router;
