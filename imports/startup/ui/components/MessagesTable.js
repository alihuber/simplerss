import React, { useState } from 'react';
import { StickyContainer, Sticky } from 'react-sticky';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Paper, Typography } from '@material-ui/core';
import last from 'lodash/last';
import NormalTable from './NormalTable';
import MobileTable from './MobileTable';
import MessageView from './MessageView';

const styles = theme => ({
  navPadding: {
    paddingTop: 60,
  },
  root: {
    width: '100%',
    overflowX: 'auto',
  },
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  },
  selectedRow: {
    backgroundColor: 'beige',
  },
  mobileTable: {
    padding: 0,
  },
  parent: {
    flexDirection: 'column-reverse',
  },
  fullParent: {
    display: 'flex',
    flexDirection: 'row',
  },
  itemTop: {
    overflowY: 'auto',
    maxHeight: '60vh',
  },
  itemLeftSide: {
    overflowY: 'auto',
    maxWidth: '60vw',
  },
  itemRightSide: {
    maxWidth: '40vw',
    marginLeft: 20,
  },
  fullFabAll: {
    margin: theme.spacing.unit * 2,
    position: 'fixed',
    right: 0,
    bottom: 170,
    zIndex: 100,
  },
  fullFabUp: {
    margin: theme.spacing.unit * 2,
    position: 'fixed',
    right: 0,
    bottom: 85,
    zIndex: 100,
  },
  fullFabDown: {
    margin: theme.spacing.unit * 2,
    position: 'fixed',
    right: 0,
    bottom: 0,
    zIndex: 100,
  },
  mobileFabAll: {
    margin: theme.spacing.unit * 2,
    position: 'absolute',
    right: 0,
    top: 100,
    zIndex: 100,
  },
  mobileFabUp: {
    margin: theme.spacing.unit * 2,
    position: 'absolute',
    right: 0,
    top: 210,
    zIndex: 100,
  },
  mobileFabDown: {
    margin: theme.spacing.unit * 2,
    position: 'absolute',
    right: 0,
    top: 320,
    zIndex: 100,
  },
});

const MessagesTable = ({ classes, messages, refetch, markAsRead, markAllAsRead }) => {
  const [width, setWidth] = useState(window.innerWidth);
  const unreadMessages = messages && messages.filter(m => !m.isMarkedRead);
  let msgs;
  if (unreadMessages.length !== 0) {
    msgs = unreadMessages;
  } else {
    msgs = messages;
  }
  const [selectedMessage, setSelectedMessage] = useState(last(msgs));

  const markMessageAsRead = (values) => {
    const { messageId } = values;
    markAsRead({
      variables: { messageId },
      optimisticResponse: {
        __typename: 'Mutation',
        markAsRead: {
          _id: messageId,
          __typename: 'Message',
          isMarkedRead: true,
        },
      },
    })
      .then(() => {
        refetch();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const markAllMessagesAsRead = () => {
    markAllAsRead()
      .then(() => {
        refetch();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  if (messages.length === 0) {
    return (
      <div className={classes.navPadding}>
        <Typography variant="body1">no messages yet</Typography>
      </div>
    );
  }

  if (width > 860) {
    return (
      <div className={classes.navPadding}>
        <StickyContainer>
          <div className={classes.fullParent}>
            <div className={classes.itemLeftSide} id="messagesTable">
              <NormalTable
                messages={messages}
                classes={classes}
                selectedMessageId={selectedMessage && selectedMessage._id}
                setSelectedMessage={setSelectedMessage}
                markMessageAsRead={markMessageAsRead}
                markAllMessagesAsRead={markAllMessagesAsRead}
              />
            </div>

            <Sticky>
              {({ style }) => {
                const styleBefore = {
                  maxWidth: '40vw',
                  marginLeft: 20,
                  width: '40vw',
                  paddingRight: 60,
                  top: 70,
                };
                const mergedStyle = { ...style, ...styleBefore };
                return (
                  <div className={classes.itemRightSide} style={mergedStyle}>
                    <MessageView message={selectedMessage} isMobile={false} />
                  </div>
                );
              }}
            </Sticky>
          </div>
        </StickyContainer>
      </div>
    );
  } else {
    return (
      <div className={classes.parent}>
        <div className={classes.itemTop} id="messagesTable">
          <Paper>
            <MobileTable
              messages={messages}
              classes={classes}
              selectedMessageId={selectedMessage._id}
              setSelectedMessage={setSelectedMessage}
              markMessageAsRead={markMessageAsRead}
              markAllMessagesAsRead={markAllMessagesAsRead}
            />
          </Paper>
        </div>
        <Paper>
          <MessageView message={selectedMessage} isMobile />
        </Paper>
      </div>
    );
  }
};

MessagesTable.propTypes = {
  classes: PropTypes.object.isRequired,
  messages: PropTypes.array.isRequired,
  refetch: PropTypes.func.isRequired,
  markAsRead: PropTypes.func.isRequired,
  markAllAsRead: PropTypes.func.isRequired,
};

export default withStyles(styles)(MessagesTable);
