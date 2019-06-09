import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import moment from 'moment';

const CustomTableCell = withStyles(() => ({
  body: {
    fontSize: 12,
  },
}))(TableCell);

const NormalTable = ({ messages, classes }) => (
  <Table>
    <TableBody>
      {messages.map((message) => {
        return (
          <>
            {message.isMarkedRead ? (
              <TableRow className={classes.row} key={message._id}>
                <CustomTableCell>{message.title}</CustomTableCell>
                <CustomTableCell>{moment(message.pubDate).format('DD.MM.YYYY HH:mm')}</CustomTableCell>
                <CustomTableCell>{message.creator}</CustomTableCell>
              </TableRow>
            ) : (
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
            )}
          </>
        );
      })}
    </TableBody>
  </Table>
);

NormalTable.propTypes = {
  classes: PropTypes.object.isRequired,
  messages: PropTypes.array.isRequired,
  // refetch: PropTypes.func.isRequired,
};

export default NormalTable;
