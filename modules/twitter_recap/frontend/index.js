/* global window */

const FormController = (id) => {
  console.log('initializing');
  return {
    init: () => {
      console.log('your id is:');
      console.log(id);
    },
  };
};

FormController('twitter-form').init();

window.FormController = FormController;
module.exports = FormController;
