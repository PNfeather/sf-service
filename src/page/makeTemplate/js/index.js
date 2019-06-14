let getCss = function (obj, attribute) { // 获取元素css属性
  if (obj.currentStyle) {
    return obj.currentStyle[attribute];
  } else {
    return window.getComputedStyle(obj, null)[attribute];
  }
};

export { getCss };
