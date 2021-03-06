export const emailValidator = email => {
  const re = /\S+@\S+\.\S+/;

  if (!email || email.length <= 0) return 'Email cannot be empty.';
  if (!re.test(email)) return 'Ooops! We need a valid email address.';

  return '';
};

export const passwordValidator = password => {
  if (!password || password.length <= 0) return 'Password cannot be empty.';

  return '';
};

export const nameValidator = name => {
  if (!name || name.length <= 0) return 'Name cannot be empty.';

  return '';
};

export const feetToMiles = (feet, decimalPlace) => {
  const dPlace = decimalPlace ? decimalPlace : 10;
  return Math.round((feet / 5280) * dPlace) / dPlace;
};

export const roundToQuarter = number => {
  return (Math.round(number * 4) / 4).toFixed(2);
};

export const coordinateToRegionId = ([lat, lng]) => {
  lat = roundToQuarter(lat);
  lng = roundToQuarter(lng);
  return `lat${lat}lng${lng}`.replace(/\./g, 'a');
};

export const roundToDecimal = (number, decimalPlace) => {
  const dPlace = decimalPlace ? decimalPlace : 10;
  return Math.round(number * dPlace) / dPlace;
};

export const formatDate = date => {
  return new Date(date).toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
};
