import Vue from 'vue';
let loadingImg = require('@IMG/loading.gif');
let getCss = (obj, attribute) => { // 获取元素css属性
  if (obj.currentStyle) {
    return obj.currentStyle[attribute];
  } else {
    return window.getComputedStyle(obj, null)[attribute];
  }
};
let getScrollParent = (el) => {
  if (getCss(el, 'overflow') === 'auto' || getCss(el, 'overflow-y') === 'auto' || getCss(el, 'overflow') === 'scroll' || getCss(el, 'overflow-y') === 'scroll') {
    return el;
  } else {
    return getScrollParent(el.parentNode);
  }
};

Vue.directive('imgLazy', { // 元素拖拽指令
  inserted: function (el, binding) {
    let imgUrl = binding.value;
    let parent = el.parentNode;
    let temChild = document.createElement('div');
    let orangeDisplay = getCss(el, 'display');
    let scrollParent = getScrollParent(el);
    let totalHeight = scrollParent.clientHeight + scrollParent.getBoundingClientRect().top;
    let handler = () => {
      if (el.__listenTimer__) return;
      el.__listenTimer__ = setTimeout(() => {
        if (el.getBoundingClientRect().top < totalHeight) {
          scrollParent.removeEventListener('scroll', handler);
          el.style.display = 'none';
          el.src = imgUrl;
          el.onload = () => {
            parent.removeChild(temChild);
            el.style.display = orangeDisplay;
          };
        }
        el.__listenTimer__ = null;
      }, 200);
    };
    temChild.style.width = '100%';
    temChild.style.height = '100%';
    temChild.style.backgroundImage = 'url(' + loadingImg + ')';
    temChild.style.backgroundSize = 'contain';
    temChild.style.backgroundRepeat = 'no-repeat';
    temChild.style.backgroundPosition = 'center';
    parent.appendChild(temChild);
    handler();
    scrollParent.addEventListener('scroll', handler);
  },
  unbind: function (el) {
    if (el.__listenTimer__) clearTimeout(el.__listenTimer__);
    delete el.__listenTimer__;
  }
});
