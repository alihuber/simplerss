import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const styles = {
  root: {
    paddingTop: 60,
  },
};

const HomePage = ({ classes }) => {
  return (
    <div className={classes.root}>
      <Typography variant="h3" gutterBottom>
        Hello World
      </Typography>
    </div>
  );
};

HomePage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(HomePage);
