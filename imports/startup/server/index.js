/* eslint-disable no-new */
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { ApolloServer } from 'apollo-server-express';
import { WebApp } from 'meteor/webapp';
import { getUser } from 'meteor/apollo';
import merge from 'lodash/merge';
import UserSchema from '../../api/users/User.graphql';
import UserResolver from '../../api/users/resolvers';
import SettingSchema from '../../api/settings/Setting.graphql';
import SettingResolver from '../../api/settings/resolvers';

import FetchJob from '../../../server/fetchJob';

const { createLogger, transports, format } = require('winston');
const cronJob = require('cron').CronJob;

const { combine, timestamp, label, printf } = format;

const loggerFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const logger = createLogger({
  format: combine(label({ label: 'MeteorServer' }), timestamp(), loggerFormat),
  transports: [new transports.Console()],
});

const typeDefs = [UserSchema, SettingSchema];

const resolvers = merge(UserResolver, SettingResolver);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => ({
    user: await getUser(req.headers.authorization),
  }),
});

server.applyMiddleware({
  app: WebApp.connectHandlers,
  path: '/graphql',
});

WebApp.connectHandlers.use('/graphql', (req, res) => {
  if (req.method === 'GET') {
    res.end();
  }
});

Accounts.onLogin((loginObj) => {
  logger.log({ level: 'info', message: `successful login for user ${loginObj.user.username} with _id ${loginObj.user._id}` });
});

Accounts.onLogout((logoutObj) => {
  logger.log({ level: 'info', message: `successful logout for user ${logoutObj.user.username} with _id ${logoutObj.user._id}` });
});

logger.log({ level: 'info', message: `server started... registered users: ${Meteor.users.find({}).fetch().length}` });
logger.log({ level: 'info', message: 'starting cron job..' });
new cronJob(
  '* * * * *',
  async () => {
    logger.log({ level: 'info', message: 'running fetch RSS job..' });
    await FetchJob.fetchRSS();
  },
  null,
  true,
  'Europe/Berlin'
);
