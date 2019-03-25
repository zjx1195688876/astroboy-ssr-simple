const cpuStat = require('cpu-stat');
const ENV = process.env.NODE_ENV;

const startListenCpuBySSR = (app, options = {}) => {
  app.isSSR = true; // 默认为true
  const TIME = options.time ? options.time : 3000;
  const SSR_TYPE = {
    development: true,
    degrade: false
  };

  if (ENV !== 'prod') {
    app.isSSR = SSR_TYPE[ENV] || false;
  } else {
    let cpuPercent = 0;
    setInterval(() => {
      cpuStat.usagePercent((err, percent, seconds) => {
        cpuPercent = percent;
      });
      app.isSSR = Boolean(cpuPercent < 30);
    }, TIME);
  }
};

module.exports = startListenCpuBySSR;
