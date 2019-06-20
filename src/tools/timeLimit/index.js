let timer = null;

function format (fun, time = 500) {
  if (timer) return;
  fun();
  timer = setTimeout(() => {
    timer = null;
  }, time);
}

export default format;
