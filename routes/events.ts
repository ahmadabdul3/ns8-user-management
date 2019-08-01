import { Request, Response, Router } from 'express';
import moment from 'moment';
import models from 'src/db/models';
import {
  RouteResponseSuccess,
  RouteResponseError,
} from 'src/services/route_response';
import { determineFriendlyMessage } from 'src/services/error_manager';

const router = Router();
router.get('/', getEvents);
router.post('/', validateCreateParams, createEvent);
export default router;


// route handlers
async function getEvents(req: Request, res: Response) {
  try {
    const findQuery = await buildQuery(req);
    const events = await models.events.findAll({ where: findQuery });
    res.json(RouteResponseSuccess.default(events));
  } catch (error) {
    console.log('e', error);
    let friendlyMessage = determineFriendlyMessage(error);
    const message = 'Could not fetch events';
    res.status(422).json(new RouteResponseError(message, friendlyMessage, error));
  }
}

async function createEvent(req: Request, res: Response) {
  try {
    const { event } = req.body;
    const newEvent = await models.events.create(event);
    res.json(RouteResponseSuccess.default(newEvent));
  } catch (error) {
    console.log('e', error);
    let friendlyMessage = determineFriendlyMessage(error);
    const message = 'Could not create event';
    res.status(422).json(new RouteResponseError(message, friendlyMessage, error));
  }
}

// helpers - can be moved out, kept here for simplicity

async function buildQuery(req) {
  const { userId, latest } = req.query;
  const query = {};
  if (userId) query.userId = userId;
  if (latest) {
    const latestDayEvent = await models.events.findForLatestDate();
    query.createdAt = buildLatestDayQuery(latestDayEvent);
  }
  return query;
}

function buildLatestDayQuery(latestDayEvent) {
  const start = latestDayEvent.createdAt.startOf('day');
  const end = latestDayEvent.createdAt.clone().endOf('day');
  return {
    [models.Sequelize.Op.gte]: start,
    [models.Sequelize.Op.lte]: end,
  };
}

function validateCreateParams(req: Request, res: Response, next: Next) {
  const { event } = req.body;
  if (!event) {
    const message = 'A required param for this endpoint is missing';
    const error = { name: 'missing-required-param', message };
    res.status(422).json(new RouteResponseError(message, message, error));
    return;
  }

  for (const eventField in event) {
    if (
      eventField !== 'type'
      && eventField !== 'userId'
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
