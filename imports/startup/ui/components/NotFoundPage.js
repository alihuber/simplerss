import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AnimContext from '../contexts/AnimContext';

const styles = {
  root: {
    paddingTop: 60,
  },
};

const NotFoundPage = ({ classes }) => {
  const animClass = useContext(AnimContext);
  return (
    <div className={animClass}>
      <div className={classes.root}>
        <Typography variant="h3" gutterBottom>
          404 - Not found
        </Typography>
      </div>
    </div>
  );
};

NotFoundPage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NotFoundPage);
