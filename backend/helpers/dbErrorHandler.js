'use strict';

/**
 * Get unique error field name
 */
const uniqueMessage = (error) => {
  let output;
  try {
    let fieldName = error.message.substring(
      error.message.lastIndexOf('.$') + 2,
      error.message.lastIndexOf('_1')
    );
    output =
      fieldName.charAt(0).toUpperCase() +
      fieldName.slice(1) +
      ' already exists';
  } catch (ex) {
    output = 'Un champ unique existe déjà';
  }

  return output;
};

/**
 * Get the erroror message from error object
 */
exports.errorHandler = (error) => {
  let message = '';

  if (error.code) {
    switch (error.code) {
      case 11000:
      case 11001:
        message = uniqueMessage(error);
        break;
      default:
        message = 'Quelque chose s\'est mal passé';
    }
  } else {
    for (let errorName in error.errorors) {
      if (error.errorors[errorName].message)
        message = error.errorors[errorName].message;
    }
  }

  return message;
};
