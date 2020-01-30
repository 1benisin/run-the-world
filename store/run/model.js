const uuid = require('uuid');

import AppError from '../appError/model';

class Run {
  // CONSTANTS
  static MAX_START_FINISH_DIST_FT = 200;
  static PERCENTAGE_NOT_CHECK_FOR_COMPLETION = 0.8; // used when checking if start and finish are close enough
  static MIN_GEO_POINTS = 4; // used to check run has enough loction coordinate points
  // ERRORS
  static SAVE_FAILED_ERROR = new AppError('Failed To Save Run');
  static TOO_SHORT_ERROR = new AppError(
    'Run Too Short',
    'Not enough geo data points to log run'
  );
  static TOO_FAR_FROM_START_ERROR = new AppError(
    'Too Far From Starting Point',
    `You must be less than ${this.MAX_START_FINISH_DIST_FT} feet from the starting point of your run to conquer territory`
  );

  static uuid = () => uuid();

  constructor(userId, coords, startTime, endTime, isValidTerritory) {
    this.userId = userId || '';
    this.coords = coords || [];
    this.startTime = startTime || null;
    this.endTime = endTime || null;
    this.isValidTerritory = isValidTerritory || false;
  }

  initWithID(id, run) {
    if (typeof id !== 'string') throw Error(`id ${id} not type of string`);
    this.id = id;

    this.userId = run.userId ? run.userId : this.userId;
    this.coords = run.coords ? run.coords : this.coords;
    this.startTime = run.startTime ? run.startTime : this.startTime;
    this.endTime = run.endTime ? run.endTime : this.endTime;
    this.isValidTerritory = run.isValidTerritory
      ? run.isValidTerritory
      : this.isValidTerritory;

    return this;
  }
}

export default Run;
