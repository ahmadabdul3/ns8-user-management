import { Request, Response, Router } from 'express';
import models from 'src/db/models';
import {
  RouteResponseSuccess,
  RouteResponseError,
} from 'src/services/route_response';
import { determineFriendlyMessage } from 'src/services/error_manager';

const router = Router();
router.get('/', getUsers);
router.post('/', validateParams, createUser);
export default router;

// route handlers

async function getUsers(req: Request, res: Response) {
  try {
    const events = await models.users.findAll();
    res.json(RouteResponseSuccess.default(events));
  } catch (error) {
    console.log('e', error);
    let friendlyMessage = determineFriendlyMessage(error);
    const message = 'Could not fetch users';
    res.status(422).json(new RouteResponseError(message, friendlyMessage, error));
  }
}

async function createUser(req: Request, res: Response) {
  try {
    const { user } = req.body;
    const newUser = await models.users.createStd({ user });
    res.json(RouteResponseSuccess.default(newUser));
  } catch (error) {
    console.log('e', error);
    let friendlyMessage = determineFriendlyMessage(error);
    const message = 'Could not create user';
    res.status(422).json(new RouteResponseError(message, friendlyMessage, error));
  }
}

// helpers
// - leaving validation in here to keep things simple
// - ideally this is an imported validation package or a
//   separate validation module
// - this is written specifically for the create user route
//   so it works within that context and makes assumptions
// - the error const is a bit redundant, but it's to illustrate
//   what would go in that argument when there are errors from
//   other libraries - basically the stacktrace would go there
function validateParams(req: Request, res: Response, next: Next) {
  const { user } = req.body;
  if (!user) {
    const message = 'A required param for this endpoint is missing';
    const error = { name: 'missing-required-param', message };
    res.status(422).json(new RouteResponseError(message, message, error));
    return;
  }

  for (const userField in user) {
    if (
      userField !== 'phone'
      && userField !== 'firstName'
      && userField !== 'lastName'
      && userField !== 'email'
      && userField !== 'password'
    ) {
      const message = 'Invalid param detected';
      const friendlyMessage = 'The request has invalid params';
      const error = { name: 'invalid-param', message };
      res.status(422).json(new RouteResponseError(message, friendlyMessage, error));
      return;
    }
  }

  next();
}
