// Comparador antes/depois para #results (seção oculta até haver fotos reais).
// Funciona com toque, mouse e teclado (input range) e com os botões Before / After.
export function initCompare() {
  document.querySelectorAll('[data-compare]').forEach((figure) => {
    if (figure.closest('[hidden]')) return;
    const range = figure.querySelector('.compare__range');
    const set = (value) => {
      figure.style.setProperty('--pos', `${value}%`);
      range.value = value;
    };
    range.addEventListener('input', () => set(range.value));
    figure.querySelectorAll('[data-compare-to]').forEach((button) => button.addEventListener('click', () => set(button.dataset.compareTo)));
  });
}
