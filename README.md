# M&M Cleaning: site

Site de página única da M&M Cleaning, montado a partir do roteiro "Casa em suspensão" (`design/source/m-m-cleaning-roteiro-site.pdf`) e do mockup aprovado (`design/mockup-aprovado.png`). Os textos do site estão em inglês; as instruções de produção, em português.

## Rodar

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # gera dist/ (site estático)
npm run preview   # serve o dist/
npm run images    # regenera os WebP a partir dos PNGs de design/source/images
```

Funciona com o Node 20.10 (Vite 6). O resultado é estático: qualquer hospedagem serve o `dist/` (Vercel e Netlify detectam o Vite sozinhos).

## Estrutura

```
index.html                 todas as seções (hero, approach, services, about, results oculto, faq, quote, rodapé)
src/main.js                entrada: fontes, CSS e inicialização
src/styles/main.css        sistema visual do roteiro (tokens, grade de 1.200 px, ritmo, componentes)
src/js/hero.js             casa em suspensão (GSAP ScrollTrigger) e passagem da sala para #approach
src/js/header.js           menu mobile, logo branco/azul conforme o fundo, link ativo
src/js/services.js         painéis de serviço (acordeão no mobile) e serviço pré-selecionado no orçamento
src/js/quote-form.js       validação e envio pelo WhatsApp ou email
src/js/reveal.js           entradas discretas e rastros ciano (#about e rodapé)
src/js/faq.js, compare.js  acordeão do FAQ e comparador antes/depois
src/assets/room/           WebP otimizados (gerados; não editar à mão)
design/source/             pacote original: PNGs, manifest, LEIA-ME e roteiro em PDF
```

## A animação do hero

- O palco é quadrado. As seis camadas (`03-floor` a `08-ceiling`) ficam empilhadas na ordem do manifest, com `transform-origin` no canto superior esquerdo e translações em frações do palco.
- A posição de cada camada (`LAYERS` em `src/js/hero.js`) foi **medida por registro de imagem** contra `01-room-assembled.png`, porque os presets do manifest não tinham sido validados. O tapete, quase todo escondido pelos móveis, foi ajustado à mão.
- O hero fica fixo por 2,6 telas e segue a tabela do LEIA-ME: 0–15% sala montada, 15–25% transição para as camadas, 25–55% separação, 55–70% rastro com "Surfaces / Corners / Finishing touches", 70–90% recomposição e 90–100% retorno à sala montada.
- Ao soltar o hero, a sala desliza até o espaço reservado em #approach enquanto o fundo passa de navy para branco. Quando ela se acomoda, a imagem da seção assume no mesmo lugar, sem diferença visível.
- Em telas com menos de 1024 px de largura ou 600 px de altura, e com `prefers-reduced-motion`, não há animação: entra a sala montada estática e as camadas nem são baixadas.

## Formulário de orçamento

Ainda não há backend. O botão **Request my free quote** valida os campos e abre o WhatsApp (+44 7543 395592) com o pedido já escrito; **Prefer email?** faz o mesmo por email (nikyemel@hotmail.com). Nenhuma mensagem de sucesso é simulada: o site só pede que a pessoa confirme o envio no app que abriu. Sem JavaScript, o formulário cai num `mailto:`.

## Pendências (dependem da empresa)

Os pontos estão marcados com `TODO(M&M)` no `index.html`.

1. **Foto real da equipe em #about.** Hoje há um recorte provisório da sala renderizada (`about-placeholder.webp`).
2. **Logo oficial.** O logo é um SVG recriado a partir do mockup. Basta trocar o `<symbol id="logo">` pelos arquivos oficiais (versão azul e branca).
3. **Escopo de cada serviço.** Os painéis têm um rascunho genérico que precisa ser confirmado.
4. **Qualidades da empresa.** Confirmar a redação de "Reliable & trusted / High-quality service / Trained professionals / Eco-friendly products".
5. **FAQ.** Há duas respostas confirmadas no material e duas derivadas da lista de serviços. Faltam: áreas atendidas, produtos de limpeza, o que inclui cada serviço e limpeza recorrente.
6. **#results.** A seção e o comparador antes/depois já estão prontos, mas ocultos (`hidden`). Ative quando houver pares reais autorizados. Nunca use os renders como resultado de serviço, nem crie depoimentos ou números.
7. **Domínio.** Definido o domínio, trocar `og:image` por uma URL absoluta e adicionar `<link rel="canonical">`.
8. **Rodapé.** Incluir as localidades atendidas e os links de privacidade e termos quando existirem.
