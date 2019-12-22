export const FETCH_TERRITORIES = 'FETCH_TERRITORIES';
export const SAVE_TERRITORY_REQUEST = 'SAVE_TERRITORY_REQUEST';
export const SAVE_TERRITORY_SUCCESS = 'SAVE_TERRITORY_SUCCESS';
export const SAVE_TERRITORY_FAILURE = 'SAVE_TERRITORY_FAILURE';

export const saveTerritory = (userId, coords, runIds) => {
  // Redux Thunk will inject dispatch here:
  return async dispatch => {
    // Reducers may handle this to set a flag like isFetching
    dispatch({ type: SAVE_TERRITORY_REQUEST });

    try {
      // Perform the actual API call
      const time = Date.now();
      const newTerritory = {
        userId,
        coords,
        dateCreated: time,
        dateModified: time,
        runs: runIds
      };
      const response = await fetch(
        'https://run-the-world-v1.firebaseio.com/runs.json',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newTerritory)
        }
      );

      if (!response.ok) {
        throw new Error('Something went wrong with saveRun action');
      }

      const resData = await response.json();
      newTerritory.id = resData.name;
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

export const newTerritory = (userId, coords, runIds) => {
  return async (dispatch, getState) => {
    const time = Date.now();
    const territoryToAdd = {
      userId: userId,
      coords: coords,
      dateCreated: time,
      dateModified: time,
      runs: runIds
    };

    let resData;
    try {
      const response = await fetch(
        'https://run-the-world-v1.firebaseio.com/territories.json',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(territoryToAdd)
        }
      );
      if (!response.ok) {
        throw new Error('Something went wrong with newTerritory action');
      }
      resData = await response.json();
    } catch (error) {
      console.log(error);
    }

    territoryToAdd.id = resData.name;

    dispatch({ type: NEW_TERRITORY, territoryToAdd: territoryToAdd });
  };
};

export const fetchTerritories = region => {
  // expects {northEast: LatLng, southWest: LatLng}
  return async dispatch => {
    const resData = await fetchTerritoriesFromDB();
    console.log('resData', resData);
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
