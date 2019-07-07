import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Query, Mutation } from 'react-apollo';
import { toast } from 'react-toastify';
import AutoForm from 'uniforms-material/AutoForm';
import SimpleSchema from 'simpl-schema';
import CurrentUserContext from '../contexts/CurrentUserContext';
import { SETTINGS_QUERY, UPDATE_SETTINGS_MUTATION } from '../../../api/settings/constants';

const subscriptionSchema = new SimpleSchema({
  url: {
    type: String,
    required: true,
  },
});

const styles = {
  root: {
    paddingTop: 60,
  },
};

const settingsSchema = new SimpleSchema({
  interval: {
    type: String,
    defaultValue: '60',
    allowedValues: ['1', '2', '10', '15', '30', '45', '60', '120'],
  },
  folders: {
    type: Array,
  },
  'folders.$': { type: Object },
  'folders.$.folderName': { type: String },
  'folders.$.subscriptions': { type: Array },
  'folders.$.subscriptions.$': { type: subscriptionSchema },
});

const handleSubmit = (values, updateSettings, refetch) => {
  const cleaned = settingsSchema.clean(values);
  const { interval, folders } = cleaned;
  updateSettings({ variables: { setting: { interval, folders } } })
    .then(() => {
      refetch();
      toast.success('Update successful!', {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    })
    .catch((error) => {
      console.log(error);
      toast.error('Update error!', {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    });
};

const Settings = ({ classes }) => {
  return (
    <div className={classes.root}>
      <Typography variant="h3" gutterBottom>
        Settings
      </Typography>
      <CurrentUserContext.Consumer>
        {currentUser => (currentUser ? (
          <>
            <Query query={SETTINGS_QUERY}>
              {({ data, refetch }) => {
                if (data && data.settings) {
                  const { settings } = data;
                  return (
                    <Mutation mutation={UPDATE_SETTINGS_MUTATION}>
                      {(updateSettings) => {
                        const editSettingsForm = ({ model }) => (
                          <AutoForm schema={settingsSchema} onSubmit={doc => handleSubmit(doc, updateSettings, refetch)} model={model} />
                        );
                        editSettingsForm.propTypes = {
                          model: PropTypes.object.isRequired,
                        };
                        const model = {};
                        model.interval = settings.interval || '60';
                        model.folders = settings.folders || [];
                        return editSettingsForm({ model });
                      }}
                    </Mutation>
                  );
                } else {
                  return <CircularProgress />;
                }
              }}
            </Query>
          </>
        ) : null)
        }
      </CurrentUserContext.Consumer>
    </div>
  );
};

Settings.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Settings);
