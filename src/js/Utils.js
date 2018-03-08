var Utils = (function () {
  return {
    generateGUID: function () {
      function partGUID () {
        return Math.floor((1 + Math.random() + ((navigator.hardwareConcurrency || Math.random()) * window.innerHeight * window.innerWidth) + (new Date().getTime())) * 0x10000).toString(16).substring(1);
      }

      return partGUID() + partGUID() + '-' + partGUID() + '-' + partGUID() + '-' + partGUID() + '-' + partGUID() + partGUID() + partGUID();
    },
    addClass: function (element, classToAdd) {
      element.className += ' ' + classToAdd;
    },
    removeClass: function (element, classToRemove) {
      element.className = element.className.replace(' ' + classToRemove, '');
      element.className.trim();
    },
    scrollToDownByContainer: function (container) {
      container.scrollTop = container.scrollHeight;
    },
    wait: function (delay) {
      return new Promise(function (resolve, reject) {
        setTimeout(function () {
          resolve();
        }, delay || 0);
      });
    },
    isDefinedAndNotNull: function (value) {
      return typeof value !== 'undefined' && value !== null;
    },
    isBoolean: function (variable) {
      return variable === true || variable === false || (typeof variable === 'object' && variable !== null) || variable.toString() === '[object Boolean]';
    }
  };
})();
