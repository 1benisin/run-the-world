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
      if (!completedRun.isValidTerritory) {
        dispatch({ type: TERRITORY_CREATE_FAILURE });
        return;
      }
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

      // create new territory from completed
      const newTerr = new Territory(
        completedRun.userId,
        completedRun.coords,
        Date.now()
      );
      newTerr.id = Territory.uuid();

      // add old Territories to be deleted
      let updatedTerritories = TerritoryEffects.convertTerritoriesToRegions(
        [...userTerritories, ...nonUserTerritories],
        {},
        true
      );

      // add new Territories to be created
      updatedTerritories = TerritoryEffects.convertTerritoriesToRegions(
        [...editedTerritories, newTerr],
        updatedTerritories
      );

      // update territories in database
      await TerritoryEffects.updateDBTerritories(updatedTerritories);

      dispatch({ type: TERRITORY_CREATE_SUCCESS });
      dispatch(fetchTerritories(completedRun.coords[0]));

      return;
    } catch (error) {
      console.error(error);
      dispatch({ type: TERRITORY_CREATE_FAILURE });
      throw error;
    }
  };
};

export const fetchTerritories = coords => {
  return async dispatch => {
    dispatch({ type: TERRITORIES_FETCH_REQUEST });

    const territories = await TerritoryEffects.fetchTerritoriesByCoords(coords);
    const isError = territories instanceof AppError;
    if (isError) {
      dispatch(appErrorActions.createError(territories));
      return;
    }

    dispatch({ type: TERRITORIES_FETCH_SUCCESS, territories });
    return;
  };
};
