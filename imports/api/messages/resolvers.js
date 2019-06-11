import { Meteor } from 'meteor/meteor';
import moment from 'moment';
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
    messageCount(_, __, context) {
      const reqUser = context.user;
      if (reqUser) {
        logger.log({ level: 'info', message: `got messages count request for _id ${reqUser && reqUser._id}` });
        const user = reqUser && Meteor.users.findOne(reqUser._id);
        logger.log({ level: 'info', message: `returning messages count for _id ${user._id}` });
        return Messages.find({
          userId: user._id,
          isMarkedRead: false,
          pubDate: {
            $gte: moment()
              .subtract(3, 'days')
              .toDate(),
          },
        }).fetch().length;
      }
    },
    messages(_, __, context) {
      const reqUser = context.user;
      logger.log({ level: 'info', message: `got messages request for _id ${reqUser && reqUser._id}` });
      const user = reqUser && Meteor.users.findOne(reqUser._id);
      logger.log({ level: 'info', message: `returning messages for _id ${user._id}` });
      return Messages.find(
        {
          userId: user._id,
          isRead: false,
          pubDate: {
            $gte: moment()
              .subtract(3, 'days')
              .toDate(),
          },
        },
        { sort: { pubDate: -1 } }
      );
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
    markAllAsRead(_, args, context) {
      const reqUser = context.user;
      logger.log({ level: 'info', message: `got markAllAsRead request from _id ${reqUser && reqUser._id}` });
      const foundUser = reqUser && Meteor.users.findOne(reqUser._id);
      if (!foundUser) {
        logger.log({ level: 'warn', message: `markAsRead requester with ${reqUser._id} is no user` });
        throw new Error('not authorized');
      }
      Messages.update({ userId: foundUser._id }, { $set: { isMarkedRead: true } }, { multi: true });
      logger.log({ level: 'info', message: `marked all messages for user with id ${foundUser._id} as read` });
      return true;
    },
  },
};
