export const FETCH_TERRITORIES = 'FETCH_TERRITORIES';
export const SAVE_TERRITORY_REQUEST = 'SAVE_TERRITORY_REQUEST';
export const SAVE_TERRITORY_SUCCESS = 'SAVE_TERRITORY_SUCCESS';
export const SAVE_TERRITORY_FAILURE = 'SAVE_TERRITORY_FAILURE';
export const DELETE_TERRITORIES = 'DELETE_TERRITORIES';

import { database } from '../../services/firebase';

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
    let territories = await fetchTerritoriesFromDB();
    territories = territories ? territories : {};

    dispatch({ type: FETCH_TERRITORIES, territories });
  };
};

export const fetchTerritoriesInBounds = region => {
  // expects {northEast: LatLng, southWest: LatLng}
  return async dispatch => {
    const resData = await fetchTerritoriesFromDB();
    const mapBounds = {
      north: region.latitude + region.latitudeDelta / 2,
      south: region.latitude - region.latitudeDelta / 2,
      east: region.longitude + region.longitudeDelta / 2,
      west: region.longitude - region.longitudeDelta / 2
    };

    const terrsWithinBounds =
      resData === null
        ? {}
        : Object.keys(resData).reduce((acc, key) => {
            for (let i = 0; i < resData[key].coords.length; i++) {
              const c = resData[key].coords[i];
              if (
                c.latitude < mapBounds.north &&
                c.latitude > mapBounds.south &&
                c.longitude > mapBounds.west &&
                c.longitude < mapBounds.east
              ) {
                acc.push(resData[key]);
                break;
              }
            }

            return acc;
          }, []);

    dispatch({ type: FETCH_TERRITORIES, territories: terrsWithinBounds });
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

const deletTerritoryFromDB = async terId => {
  try {
    return await fetch(
      `https://run-the-world-v1.firebaseio.com/territories/${terId}.json`,
      {
        method: 'DELETE'
      }
    );
  } catch (error) {
    console.log(error);
  }
};

const fetchTerritoriesFromDB = async () => {
  try {
    const response = await fetch(
      'https://run-the-world-v1.firebaseio.com/territories.json'
    );

    if (!response.ok) {
      throw new Error('Something went wrong with fetchTerritory action');
    }

    return await response.json();
  } catch (error) {
    console.log(error);
  }
};
