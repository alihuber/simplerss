import React from 'react';
import { unstable_useMediaQuery as useMediaQuery } from '@material-ui/core/useMediaQuery';
import PropTypes from 'prop-types';
import CssBaseline from '@material-ui/core/CssBaseline';
import { withStyles } from '@material-ui/core/styles';
import Navbar from './Navbar.js';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  content: {
    padding: theme.spacing.unit * 5,
  },
  mobileContent: {
    paddingTop: theme.spacing.unit * 5,
    paddingLeft: 5,
    paddingRight: 5,
  },
});

const Layout = ({ children, classes }) => {
  const matches = useMediaQuery('(min-width:600px)');
  return (
    <div>
      <Navbar />
      <div className={classes.root}>
        <CssBaseline />
        {matches ? <div className={classes.content}>{children}</div> : <div className={classes.mobileContent}>{children}</div>}
      </div>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Layout);
