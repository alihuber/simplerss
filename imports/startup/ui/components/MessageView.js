/* eslint-disable react/jsx-no-target-blank */
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import moment from 'moment';
import { link } from 'fs';

const styles = () => ({
  content: {
    fontFamily: 'Helvetica',
  },
});

const MessageView = ({ classes, message, isMobile }) => {
  if (message) {
    if (isMobile) {
      return (
        <>
          <Typography variant="h5" gutterBottom>
            <a href={message.link} target="_blank">
              {message.title}
            </a>
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
          <div className={classes.content} dangerouslySetInnerHTML={{ __html: message.content }} />
        </>
      );
    } else {
      return (
        <>
          <Typography variant="h4" gutterBottom>
            <a href={message.link} target="_blank">
              {message.title}
            </a>
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
          <div className={classes.content} dangerouslySetInnerHTML={{ __html: message.content }} />
        </>
      );
    }
  } else {
    return null;
  }
};

MessageView.propTypes = {
  message: PropTypes.object,
  isMobile: PropTypes.bool.isRequired,
};

export default withStyles(styles)(MessageView);
