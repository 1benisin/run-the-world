const uuid = require('uuid');
import AppError from '../appError/model';

class Territory {
  // ERRORS
  static FETCH_ERROR = new AppError('Failed to fetch Territories');
  static FULLY_INSIDE_ANOTHER_ERROR = new AppError(
    'Failed to Conquer Territory',
    "The area you're trying to conquer cannot be fully inside another territory"
  );

  static uuid = () => uuid();

  constructor(userId, coords, dateCreated) {
    this.userId = userId || '';
    this.coords = coords || [];
    this.dateCreated = dateCreated || null;
  }

  initWithID(id, terr) {
    if (typeof id !== 'string') throw Error(`id ${id} not type of string`);
    this.id = id;

    this.userId = terr.userId ? terr.userId : this.userId;
    this.coords = terr.coords ? terr.coords : this.coords;
    this.dateCreated = terr.dateCreated ? terr.dateCreated : this.dateCreated;

    return this;
  }
}

export default Territory;
