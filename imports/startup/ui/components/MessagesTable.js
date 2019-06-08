import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { Grid, Row, Col } from 'react-flexbox-grid';
import moment from 'moment';
import { Paper } from '@material-ui/core';
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
  mobileTable: {
    padding: 0,
  },
  parent: {
    flexDirection: 'column-reverse',
  },
  itemTop: {
    overflowY: 'auto',
    maxHeight: '46vh',
  },
});

const markAsRead = (values, markAsRead, refetch) => {
  const { messageId } = values;
  markAsRead({ variables: { messageId } })
    .then(() => {
      refetch();
    })
    .catch((error) => {
      console.log(error);
    });
};

const CustomTableCell = withStyles(() => ({
  body: {
    fontSize: 12,
  },
}))(TableCell);

const table = (messages, classes) => (
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

const mobileTable = (messages, classes) => (
  <Table classes={mobileTable}>
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

const MessagesTable = ({ classes, messages }) => {
  const [width, setWidth] = useState(window.innerWidth);

  if (width > 860) {
    return (
      <Grid fluid>
        <Row>
          <Col xs={12} sm={12} md={8} lg={8}>
            {table(messages, classes)}
          </Col>
          <Col xs={12} sm={12} md={4} lg={4}>
            <MessageView message={messages[0]} isMobile={false} />
          </Col>
        </Row>
      </Grid>
    );
  } else {
    return (
      <div className={classes.parent}>
        <div className={classes.itemTop}>
          <Paper>{mobileTable(messages, classes)}</Paper>
        </div>
        <Paper>
          <MessageView message={messages[0]} isMobile />
        </Paper>
      </div>
    );
  }
};

MessagesTable.propTypes = {
  classes: PropTypes.object.isRequired,
  messages: PropTypes.array.isRequired,
  // refetch: PropTypes.func.isRequired,
};

export default withStyles(styles)(MessagesTable);
