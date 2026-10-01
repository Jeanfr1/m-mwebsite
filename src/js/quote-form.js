// Formulário de orçamento sem backend: valida junto a cada campo e abre um canal
// real (WhatsApp ou email) com o pedido já escrito. Não simula envio: a mensagem
// final só pede que a pessoa confirme o envio no app que abriu.
const WHATSAPP = '447543395592';
const EMAIL = 'nikyemel@hotmail.com';
const UK_POSTCODE = /^(GIR ?0AA|[A-PR-UWYZ]([0-9]{1,2}|[A-HK-Y][0-9]{1,2}|[0-9][A-HJKS-UW]|[A-HK-Y][0-9][ABEHMNPRV-Y]) ?[0-9][ABD-HJLNP-UW-Z]{2})$/i;

const today = () => new Date().toISOString().slice(0, 10);

const RULES = {
  name: (v) => v.trim().length >= 2 || 'Please enter your name.',
  email: (v) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ||
    (v.trim() ? 'Please enter a valid email address, like name@example.com.' : 'Please enter your email address.'),
  phone: (v) => !v.trim() || /^\+?[\d\s()-]{7,20}$/.test(v.trim()) || 'Please enter a valid phone number, or leave it blank.',
  postcode: (v) => UK_POSTCODE.test(v.trim()) || (v.trim() ? 'Please enter a valid UK postcode, like SW1A 1AA.' : 'Please enter your postcode.'),
  date: (v) => !v || v >= today() || 'Please choose a date from today onwards.',
  service: (v) => Boolean(v) || 'Please choose a cleaning service.',
  message: (v) => v.trim().length >= 10 || 'Please tell us a little about your space (at least 10 characters).',
};

export function initQuoteForm() {
  const form = document.querySelector('[data-quote-form]');
  if (!form) return;
  const status = form.querySelector('[data-form-status]');
  const emailButton = form.querySelector('[data-send-email]');
  const fields = Object.keys(RULES).map((name) => form.elements[name]);

  form.elements.date.min = today();

  const check = (field) => {
    const result = RULES[field.name](field.value);
    const error = document.getElementById(`${field.id}-error`);
    const valid = result === true;
    field.setAttribute('aria-invalid', String(!valid));
    error.textContent = valid ? '' : result;
    return valid;
  };

  // Valida ao sair do campo; depois do primeiro erro, revalida enquanto digita.
  fields.forEach((field) => {
    field.addEventListener('blur', () => {
      if (field.value || field.getAttribute('aria-invalid') === 'true') check(field);
    });
    field.addEventListener('input', () => {
      if (field.getAttribute('aria-invalid') === 'true') check(field);
    });
  });

  document.addEventListener('quote:service', (e) => {
    form.elements.service.value = e.detail;
    check(form.elements.service);
  });

  const validateAll = () => {
    const invalid = fields.filter((field) => !check(field));
    if (invalid.length) {
      invalid[0].focus();
      return false;
    }
    return true;
  };

  const compose = () => {
    const v = (name) => form.elements[name].value.trim();
    const lines = [
      'Hello M&M Cleaning, I would like a free quote.',
      '',
      `Name: ${v('name')}`,
      `Email: ${v('email')}`,
      v('phone') ? `Phone: ${v('phone')}` : null,
      `Postcode: ${v('postcode').toUpperCase()}`,
      `Service: ${v('service')}`,
      v('date') ? `Preferred date: ${new Date(`${v('date')}T12:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}` : null,
      '',
      `About my space: ${v('message')}`,
    ];
    return lines.filter((line) => line !== null).join('\n');
  };

  const links = () => {
    const text = compose();
    return {
      whatsapp: `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`,
      email: `mailto:${EMAIL}?subject=${encodeURIComponent(`Free quote request: ${form.elements.service.value}`)}&body=${encodeURIComponent(text)}`,
    };
  };

  const link = (href, label, external) => {
    const a = document.createElement('a');
    a.href = href;
    a.textContent = label;
    if (external) {
      a.target = '_blank';
      a.rel = 'noopener';
    }
    return a;
  };

  const showStatus = (channel, urls) => {
    status.replaceChildren();
    const lead = document.createElement('p');
    const help = document.createElement('p');
    if (channel === 'whatsapp') {
      lead.textContent = 'Your request is ready in WhatsApp. Press send there to share it with us.';
      help.append("WhatsApp didn't open? ", link(urls.whatsapp, 'Open WhatsApp', true), ' or ', link(urls.email, 'send it by email'), '.');
    } else {
      lead.textContent = 'Your email app should open with your request ready. Press send to share it with us.';
      help.append('Nothing opened? Email us at ', link(`mailto:${EMAIL}`, EMAIL), '.');
    }
    status.append(lead, help);
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateAll()) return;
    const urls = links();
    window.open(urls.whatsapp, '_blank', 'noopener');
    showStatus('whatsapp', urls);
  });

  emailButton.addEventListener('click', () => {
    if (!validateAll()) return;
    const urls = links();
    window.location.href = urls.email;
    showStatus('email', urls);
  });
}
