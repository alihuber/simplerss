import React, { useContext } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Query, Mutation } from 'react-apollo';
import CurrentUserContext from '../contexts/CurrentUserContext';
import LoadingContext from '../contexts/LoadingContext';
import { MESSAGES_QUERY, MARK_AS_READ_MUTATION } from '../../../api/messages/constants';
import MessagesTable from './MessagesTable';

const Messages = () => {
  const { loading, setLoading } = useContext(LoadingContext);
  if (loading) {
    setLoading(false);
  }

  return (
    <>
      <CurrentUserContext.Consumer>
        {currentUser => (currentUser ? (
          <>
            <Query query={MESSAGES_QUERY}>
              {({ data, refetch }) => {
                if (data && data.messages) {
                  const { messages } = data;
                  return (
                    <Mutation mutation={MARK_AS_READ_MUTATION}>
                      {(markAsRead) => {
                        return <MessagesTable messages={messages} markAsRead={markAsRead} refetch={refetch} />;
                      }}
                    </Mutation>
                  );
                } else {
                  return <CircularProgress />;
                }
              }}
            </Query>
          </>
        ) : null)
        }
      </CurrentUserContext.Consumer>
    </>
  );
};

export default Messages;
