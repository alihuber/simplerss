import React from 'react';
import { Query, Mutation } from 'react-apollo';
import CurrentUserContext from '../contexts/CurrentUserContext';
import { MESSAGES_QUERY, MARK_AS_READ_MUTATION, MARK_ALL_AS_READ_MUTATION } from '../../../api/messages/constants';
import MessagesTable from './MessagesTable';
import Loading from './Loading';

const Messages = () => {
  return (
    <CurrentUserContext.Consumer>
      {currentUser => (currentUser ? (
        <>
          <Query query={MESSAGES_QUERY}>
            {({ data, loading, refetch }) => {
              if (loading) {
                return <Loading />;
              }
              if (data && data.messages) {
                const { messages } = data;
                return (
                  <Mutation mutation={MARK_ALL_AS_READ_MUTATION}>
                    {(markAllAsRead) => {
                      return (
                        <Mutation mutation={MARK_AS_READ_MUTATION}>
                          {(markAsRead) => {
                            return (
                              <MessagesTable
                                messages={messages}
                                markAllAsRead={markAllAsRead}
                                markAsRead={markAsRead}
                                refetch={refetch}
                              />
                            );
                          }}
                        </Mutation>
                      );
                    }}
                  </Mutation>
                );
              } else {
                return <Loading />;
              }
            }}
          </Query>
        </>
      ) : null)
      }
    </CurrentUserContext.Consumer>
  );
};

export default Messages;
