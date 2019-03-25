
/**
 * 其实这里最好和egg一样，有个Subscription内置对象
 */
// const cpuStat = require('cpu-stat');

// let timer;

// module.exports = {
//   start() {
//     timer = setInterval(() => {
//       cpuStat.usagePercent((err, percent, seconds) => {
//         return percent;
//       });
//     }, 1000);
//   },
//   stop() {
//     clearInterval(timer);
//   }
// };