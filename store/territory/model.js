const uuid = require('uuid');

import AppError from '../appError/model';
import * as PolygonService from '../../services/polygons';

class Territory {
  // ERRORS
  static FETCH_ERROR = new AppError('Failed to fetch Territories');
  static FULLY_INSIDE_ANOTHER_ERROR = new AppError(
    'Failed to Conquer Territory',
    "The area you're trying to conquer cannot be fully inside another territory"
  );

  static uuid = () => uuid();

  constructor(userId, coords, dateCreated, center) {
    this.userId = userId || '';
    this.coords = coords || [];
    this.dateCreated = dateCreated || null;
    this.center = center
      ? center
      : coords && coords.length
      ? PolygonService.center(coords)
      : [0, 0];
  }

  initWithID(id, terr) {
    if (typeof id !== 'string') throw Error(`id ${id} not type of string`);
    this.id = id;

    this.userId = terr.userId ? terr.userId : this.userId;
    this.coords = terr.coords ? terr.coords : this.coords;
    this.dateCreated = terr.dateCreated ? terr.dateCreated : this.dateCreated;
    this.center = terr.center
      ? terr.center
      : terr.coords && terr.coords.length
      ? PolygonService.center(terr.coords)
      : [0, 0];

    return this;
  }

  withoutId() {
    const terr = { ...this };
    delete terr.id;
    return terr;
  }
}

export default Territory;
