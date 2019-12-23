import {
  FETCH_TERRITORIES,
  SAVE_TERRITORY_SUCCESS
} from '../actions/territory';
import Territory from '../../models/territory';

const initialState = [
  {
    id: '-LwQXgfP8s3ZPuxOQgNW',
    coords: [
      [47.615987421710436, -122.35187273472549],
      [47.619877785560334, -122.35499516129494],
      [47.62008999122647, -122.34373055398466],
      [47.61670725350713, -122.34495531767607]
    ],
    dateCreated: 1576715078146,
    dateModified: 1576715078146,
    runs: ['-LwQXgfP8s3ZPuxOQgOP'],
    userId: 'user1'
  },
  {
    id: '-LwUN6fFACaGAHHUAkPP',
    coords: [
      [47.62294055977313, -122.35076531767845],
      [47.62853458032193, -122.34092462807892],
      [47.62083620708049, -122.33744647353888],
      [47.61841198360306, -122.3413584753871]
    ],
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

    default:
      return state;
  }
};
