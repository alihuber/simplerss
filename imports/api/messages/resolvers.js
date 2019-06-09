import { Meteor } from 'meteor/meteor';
import { Messages } from './constants';

const { createLogger, transports, format } = require('winston');

const { combine, timestamp, label, printf } = format;

const loggerFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const logger = createLogger({
  format: combine(label({ label: 'MessageResolver' }), timestamp(), loggerFormat),
  transports: [new transports.Console()],
});

export default {
  Query: {
    messages(_, __, context) {
      const reqUser = context.user;
      logger.log({ level: 'info', message: `got messages request for _id ${reqUser && reqUser._id}` });
      const user = reqUser && Meteor.users.findOne(reqUser._id);
      logger.log({ level: 'info', message: `returning messages for _id ${user._id}` });
      return Messages.find({ userId: user._id }, { sort: { pubDate: -1 } }).fetch();
    },
  },
  Mutation: {
    markAsRead(_, args, context) {
      const reqUser = context.user;
      const messageId = args.messageId;
      logger.log({ level: 'info', message: `got markAsRead request from _id ${reqUser && reqUser._id}` });
      const foundUser = reqUser && Meteor.users.findOne(reqUser._id);
      const foundMessage = Messages.findOne(messageId);
      if (!foundMessage) {
        logger.log({ level: 'warn', message: `message with ${messageId} not found` });
        throw new Error('not authorized');
      }
      if (!foundUser) {
        logger.log({ level: 'warn', message: `markAsRead requester with ${reqUser._id} is no user` });
        throw new Error('not authorized');
      }
      Messages.update({ _id: messageId }, { $set: { isMarkedRead: true } });
      logger.log({ level: 'info', message: `marked message with _id ${messageId} as read` });
      return Messages.findOne(messageId);
    },
  },
};
