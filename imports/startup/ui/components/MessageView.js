import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import moment from 'moment';

const styles = () => ({
  content: {
    fontFamily: 'Helvetica',
  },
});

const MessageView = ({ classes, message, isMobile }) => {
  if (isMobile) {
    return (
      <>
        <Typography variant="h5" gutterBottom>
          {message.title}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          From:
          {' '}
          {message.creator}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Date:
          {' '}
          {moment(message.pubDate).format('DD.MM.YYYY HH:mm')}
        </Typography>
        <Typography variant="body1">
          <div dangerouslySetInnerHTML={{ __html: message.content }} />
        </Typography>
      </>
    );
  } else {
    return (
      <>
        <Typography variant="h4" gutterBottom>
          {message.title}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          From:
          {' '}
          {message.creator}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Date:
          {' '}
          {moment(message.pubDate).format('DD.MM.YYYY HH:mm')}
        </Typography>
        <Typography variant="body1">
          <div dangerouslySetInnerHTML={{ __html: message.content }} />
        </Typography>
      </>
    );
  }
};

MessageView.propTypes = {
  message: PropTypes.object.isRequired,
  isMobile: PropTypes.bool.isRequired,
};

export default withStyles(styles)(MessageView);
