Function.prototype._before = function(func){ // 写成ES6的aop，不然this的指向有问题
  var __self = this;
  return function(){
      func.apply(__self, arguments);
      return __self.apply(__self, arguments);
  }
}

export default function(page) {
  if (page) {
    page.asyncData = page.asyncData;
    page.created = page.created;
    page.mounted = () => {
      if (!window.__INITIAL_STATE__) {
        page.asyncData().then(() => {
          page.created();
        });
        console.log(222);
      }
      console.log(333);
      // page.hooks.mounted();
    };
  }
  return page;
};
