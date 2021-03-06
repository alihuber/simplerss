import { Meteor } from 'meteor/meteor';
import { Settings } from './constants';

const { createLogger, transports, format } = require('winston');

const { combine, timestamp, label, printf } = format;

const loggerFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const logger = createLogger({
  format: combine(label({ label: 'SettingsResolver' }), timestamp(), loggerFormat),
  transports: [new transports.Console()],
});

export default {
  Query: {
    settings(obj, args, context) {
      const reqUser = context.user;
      logger.log({ level: 'info', message: `got settings request for _id ${reqUser && reqUser._id}` });
      const user = reqUser && Meteor.users.findOne(reqUser._id);
      if (user) {
        const settings = Settings.findOne({ userId: user._id });
        if (settings) {
          logger.log({ level: 'info', message: `found settings for user with _id ${user._id}` });
          return settings;
        } else {
          logger.log({ level: 'info', message: `found no settings for user with _id ${user._id}` });
          return {};
        }
      } else {
        logger.log({ level: 'info', message: 'user not found, returning {}' });
        return {};
      }
    },
  },
  Mutation: {
    updateSetting(_, args, context) {
      const interval = args.setting.interval || '60';
      const folders = args.setting.folders || [];
      const user = context.user;
      logger.log({ level: 'info', message: `got updateSettings request from _id ${user && user._id}` });
      const foundUser = user && Meteor.users.findOne(user._id);
      if (!foundUser) {
        logger.log({ level: 'warn', message: `update settings requester with ${user._id} is no user` });
        throw new Error('not authorized');
      }
      Settings.upsert({ userId: user._id }, { $set: { interval, folders, nextEvent: new Date() } });
      logger.log({ level: 'info', message: `updated settings for user with _id ${user._id}` });
      return Settings.findOne({ userId: user._id });
    },
  },
};
