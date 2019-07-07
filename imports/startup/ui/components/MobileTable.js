import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Fab from '@material-ui/core/Fab';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import CheckIcon from '@material-ui/icons/Check';
import moment from 'moment';
import { scroller } from 'react-scroll';
import throttle from 'lodash/throttle';

const CustomTableCell = withStyles(() => ({
  body: {
    fontSize: 12,
  },
}))(TableCell);

const handleMessageSelect = (message, setSelectedMessage, markMessageAsRead) => {
  setSelectedMessage(message);
  markMessageAsRead({ messageId: message._id });
};

const handleDownClick = (selectedMessageId, messages, setSelectedMessage, markMessageAsRead) => {
  const currIdx = messages.findIndex(m => m._id === selectedMessageId);
  const nextMessage = messages[currIdx + 1];
  if (nextMessage) {
    setSelectedMessage(nextMessage);
    markMessageAsRead({ messageId: selectedMessageId });
  }
};

const handleUpClick = (selectedMessageId, messages, setSelectedMessage, markMessageAsRead) => {
  const currIdx = messages.findIndex(m => m._id === selectedMessageId);
  const nextMessage = messages[currIdx - 1];
  if (nextMessage) {
    setSelectedMessage(nextMessage);
    markMessageAsRead({ messageId: selectedMessageId });
  }
};

const handleMarkAllClick = (markAllMessagesAsRead) => {
  markAllMessagesAsRead();
};

const MobileTable = ({ messages, classes, selectedMessageId, setSelectedMessage, markMessageAsRead, markAllMessagesAsRead }) => {
  const scrollToMsg = () => {
    scroller.scrollTo('scrollToRow', {
      duration: 500,
      delay: 100,
      smooth: true,
      containerId: 'messagesTable',
      offset: -250, // Scrolls to element + 50 pixels down the page
    });
  };
  const throttledScroll = useRef(throttle(scrollToMsg, 1000, { trailng: true }));
  useEffect(() => throttledScroll.current());

  return (
    <>
      <Table>
        <TableBody>
          {messages.map((message) => {
            if (message._id === selectedMessageId) {
              return (
                <TableRow
                  className={classes.selectedRow}
                  name="scrollToRow"
                  key={message._id}
                  onClick={() => handleMessageSelect(message, setSelectedMessage, markMessageAsRead)}
                >
                  <CustomTableCell>{message.title}</CustomTableCell>
                  <CustomTableCell>{moment(message.pubDate).format('DD.MM.YYYY HH:mm')}</CustomTableCell>
                </TableRow>
              );
            } else if (message.isMarkedRead) {
              return (
                <TableRow
                  className={classes.row}
                  key={message._id}
                  onClick={() => handleMessageSelect(message, setSelectedMessage, markMessageAsRead)}
                >
                  <CustomTableCell>{message.title}</CustomTableCell>
                  <CustomTableCell>{moment(message.pubDate).format('DD.MM.YYYY HH:mm')}</CustomTableCell>
                </TableRow>
              );
            } else {
              return (
                <TableRow
                  className={classes.row}
                  key={message._id}
                  onClick={() => handleMessageSelect(message, setSelectedMessage, markMessageAsRead)}
                >
                  <CustomTableCell>
                    <b>{message.title}</b>
                  </CustomTableCell>
                  <CustomTableCell>
                    <b>{moment(message.pubDate).format('DD.MM.YYYY HH:mm')}</b>
                  </CustomTableCell>
                </TableRow>
              );
            }
          })}
        </TableBody>
      </Table>
      <Fab color="primary" aria-label="All" className={classes.mobileFabAll} onClick={() => handleMarkAllClick(markAllMessagesAsRead)}>
        <CheckIcon />
      </Fab>
      <Fab
        color="primary"
        aria-label="Up"
        size="large"
        className={classes.mobileFabUp}
        onClick={() => handleUpClick(selectedMessageId, messages, setSelectedMessage, markMessageAsRead)}
      >
        <ArrowUpwardIcon />
      </Fab>
      <Fab
        color="primary"
        size="large"
        aria-label="Down"
        className={classes.mobileFabDown}
        onClick={() => handleDownClick(selectedMessageId, messages, setSelectedMessage, markMessageAsRead)}
      >
        <ArrowDownwardIcon />
      </Fab>
    </>
  );
};

MobileTable.propTypes = {
  classes: PropTypes.object.isRequired,
  messages: PropTypes.array.isRequired,
  selectedMessageId: PropTypes.string,
  setSelectedMessage: PropTypes.func.isRequired,
  markMessageAsRead: PropTypes.func.isRequired,
  markAllMessagesAsRead: PropTypes.func.isRequired,
};

export default MobileTable;
