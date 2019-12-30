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
    coords: testData.snake.merged,
    dateCreated: 1576715078146,
    dateModified: 1576715078146,
    runs: ['-LwQXgfP8s3ZPuxOQgOP'],
    userId: 'user1'
  },
  {
    id: '-LwUN6fFACaGAHHUAkPP',
    coords: testData.cross.vertical,
    dateCreated: 1576779413035,
    dateModified: 1576779413035,
    runs: ['-LwUN6dwI4UV3h5LzGQL'],
    userId: 'user1'
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
      return [...newTerrs];

    case DELETE_TERRITORIES:
      const newState = state.filter(
        ter => !action.deleteResults.includes(ter.id)
      );
      return [...newState];

    default:
      return state;
  }
};
