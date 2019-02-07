/*
 * Check whether the object contains all keys in array
 *
 * @arg     obj      Object being checking
 * @arg     keys     Array of Strings to be keys of obj
 * @return  Boolean
 */
function complete(obj, keys) {
  return keys.every(key => {
    return obj.hasOwnProperty(key);
  });
}

/*
 * Sanitize input from users
 *
 * @arg     input   String being sanitized
 * @arg     fields  Array of keys to be sanitized
 * @return  null
 */
function sanitize(obj, fields) {
  // TODO: Add functionality
  if (!obj || !fields) {
    return;
  }

  fields.forEach(field => {
    if (obj[field] && typeof(obj[field]) === String) {
      // obj[field] = obj[field].replace(//g, '');
    }
  });
}

/*
 * Check if a string is valid JSON
 *
 * @arg     input    String being sanitized
 * @return  Boolean
 */
function isJSON(input) {
  try {
    JSON.parse(input);
    return true;
  } catch (e) {
    return false;
  }
  
  return true;
}

module.exports = {complete, sanitize, isJSON};
