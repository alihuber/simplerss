import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Fab from '@material-ui/core/Fab';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import moment from 'moment';
import { scroller } from 'react-scroll';

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
  setSelectedMessage(nextMessage);
  markMessageAsRead({ messageId: selectedMessageId });
};

const handleUpClick = (selectedMessageId, messages, setSelectedMessage, markMessageAsRead) => {
  const currIdx = messages.findIndex(m => m._id === selectedMessageId);
  const nextMessage = messages[currIdx - 1];
  setSelectedMessage(nextMessage);
  markMessageAsRead({ messageId: selectedMessageId });
};

const NormalTable = ({ messages, classes, selectedMessageId, setSelectedMessage, markMessageAsRead }) => {
  useEffect(() => {
    scroller.scrollTo('scrollToRow', {
      duration: 1500,
      delay: 100,
      smooth: true,
      offset: -500, // Scrolls to element + 50 pixels down the page
    });
  });

  return (
    <>
      <Table>
        <TableBody>
          {messages.map((message) => {
            if (message._id === selectedMessageId) {
              return (
                <TableRow className={classes.selectedRow} key={message._id} name="scrollToRow">
                  <CustomTableCell>{message.title}</CustomTableCell>
                  <CustomTableCell>{moment(message.pubDate).format('DD.MM.YYYY HH:mm')}</CustomTableCell>
                  <CustomTableCell>{message.creator}</CustomTableCell>
                </TableRow>
              );
            } else if (message.isMarkedRead) {
              return (
                <TableRow className={classes.row} key={message._id}>
                  <CustomTableCell>{message.title}</CustomTableCell>
                  <CustomTableCell>{moment(message.pubDate).format('DD.MM.YYYY HH:mm')}</CustomTableCell>
                  <CustomTableCell>{message.creator}</CustomTableCell>
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
                  <CustomTableCell>
                    <b>{message.creator}</b>
                  </CustomTableCell>
                </TableRow>
              );
            }
          })}
        </TableBody>
      </Table>
      <Fab
        color="primary"
        aria-label="Add"
        className={classes.fullFabUp}
        onClick={() => handleUpClick(selectedMessageId, messages, setSelectedMessage, markMessageAsRead)}
      >
        <ArrowUpwardIcon />
      </Fab>
      <Fab
        color="primary"
        aria-label="Add"
        className={classes.fullFabDown}
        onClick={() => handleDownClick(selectedMessageId, messages, setSelectedMessage, markMessageAsRead)}
      >
        <ArrowDownwardIcon />
      </Fab>
    </>
  );
};

NormalTable.propTypes = {
  classes: PropTypes.object.isRequired,
  messages: PropTypes.array.isRequired,
  selectedMessageId: PropTypes.string,
  setSelectedMessage: PropTypes.func.isRequired,
  markMessageAsRead: PropTypes.func.isRequired,
};

export default NormalTable;
