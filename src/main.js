import '@fontsource-variable/plus-jakarta-sans/wght.css';
import '@fontsource-variable/plus-jakarta-sans/wght-italic.css';
import './styles/main.css';

import { initHeader } from './js/header.js';
import { initHero } from './js/hero.js';
import { initServices } from './js/services.js';
import { initFaq } from './js/faq.js';
import { initQuoteForm } from './js/quote-form.js';
import { initReveals, initTraces } from './js/reveal.js';
import { initCompare } from './js/compare.js';

document.querySelectorAll('[data-year]').forEach((el) => (el.textContent = String(new Date().getFullYear())));

initHeader();
initServices();
initFaq();
initQuoteForm();
initCompare();
initReveals();
initTraces();
initHero();
