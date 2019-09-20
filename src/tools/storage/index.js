import {config} from './data';

let pre = 'XZD_';

function setItem (name, value) {
  return window.localStorage.setItem(pre + name, JSON.stringify(value));
}

function getItem (name) {
  return JSON.parse(window.localStorage.getItem(pre + name));
}

let storageConfig = [...config];

let storage = {
  get (name) {
    if (storageConfig.includes(name)) {
      return getItem(name);
    } else {
      console.warn('当前字面量' + name + '未设置缓存，请在storage工具data中配置');
    }
  },
  set (name, value) {
    if (storageConfig.includes(name)) {
      return setItem(name, value);
    } else {
      console.warn('当前字面量' + name + '未设置缓存，请在storage工具data中配置');
    }
  }
};

export default storage;
