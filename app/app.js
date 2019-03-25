const IronBase = require('@youzan/iron-base');
const startListenCpuBySSR = require('./subscription/ssr');

const app = new IronBase();
app.on('start', app => {
  console.log('app start');
  startListenCpuBySSR(app);
});
