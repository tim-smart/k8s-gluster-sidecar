export default function sleep(ms, ...args) {
  return new Promise(function(resolve, reject) {
    setTimeout(resolve, ms, ...args);
  });
}
