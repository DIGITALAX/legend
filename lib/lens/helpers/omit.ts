import omitDeep from "omit-deep";

const omit = (object: any, name: readonly string[]): any => {
  return omitDeep(object, name);
};

export default omit;
