class Run {
  // CONSTANTS
  static MAX_START_FINISH_DIST_FT = 200;
  static PERCENTAGE_NOT_CHECK_FOR_COMPLETION = 0.8; // used when checking if start and finish are close enough
  static MIN_GEO_POINTS = 4; // used to check run has enough loction coordinate points
  // ERRORS
  static SAVE_FAILED_ERROR = Error('Failed to save your run');
  static TOO_SHORT_ERROR = Error('Not enough geo data points to log run');
  static TOO_FAR_FROM_START_ERROR = Error(
    `You must be less than ${this.MAX_START_FINISH_DIST_FT} feet from the starting point of your run to conquer territory`
  );

  constructor(id, userId, coords, startTime, endTime) {
    this.id = id || null;
    this.userId = userId || '';
    this.coords = coords || [];
    this.startTime = startTime || null;
    this.endTime = endTime || null;
  }
}

export default Run;
