import { Mongo } from 'meteor/mongo';
import gql from 'graphql-tag';

export const Messages = new Mongo.Collection('messages');

export const MESSAGES_QUERY = gql`
  query {
    messages {
      _id
    }
  }
`;
