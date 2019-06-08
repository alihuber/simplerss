import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import merge from 'lodash/merge';
import { ApolloServer } from 'apollo-server-express';
import assert from 'assert';
import UserSchema from '../imports/api/users/User.graphql';
import SettingSchema from '../imports/api/settings/Setting.graphql';
import { Settings, SETTINGS_QUERY, UPDATE_SETTINGS_MUTATION } from '../imports/api/settings/constants';
import SettingResolver from '../imports/api/settings/resolvers';

const { createTestClient } = require('apollo-server-testing');

const typeDefs = [UserSchema, SettingSchema];

const resolvers = merge(SettingResolver);

if (Meteor.isServer) {
  const constructTestServer = ({ context }) => {
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      context,
    });

    return { server };
  };

  describe('Settings query', () => {
    it('returns no settings if no data found for user', async () => {
      resetDatabase();
      const userId = Accounts.createUser({
        username: 'testuser',
        password: 'example123',
      });
      const { server } = constructTestServer({
        context: () => ({ user: { _id: userId, username: 'testuser', admin: false } }),
      });
      const { query } = createTestClient(server);
      const res = await query({ query: SETTINGS_QUERY });
      assert.equal(res.data.settings.folders, null);
      assert.equal(res.data.settings.interval, null);
    });

    it('returns settings if data found for user', async () => {
      resetDatabase();
      const folderName = 'foonews';
      const url = 'http://mynews.rss';
      const userId = Accounts.createUser({
        username: 'testuser',
        password: 'example123',
      });

      const { server } = constructTestServer({
        context: () => ({ user: { _id: userId, username: 'testuser', admin: false } }),
      });
      Settings.insert({
        userId,
        interval: '60',
        folders: [
          {
            folderName,
            subscriptions: [
              {
                url,
              },
            ],
          },
        ],
      });

      const { query } = createTestClient(server);
      const res = await query({ query: SETTINGS_QUERY });
      assert.equal(res.data.settings.folders[0].folderName, folderName);
      assert.equal(res.data.settings.folders[0].subscriptions[0].url, url);
      assert.equal(res.data.settings.interval, '60');
    });
  });

  describe('Update settings mutation', () => {
    it('throws error if user not found', async () => {
      resetDatabase();
      Accounts.createUser({
        username: 'testuser',
        password: 'example123',
      });
      const { server } = constructTestServer({
        context: () => ({ user: { _id: '1', username: 'testuser', admin: false } }),
      });

      const folderName = 'foonews';
      const url = 'http://mynews.rss';
      const setting = {
        interval: '60',
        folders: [
          {
            folderName,
            subscriptions: [
              {
                url,
              },
            ],
          },
        ],
      };

      const { mutate } = createTestClient(server);
      const res = await mutate({ mutation: UPDATE_SETTINGS_MUTATION, variables: { setting } });
      assert.equal(res.errors[0].message, 'not authorized');
      assert.equal(res.errors[0].path[0], 'updateSetting');
    });

    it('creates settings if no data found for user', async () => {
      resetDatabase();
      const folderName = 'foonews';
      const url = 'http://mynews.rss';
      const userId = Accounts.createUser({
        username: 'testuser',
        password: 'example123',
      });
      const { server } = constructTestServer({
        context: () => ({ user: { _id: userId, username: 'testuser', admin: false } }),
      });

      const setting = {
        interval: '60',
        folders: [
          {
            folderName,
            subscriptions: [
              {
                url,
              },
            ],
          },
        ],
      };

      const { mutate } = createTestClient(server);
      const res = await mutate({ mutation: UPDATE_SETTINGS_MUTATION, variables: { setting } });
      assert.notEqual(res.data.updateSetting, null);
      assert.equal(res.data.updateSetting.folders[0].folderName, folderName);
      assert.equal(res.data.updateSetting.folders[0].subscriptions[0].url, url);
      assert.equal(res.data.updateSetting.interval, '60');
    });

    it('updates settings if data found for user', async () => {
      resetDatabase();
      const folderName = 'foonews';
      const url = 'http://mynews.rss';
      const userId = Accounts.createUser({
        username: 'testuser',
        password: 'example123',
      });
      const { server } = constructTestServer({
        context: () => ({ user: { _id: userId, username: 'testuser', admin: false } }),
      });

      const setting = {
        interval: '60',
        folders: [
          {
            folderName,
            subscriptions: [
              {
                url,
              },
            ],
          },
        ],
      };

      const updateSetting = {
        interval: '30',
        folders: [
          {
            folderName,
            subscriptions: [
              {
                url,
              },
              {
                url: 'http://otherfeed.rss',
              },
            ],
          },
          {
            folderName: 'folder2',
            subscriptions: [
              {
                url: 'http://thirdfeed.rss',
              },
            ],
          },
        ],
      };

      Settings.insert({ userId, ...setting });

      const { mutate } = createTestClient(server);
      const res = await mutate({ mutation: UPDATE_SETTINGS_MUTATION, variables: { setting: updateSetting } });
      assert.notEqual(res.data.updateSetting, null);
      assert.equal(res.data.updateSetting.folders[0].folderName, folderName);
      assert.equal(res.data.updateSetting.folders[0].subscriptions[0].url, url);
      assert.equal(res.data.updateSetting.folders[0].subscriptions[1].url, 'http://otherfeed.rss');
      assert.equal(res.data.updateSetting.interval, '30');
      assert.equal(res.data.updateSetting.folders[1].folderName, 'folder2');
      assert.equal(res.data.updateSetting.folders[1].subscriptions[0].url, 'http://thirdfeed.rss');
    });
  });
}
