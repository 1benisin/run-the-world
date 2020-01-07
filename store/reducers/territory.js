import {
  FETCH_TERRITORIES,
  SAVE_TERRITORY_SUCCESS,
  DELETE_TERRITORIES
} from '../actions/territory';
import Territory from '../../models/territory';
import * as testData from '../../fake-data/fake-data';

const initialState = [
  {
    id: '-LwQXgfP8s3ZPuxOQgNW',
    coords: [
      [47.607861110364084, -122.34542939811946],
      [47.60532845743632, -122.34653681516646],
      [47.60532845743632, -122.34918077646614],
      [47.60436952559971, -122.34981682151556],
      [47.60532845743632, -122.35024223879897],
      [47.60532845743632, -122.35293958336115],
      [47.60690086867129, -122.35278200358152],
      [47.60722095119431, -122.35108181834222],
      [47.60532845743632, -122.35024223879897],
      [47.60532845743632, -122.34918077646614],
      [47.607647046711385, -122.34764289110899]
    ],
    dateCreated: 1576715078146,
    dateModified: 1576715078146,
    runs: ['-LwQXgfP8s3ZPuxOQgOP'],
    userId: 'user3'
  },
  {
    id: '-LwUN6fFACaGAHHUAkPP',
    coords: testData.cross.horizontal,
    dateCreated: 1576779413035,
    dateModified: 1576779413035,
    runs: ['-LwUN6dwI4UV3h5LzGQL'],
    userId: 'user3'
  }
];

export default (state = initialState, action) => {
  switch (action.type) {
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
