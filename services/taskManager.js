import * as TaskManager from 'expo-task-manager';

import store from '../store/store';
import * as runActions from '../store/run/actions';

export default () => {
  console.log('TaskManager GET_LOCATION_IN_BACKGROUND task defined');

  TaskManager.defineTask('GET_LOCATION_IN_BACKGROUND', ({ data, error }) => {
    if (error) {
      // Error occurred - check `error.message` for more details.
      console.warn(error);
      return;
    }
    if (data) {
      const { latitude, longitude } = data.locations[0].coords;
      if (latitude && longitude)
        store.dispatch(runActions.addCoord({ latitude, longitude }));
    }
  });
};
