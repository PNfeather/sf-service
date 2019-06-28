import Vue from 'vue';
let loadingImg = require('@IMG/loading.jpg');
let getCss = function (obj, attribute) { // 获取元素css属性
  if (obj.currentStyle) {
    return obj.currentStyle[attribute];
  } else {
    return window.getComputedStyle(obj, null)[attribute];
  }
};

Vue.directive('imgLazy', { // 元素拖拽指令
  inserted: function (el, binding) {
    let imgUrl = binding.value;
    let parent = el.parentNode;
    let temChild = document.createElement('div');
    temChild.style.width = '100%';
    temChild.style.height = '100%';
    temChild.style.position = 'absolute';
    temChild.style.top = '0';
    temChild.style.left = '0';
    temChild.style.backgroundImage = 'url(' + loadingImg + ')';
    temChild.style.backgroundSize = 'contain';
    temChild.style.backgroundRepeat = 'no-repeat';
    temChild.style.backgroundPosition = 'center';
    if (getCss(parent, 'position') == 'static') {
      parent.style.position = 'relative';
    }
    parent.appendChild(temChild);
    el.src = imgUrl;
    el.onload = () => {
      parent.removeChild(temChild);
    };
  }
});
