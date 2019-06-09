import React, { useState } from 'react';
import { StickyContainer, Sticky } from 'react-sticky';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';
import last from 'lodash/last';
import NormalTable from './NormalTable';
import MobileTable from './MobileTable';
import MessageView from './MessageView';

const styles = theme => ({
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
  fullFabDown: {
    margin: theme.spacing.unit * 2,
    position: 'fixed',
    right: 0,
    bottom: 0,
    zIndex: 100,
  },
  fullFabUp: {
    margin: theme.spacing.unit * 2,
    position: 'fixed',
    right: 0,
    bottom: 85,
    zIndex: 100,
  },
  mobileFabDown: {
    margin: theme.spacing.unit * 2,
    position: 'absolute',
    right: 0,
    top: 300,
    zIndex: 100,
  },
  mobileFabUp: {
    margin: theme.spacing.unit * 2,
    position: 'absolute',
    right: 0,
    top: 190,
    zIndex: 100,
  },
});

const MessagesTable = ({ classes, messages, refetch, markAsRead }) => {
  const [width, setWidth] = useState(window.innerWidth);
  const [selectedMessage, setSelectedMessage] = useState(last(messages));

  const markMessageAsRead = (values) => {
    const { messageId } = values;
    markAsRead({ variables: { messageId } })
      .then(() => {
        refetch();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  if (width > 860) {
    return (
      <StickyContainer>
        <div className={classes.fullParent}>
          <div className={classes.itemLeftSide} id="messagesTable">
            <NormalTable
              messages={messages}
              classes={classes}
              selectedMessageId={selectedMessage && selectedMessage._id}
              setSelectedMessage={setSelectedMessage}
              markMessageAsRead={markMessageAsRead}
            />
          </div>

          <Sticky>
            {({ style }) => {
              const styleBefore = {
                maxWidth: '40vw',
                marginLeft: 20,
                width: '40vw',
                paddingRight: 60,
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
};

export default withStyles(styles)(MessagesTable);
