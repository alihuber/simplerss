import { Meteor } from 'meteor/meteor';
import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import AutoForm from 'uniforms-material/AutoForm';
import TextField from 'uniforms-material/TextField';
import ErrorField from 'uniforms-material/ErrorField';
import SubmitField from 'uniforms-material/SubmitField';
import { toast } from 'react-toastify';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Row, Col } from 'react-flexbox-grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import SimpleSchema from 'simpl-schema';
import AnimContext from '../contexts/AnimContext';

const styles = theme => ({
  button: {
    marginTop: 2 * theme.spacing.unit,
  },
  buttonContainer: {
    textAlign: 'left',
  },
  root: {
    paddingTop: 120,
  },
  control: {
    padding: theme.spacing.unit * 2,
    width: '100%',
  },
  paper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
});

const loginSchema = new SimpleSchema({
  username: {
    type: String,
    min: 3,
  },
  password: {
    type: String,
    min: 8,
  },
});

const handleHome = history => {
  history.push('/');
};

const handleSubmit = (values, history) => {
  if (values.username && values.password) {
    Meteor.loginWithPassword(values.username, values.password, err => {
      if (err) {
        console.log(err);
        toast.error('Login error!', {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      } else {
        toast.success('Login successful!', {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        handleHome(history);
      }
    });
  }
};

const Login = ({ classes }) => {
  const animClass = useContext(AnimContext);
  const history = useHistory();
  return (
    <div className={animClass}>
      <Grid fluid className={classes.root}>
        <Row center="xs">
          <Col xs={12} sm={12} md={6} lg={6}>
            <Paper className={classes.paper}>
              <AutoForm schema={loginSchema} onSubmit={doc => handleSubmit(doc, history)}>
                <Typography variant="h3" gutterBottom>
                  Login
                </Typography>
                <TextField name="username" />
                <ErrorField name="username" />
                <TextField type="password" name="password" />
                <ErrorField name="password" />
                <div className={classes.buttonContainer}>
                  <SubmitField type="submit" variant="contained" color="primary" onClick={handleSubmit} className={classes.button}>
                    Login
                  </SubmitField>
                </div>
              </AutoForm>
            </Paper>
          </Col>
        </Row>
      </Grid>
    </div>
  );
};

Login.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Login);
