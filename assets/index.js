
window.addEventListener('load', () => {
  document.querySelectorAll('img.lazyload').forEach((imgEl) => {
    imgEl.setAttribute('src', imgEl.dataset.src);
  });
});
