import { Mongo } from 'meteor/mongo';
import gql from 'graphql-tag';

export const Messages = new Mongo.Collection('messages');

export const MESSAGE_COUNT_QUERY = gql`
  query {
    messageCount
  }
`;

export const MESSAGES_QUERY = gql`
  query {
    messages {
      _id
      folder
      isRead
      isMarkedRead
      creator
      title
      link
      pubDate
      content
      contentSnippet
      guid
    }
  }
`;

export const MARK_AS_READ_MUTATION = gql`
  mutation markAsRead($messageId: String!) {
    markAsRead(messageId: $messageId) {
      _id
      __typename
      folder
      isRead
      isMarkedRead
      creator
      title
      link
      pubDate
      content
      contentSnippet
      guid
    }
  }
`;

export const MARK_ALL_AS_READ_MUTATION = gql`
  mutation markAllAsRead {
    markAllAsRead
  }
`;
