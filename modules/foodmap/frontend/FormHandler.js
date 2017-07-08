/* global document */

class FormHandler {
  constructor(selector) {
    this.$el = document.getElementById(selector);
  }

  disableBtnDefault(type) {
    this.$el.addEventListener(type, (event) => { event.preventDefault(); });
  }

  getInfoFromForm() {
    const formElements = this.$el.elements;
    return {
      startingLocation: formElements[0].value,
      endingLocation: formElements[1].value,
    };
  }

}

module.exports = FormHandler;
