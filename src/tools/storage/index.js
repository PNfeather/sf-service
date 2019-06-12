import {config} from './data';

let pre = 'SF_';

function setItem (name, value) {
  return window.localStorage.setItem(pre + name, JSON.stringify(value));
}

function getItem (name) {
  return JSON.parse(window.localStorage.getItem(pre + name));
}

let storageConfig = [...config];

let storage = {
  get: {},
  set: {}
};

storageConfig.map((item) => {
  storage.get[item] = () => {
    return getItem(item);
  };
  storage.set[item] = (val) => {
    return setItem(item, val);
  };
});

export default storage;
