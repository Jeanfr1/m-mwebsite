// <details name="faq"> já garante uma pergunta aberta por vez nos navegadores
// atuais; este fallback cobre os que ainda não suportam o atributo name.
export function initFaq() {
  const items = [...document.querySelectorAll('[data-faq] details')];
  if (!items.length || 'name' in HTMLDetailsElement.prototype) return;
  items.forEach((item) =>
    item.addEventListener('toggle', () => {
      if (item.open) items.forEach((other) => other !== item && (other.open = false));
    }),
  );
}
