import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import moment from 'moment';
import { scroller } from 'react-scroll';

const CustomTableCell = withStyles(() => ({
  body: {
    fontSize: 12,
  },
}))(TableCell);

const NormalTable = ({ messages, classes, selectedMessageId, style }) => {
  useEffect(() => {
    scroller.scrollTo('scrollToRow', {
      duration: 1500,
      delay: 100,
      smooth: true,
      // containerId: 'messagesTable',
      offset: 50, // Scrolls to element + 50 pixels down the page
    });
  });

  return (
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
              <TableRow className={classes.row} key={message._id}>
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
  );
};

NormalTable.propTypes = {
  classes: PropTypes.object.isRequired,
  messages: PropTypes.array.isRequired,
  selectedMessageId: PropTypes.string,
  // refetch: PropTypes.func.isRequired,
};

export default NormalTable;
