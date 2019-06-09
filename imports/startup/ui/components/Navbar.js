import { Meteor } from 'meteor/meteor';
import React, { useContext } from 'react';
import { Query } from 'react-apollo';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import Typography from '@material-ui/core/Typography';
import PeopleIcon from '@material-ui/icons/People';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import SettingsIcon from '@material-ui/icons/Settings';
import DirectionsRunIcon from '@material-ui/icons/DirectionsRun';
import Button from '@material-ui/core/Button';
import CurrentUserContext from '../contexts/CurrentUserContext';
import LoadingContext from '../contexts/LoadingContext';
import { MESSAGE_COUNT_QUERY } from '../../../api/messages/constants';

const styles = {
  root: {
    flexGrow: 1,
  },
  flex: {
    flexGrow: 1,
    cursor: 'pointer',
  },
};

const handleLogout = (history, setLoading) => {
  setLoading(true);
  Meteor.logout(() => {
    toast.success('Logout successful!', {
      position: toast.POSITION.BOTTOM_CENTER,
    });
    history.push('/');
  });
};

const handleHome = (history, setLoading) => {
  setLoading(true);
  history.push('/');
};

const handleUsers = (history, setLoading) => {
  setLoading(true);
  history.push('/users');
};

const handleLogin = (history, setLoading) => {
  setLoading(true);
  history.push('/login');
};

const handleSettings = (history, setLoading) => {
  setLoading(true);
  history.push('/settings');
};

const handleMessages = (history, setLoading) => {
  setLoading(true);
  history.push('/messages');
};

const Navbar = (props) => {
  const { classes, history } = props;
  const { setLoading } = useContext(LoadingContext);
  return (
    <Query query={MESSAGE_COUNT_QUERY} pollInterval={60000} fetchPolicy="no-cache">
      {({ data }) => {
        const { messageCount } = data || 0;
        return (
          <div className={classes.root}>
            <AppBar position="fixed">
              <Toolbar>
                <Typography variant="h6" color="inherit" className={classes.flex} onClick={() => handleHome(history, setLoading)}>
                  Home
                </Typography>
                <CurrentUserContext.Consumer>
                  {currentUser => (
                    <React.Fragment>
                      {!currentUser || !currentUser._id ? (
                        <Button name="loginButton" color="inherit" onClick={() => handleLogin(history, setLoading)}>
                          Login
                        </Button>
                      ) : null}
                      {currentUser && currentUser.username ? (
                        <Typography>
                          User:&nbsp;
                          {currentUser.username}
                        </Typography>
                      ) : null}
                      {currentUser && currentUser.admin ? (
                        <Button size="small" name="usersButton" color="inherit" onClick={() => handleUsers(history, setLoading)}>
                          <PeopleIcon />
                        </Button>
                      ) : null}
                      {currentUser && currentUser._id ? (
                        <IconButton
                          name="messagesButton"
                          size="small"
                          color="inherit"
                          aria-label="unread messages"
                          onClick={() => handleMessages(history, setLoading)}
                        >
                          <Badge badgeContent={messageCount} color="secondary">
                            <MailOutlineIcon />
                          </Badge>
                        </IconButton>
                      ) : null}
                      {currentUser && currentUser._id ? (
                        <Button name="settingsButton" color="inherit" onClick={() => handleSettings(history, setLoading)}>
                          <SettingsIcon />
                        </Button>
                      ) : null}
                      {currentUser && currentUser._id ? (
                        <Button name="logoutButton" color="inherit" onClick={() => handleLogout(history, setLoading)}>
                          <DirectionsRunIcon />
                        </Button>
                      ) : null}
                    </React.Fragment>
                  )}
                </CurrentUserContext.Consumer>
              </Toolbar>
            </AppBar>
          </div>
        );
      }}
    </Query>
  );
};

Navbar.propTypes = {
  history: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Navbar);
