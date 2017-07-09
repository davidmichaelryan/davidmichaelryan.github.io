/* global $ */

const countdown = () => {
  const $titleHeader = $('.title_header');
  return $({ countNum: 0 }).animate(
    {
      countNum: 999,
    },
    {
      duration: 1500,
      step() {
        return $titleHeader.attr('data-num', 999 - Math.floor(this.countNum));
      },
      complete: () => {
        if ($titleHeader.attr('data-num') !== 0) {
          $titleHeader.attr('data-num', 0);
        }
        $titleHeader.addClass('hide');

        return setTimeout(() => {
          $titleHeader.attr('data-num', '😎').removeClass('hide');
        }, 400);
      },
    },
  );
};

module.exports = countdown;
