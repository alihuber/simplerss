import { Meteor } from 'meteor/meteor';
import React from 'react';
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

const handleLogout = (history) => {
  Meteor.logout(() => {
    toast.success('Logout successful!', {
      position: toast.POSITION.BOTTOM_CENTER,
    });
    history.push('/');
  });
};

const handleHome = (history) => {
  history.push('/');
};

const handleUsers = (history) => {
  history.push('/users');
};

const handleLogin = (history) => {
  history.push('/login');
};

const handleSettings = (history) => {
  history.push('/settings');
};

const handleMessages = (history) => {
  history.push('/messages');
};

const Navbar = (props) => {
  const { classes, history } = props;
  return (
    <Query query={MESSAGE_COUNT_QUERY} pollInterval={2000} fetchPolicy="no-cache">
      {({ data }) => {
        const { messageCount } = data || 0;
        return (
          <div className={classes.root}>
            <AppBar position="fixed">
              <Toolbar>
                <Typography variant="h6" color="inherit" className={classes.flex} onClick={() => handleHome(history)}>
                  Home
                </Typography>
                <CurrentUserContext.Consumer>
                  {currentUser => (
                    <React.Fragment>
                      {!currentUser || !currentUser._id ? (
                        <Button name="loginButton" color="inherit" onClick={() => handleLogin(history)}>
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
                        <Button size="small" name="usersButton" color="inherit" onClick={() => handleUsers(history)}>
                          <PeopleIcon />
                        </Button>
                      ) : null}
                      {currentUser && currentUser._id ? (
                        <IconButton
                          name="messagesButton"
                          size="small"
                          color="inherit"
                          aria-label="unread messages"
                          onClick={() => handleMessages(history)}
                        >
                          <Badge badgeContent={messageCount} max={999} color="secondary">
                            <MailOutlineIcon />
                          </Badge>
                        </IconButton>
                      ) : null}
                      {currentUser && currentUser._id ? (
                        <IconButton
                          size="small"
                          aria-label="settings"
                          name="settingsButton"
                          color="inherit"
                          onClick={() => handleSettings(history)}
                        >
                          <SettingsIcon />
                        </IconButton>
                      ) : null}
                      {currentUser && currentUser._id ? (
                        <IconButton
                          size="small"
                          aria-label="logout"
                          name="logoutButton"
                          color="inherit"
                          onClick={() => handleLogout(history)}
                        >
                          <DirectionsRunIcon />
                        </IconButton>
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
