// Serviços: cada item abre um painel acessível (acordeão no mobile; no desktop o
// painel ocupa a linha abaixo das quatro colunas). Um aberto por vez.
export function initServices() {
  const root = document.querySelector('[data-services]');
  if (!root) return;
  const triggers = [...root.querySelectorAll('.service__trigger')];
  const panelOf = (trigger) => document.getElementById(trigger.getAttribute('aria-controls'));

  const setOpen = (trigger, open) => {
    trigger.setAttribute('aria-expanded', String(open));
    panelOf(trigger).hidden = !open;
  };

  const openOnly = (trigger) => {
    triggers.forEach((t) => t !== trigger && setOpen(t, false));
    setOpen(trigger, true);
  };

  const closePanel = (panel) => {
    const trigger = triggers.find((t) => panelOf(t) === panel);
    if (!trigger) return;
    setOpen(trigger, false);
    trigger.focus();
  };

  triggers.forEach((trigger) =>
    trigger.addEventListener('click', () => (trigger.getAttribute('aria-expanded') === 'true' ? setOpen(trigger, false) : openOnly(trigger))),
  );

  root.addEventListener('click', (e) => {
    const close = e.target.closest('[data-panel-close]');
    if (close) closePanel(close.closest('.service-panel'));
  });

  root.addEventListener('keydown', (e) => {
    const panel = e.target.closest('.service-panel');
    if (e.key === 'Escape' && panel) closePanel(panel);
  });

  document.querySelectorAll('[data-open-service]').forEach((link) =>
    link.addEventListener('click', () => {
      const trigger = triggers.find((t) => t.getAttribute('aria-controls') === link.dataset.openService);
      if (trigger) openOnly(trigger);
    }),
  );

  // "Request a quote" leva a #quote com o serviço já selecionado.
  document.querySelectorAll('[data-quote-service]').forEach((link) =>
    link.addEventListener('click', () => document.dispatchEvent(new CustomEvent('quote:service', { detail: link.dataset.quoteService }))),
  );
}
