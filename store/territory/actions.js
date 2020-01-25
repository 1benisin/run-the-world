export const FETCH_TERRITORIES = 'FETCH_TERRITORIES';
export const SAVE_TERRITORY_REQUEST = 'SAVE_TERRITORY_REQUEST';
export const SAVE_TERRITORY_SUCCESS = 'SAVE_TERRITORY_SUCCESS';
export const SAVE_TERRITORY_FAILURE = 'SAVE_TERRITORY_FAILURE';
//
export const TERRITORY_CREATE_REQUEST = 'TERRITORY_CREATE_REQUEST';
export const TERRITORY_CREATE_SUCCESS = 'TERRITORY_CREATE_SUCCESS';
export const TERRITORY_CREATE_FAILURE = 'TERRITORY_CREATE_FAILURE';
//
export const DELETE_TERRITORIES = 'DELETE_TERRITORIES';

import { database } from '../../services/firebase';

export const createTerritory = run => {
  return async dispatch => {
    dispatch({ type: TERRITORY_CREATE_REQUEST });

    dispatch({ type: TERRITORY_CREATE_SUCCESS });
  };
};

export const saveTerritory = (userId, coords, runIds) => {
  // Redux Thunk will inject dispatch here:
  return async dispatch => {
    // Reducers may handle this to set a flag like isFetching
    dispatch({ type: SAVE_TERRITORY_REQUEST });

    try {
      const time = Date.now();
      const newTerritory = {
        userId,
        coords,
        dateCreated: time,
        dateModified: time,
        runs: runIds
      };

      // Perform the actual API call
      const newTerrRef = await database.ref('territories').push(newTerritory);
      newTerritory.id = newTerrRef.key;

      // Reducers may handle this to show the data and reset isFetching
      dispatch({ type: SAVE_TERRITORY_SUCCESS, newTerritory });
      return newTerritory;
    } catch (error) {
      // Reducers may handle this to reset isFetching
      dispatch({ type: SAVE_TERRITORY_FAILURE, error });
      // Rethrow so returned Promise is rejected
      throw error;
    }
  };
};

export const fetchTerritories = () => {
  // expects {northEast: LatLng, southWest: LatLng}
  return async dispatch => {
    const dataSnapshot = await database.ref('territories').once('value');
    let territories = dataSnapshot.val();

    territories = territories ? territories : {};

    dispatch({ type: FETCH_TERRITORIES, territories });
  };
};

export const deleteTerritories = terrIds => {
  return async dispatch => {
    const promises = terrIds.map(async id => {
      try {
        const response = await fetch(
          `https://run-the-world-v1.firebaseio.com/territories/${id}.json`,
          {
            method: 'DELETE'
          }
        );

        if (!response.ok) {
          throw new Error('Something went wrong with deleteTerritories action');
        }

        return id;
      } catch (error) {
        console.log(error);
      }
    });

    const deleteResults = await Promise.all(promises);
    dispatch({ type: DELETE_TERRITORIES, deleteResults });
    return deleteResults;
  };
};
