const objectParser = (object) => {
  return JSON.stringify(object, null, 4);
}

module.exports = {
  objectParser
}