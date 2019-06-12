import {config} from './data';

let pre = 'myApp_';

function setItem (name, value) {
  return window.localStorage.setItem(pre + name, value);
}

function getItem (name) {
  return window.localStorage.getItem(pre + name);
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
