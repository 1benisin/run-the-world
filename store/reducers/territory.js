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
      [47.62547077805564, -122.35890716314317],
      [47.62451244150106, -122.35641773790121],
      [47.62358052652604, -122.35388807952404],
      [47.622408308237894, -122.35200570547505],
      [47.623046543509034, -122.35060773789881],
      [47.62461842205012, -122.34732739627363],
      [47.62493839613551, -122.3457458987832],
      [47.622514362878974, -122.3455883190036],
      [47.61998400149665, -122.34542939811946],
      [47.61841198360306, -122.3455883190036],
      [47.622408308237894, -122.35200570547505],
      [47.62198195084879, -122.35293958336115],
      [47.62041021901962, -122.35594365745784],
      [47.6190239823868, -122.35906608402729],
      [47.621262417655934, -122.35890716314317],
      [47.623792717162736, -122.35922399908304],
      [47.62493839613551, -122.35922399908304]
    ],
    dateCreated: 1576715078146,
    dateModified: 1576715078146,
    runs: ['-LwQXgfP8s3ZPuxOQgOP'],
    userId: 'user3'
  },
  {
    id: '-LwUN6fFACaGAHHUAkPP',
    coords: testData.selfCrossing.figure8,
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
