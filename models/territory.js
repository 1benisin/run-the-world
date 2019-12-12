class Territory {
  constructor(id, userId, coords, dateCreated, dateModified, runs) {
    this.id = id;
    this.userId = userId;
    this.coords = coords;
    this.dateCreated = dateCreated;
    this.dateModified = dateModified;
    this.runs = runs;
  }
}

export default Territory;
