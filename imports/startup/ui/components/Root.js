import React from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { ToastContainer } from 'react-toastify';
import { Query } from 'react-apollo';

import { CURRENT_USER_QUERY } from '../../../api/users/constants';
import Layout from './Layout';
import Loading from './Loading';
import Routing from './Routing';
import CurrentUserContext from '../contexts/CurrentUserContext';
import AnimContext from '../contexts/AnimContext';

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#80d6ff',
      main: '#42a5f5',
      dark: '#007c2',
      contrastText: '#fff',
    },
    secondary: {
      light: '#bfffff',
      main: '#80deea',
      dark: '#4bacb8',
      contrastText: '#000',
    },
    typography: {
      usenextvariants: true,
    },
  },
});

const Root = () => {
  const layout = Layout;
  const animClass = window.innerWidth > 860 ? 'ract-transition fade-in' : 'ract-transition swipe-right';
  return (
    <MuiThemeProvider theme={theme}>
      <Query query={CURRENT_USER_QUERY}>
        {({ data, loading }) => {
          if (loading) {
            return <Loading />;
          }
          if (data) {
            const { currentUser } = data;
            return (
              <AnimContext.Provider value={animClass}>
                <CurrentUserContext.Provider value={currentUser}>
                  <Routing LayoutComponent={layout} />
                </CurrentUserContext.Provider>
              </AnimContext.Provider>
            );
          } else {
            return null;
          }
        }}
      </Query>
      <ToastContainer autoClose={3000} />
    </MuiThemeProvider>
  );
};

export default Root;
