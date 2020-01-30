const uuid = require('uuid');

export const FETCH_TERRITORIES = 'FETCH_TERRITORIES';

export const SAVE_TERRITORY_REQUEST = 'SAVE_TERRITORY_REQUEST';
export const SAVE_TERRITORY_SUCCESS = 'SAVE_TERRITORY_SUCCESS';
export const SAVE_TERRITORY_FAILURE = 'SAVE_TERRITORY_FAILURE';
//
export const TERRITORY_CREATE_REQUEST = 'TERRITORY_CREATE_REQUEST';
export const TERRITORY_CREATE_SUCCESS = 'TERRITORY_CREATE_SUCCESS';
export const TERRITORY_CREATE_FAILURE = 'TERRITORY_CREATE_FAILURE';
//
export const TERRITORIES_FETCH_REQUEST = 'TERRITORIES_FETCH_REQUEST';
export const TERRITORIES_FETCH_SUCCESS = 'TERRITORIES_FETCH_SUCCESS';
export const TERRITORIES_FETCH_FAILURE = 'TERRITORIES_FETCH_FAILURE';
//
export const DELETE_TERRITORIES = 'DELETE_TERRITORIES';

import { database } from '../../services/firebase';
import * as TerritoryEffects from './effects';
import * as appErrorActions from '../appError/actions';
import AppError from '../appError/model';
import Territory from './model';

export const createTerritory = () => {
  return async (dispatch, getState) => {
    dispatch({ type: TERRITORY_CREATE_REQUEST });
    try {
      const completedRun = getState().runs.completedRun;
      if (!completedRun) console.warn('No completed run');
      const territories = getState().territories;

      // untangle completedRun polygon
      completedRun.coords = TerritoryEffects.untwistRunPoints(
        completedRun.coords
      );

      // get all overlapping territories
      const {
        userTerritories,
        nonUserTerritories
      } = TerritoryEffects.getOverlappingTerritories(completedRun, territories);

      // check if run is completely inside non-user territory
      const checkResponse = TerritoryEffects.checkRunInsideTerritory(
        completedRun,
        nonUserTerritories
      );
      if (checkResponse instanceof AppError) {
        dispatch(appErrorActions.createError(checkResponse));
        dispatch({ type: TERRITORY_CREATE_FAILURE });
        return;
      }

      // unite all user territories
      completedRun.coords = TerritoryEffects.uniteTerritories(
        completedRun,
        userTerritories
      );

      // subtract all non-user territories
      const editedTerritories = TerritoryEffects.subtractTerritories(
        completedRun,
        nonUserTerritories
      );

      // add completed run to be upated
      const newTerr = new Territory(
        completedRun.userId,
        completedRun.coords,
        Date.now()
      );
      editedTerritories[Territory.uuid()] = newTerr;

      // add old user Territories to be deleted
      userTerritories.forEach(userTer => {
        editedTerritories[userTer.id] = null;
      });

      // update territories in database
      await TerritoryEffects.editTerritories(editedTerritories);

      dispatch({ type: TERRITORY_CREATE_SUCCESS });
      dispatch(fetchTerritories());

      return;
    } catch (error) {
      console.error(error);
      dispatch({ type: TERRITORY_CREATE_FAILURE });
      throw error;
    }
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
  return async dispatch => {
    dispatch({ type: TERRITORIES_FETCH_REQUEST });

    const territories = await TerritoryEffects.fetchTerritories();
    const isError = territories instanceof AppError;
    if (isError) {
      dispatch(appErrorActions.createError(territories));
      return;
    }

    dispatch({ type: TERRITORIES_FETCH_SUCCESS, territories });
    return;
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
