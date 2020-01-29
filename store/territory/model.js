const uuid = require('uuid');
import AppError from '../appError/model';

class Territory {
  // ERRORS
  static FETCH_ERROR = new AppError('Failed to fetch Territories');
  static FULLY_INSIDE_ANOTHER_ERROR = new AppError(
    'Failed to Conquer Territory',
    "The area you're trying to conquer cannot be fully inside another territory"
  );

  constructor(id, userId, coords, dateCreated) {
    this.id = id || uuid();
    this.userId = userId || '';
    this.coords = coords || [];
    this.dateCreated = dateCreated || null;
  }
}

export default Territory;
