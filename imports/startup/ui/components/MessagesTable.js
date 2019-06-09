import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { Paper } from '@material-ui/core';
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

const MessagesTable = ({ classes, messages }) => {
  const [width, setWidth] = useState(window.innerWidth);
  if (width > 860) {
    return (
      <Grid fluid>
        <Row>
          <Col xs={12} sm={12} md={8} lg={8}>
            <NormalTable messages={messages} classes={classes} />
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
          <Paper>
            <MobileTable messages={messages} classes={classes} />
          </Paper>
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
