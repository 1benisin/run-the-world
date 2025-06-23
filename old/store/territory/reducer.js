import {
  FETCH_TERRITORIES,
  SAVE_TERRITORY_SUCCESS,
  DELETE_TERRITORIES,
  TERRITORY_CREATE_REQUEST,
  TERRITORY_CREATE_SUCCESS,
  TERRITORY_CREATE_FAILURE,
  TERRITORIES_FETCH_REQUEST,
  TERRITORIES_FETCH_SUCCESS
} from '../territory/actions';
import Territory from '../../models/territory';
import * as testData from '../../fake-data/fake-data';

const initialState = [];

export default (state = initialState, action) => {
  switch (action.type) {
    //
    case TERRITORIES_FETCH_SUCCESS:
      return [...action.territories];

    case SAVE_TERRITORY_SUCCESS:
      const newTer = new Territory(
        action.newTerritory.id,
        action.newTerritory.userId,
        action.newTerritory.coords,
        action.newTerritory.dateCreated,
        action.newTerritory.dateModified,
        action.newTerritory.runs
      );
      return [...state, newTer];

    case FETCH_TERRITORIES:
      if (!Object.keys(action.territories).length) return state;
      const newTerrs = Object.keys(action.territories).map(key => {
        const terr = action.territories[key];
        return new Territory(
          key,
          terr.userId,
          terr.coords,
          terr.dateCreated,
          terr.dateModified,
          terr.runs
        );
      });
      return [...state, ...newTerrs];

    case DELETE_TERRITORIES:
      const newState = state.filter(
        ter => !action.deleteResults.includes(ter.id)
      );
      return [...newState];

    default:
      return state;
  }
};
