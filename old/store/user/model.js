const uuid = require('uuid');
import theme from '../../constants/theme';

class User {
  constructor(displayName, email, photoURL, color) {
    this.displayName = displayName || 'missing username';
    this.email = email || 'missing email';
    this.photoURL =
      photoURL || 'http://cdn.onlinewebfonts.com/svg/img_184513.png';
    this.color = color || theme.colors.primary;
  }

  static uuid = () => uuid();

  initWithID(id, user) {
    if (typeof id !== 'string') throw Error(`id ${id} not type of string`);
    this.id = id;

    this.displayName = user.displayName ? user.displayName : this.displayName;
    this.email = user.email ? user.email : this.email;
    this.photoURL = user.photoURL ? user.photoURL : this.photoURL;
    this.color = user.color ? user.color : this.color;

    return this;
  }
}

export default User;
