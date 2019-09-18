
const Validator = {
  required(value, required) {
    if (required === false) return true;
    return value != null && value !== '';
  }, //Check required
  enum(value, enums) {},  //Enum to check
  match(value, regexp) {
    if (value == null) return true;
    return regexp.test(value);
  }  //Check match
};

module.exports = {Validator};




