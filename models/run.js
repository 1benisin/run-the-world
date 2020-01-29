class Run {
  constructor(id, userId, coords, startTime, endTime) {
    this.id = id || null;
    this.userId = userId || '';
    this.coords = coords || [];
    this.startTime = startTime || null;
    this.endTime = endTime || null;
  }
}

export default Run;
