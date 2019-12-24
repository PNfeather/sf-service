let timer = null;

function debounce (fun, time = 500) {
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    fun();
    timer = null;
  }, time);
}

export default debounce;
