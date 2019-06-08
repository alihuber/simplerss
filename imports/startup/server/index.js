/* eslint-disable no-new */
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { ApolloServer } from 'apollo-server-express';
import { WebApp } from 'meteor/webapp';
import { getUser } from 'meteor/apollo';
import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';
import merge from 'lodash/merge';
import UserSchema from '../../api/users/User.graphql';
import UserResolver from '../../api/users/resolvers';
import SettingSchema from '../../api/settings/Setting.graphql';
import SettingResolver from '../../api/settings/resolvers';
import MessageSchema from '../../api/messages/Message.graphql';
import MessageResolver from '../../api/messages/resolvers';

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

const typeDefs = [UserSchema, SettingSchema, MessageSchema];
const DateResolver = {
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue(value) {
      return new Date(value); // value from the client
    },
    serialize(value) {
      return value.getTime(); // value sent to the client
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return new Date(ast.value); // ast value is always in string format
      }
      return null;
    },
  }),
};

const resolvers = merge(DateResolver, UserResolver, SettingResolver, MessageResolver);

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
