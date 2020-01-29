class AppError {
  constructor(title, message) {
    this.title = title || 'Application Error';
    this.message = message || 'A generic error occured. Please try again';
  }
}

export default AppError;
