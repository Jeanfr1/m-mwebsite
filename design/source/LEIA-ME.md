# M&M Cleaning — Casa em suspensão

Oito imagens PNG com transparência real, no mesmo estilo de materiais e iluminação da segunda proposta aprovada. Sem textos, botões ou rastro luminoso incorporados.

## Arquivos

| Arquivo | Uso |
| --- | --- |
| 01-room-assembled.png | Ambiente completo, abertura e estado final; alternativa estática |
| 02-exploded.png | Referência de direção visual para a sala em suspensão |
| 03-floor.png | Piso e base de pedra |
| 04-architecture.png | Paredes, janelas, vista externa e árvore |
| 05-rug.png | Tapete |
| 06-sofa.png | Sofá e almofadas |
| 07-table.png | Mesa e objetos sobre ela |
| 08-ceiling.png | Teto e luminária |

Todas as imagens estão na pasta images/. Dimensões, ordem de sobreposição e sugestões iniciais de posicionamento estão em manifest.json. Os arquivos originais foram preservados sem redimensionamento ou recompressão.

## Montagem

1. Crie um palco quadrado com fundo azul-marinho e um brilho ciano suave feito em CSS. Use o mesmo tamanho de palco para todas as camadas.
2. Posicione cada PNG de forma absoluta. O espaço transparente de cada arquivo faz parte do enquadramento: não use object-fit: cover nem corte individualmente.
3. Empilhe piso, arquitetura, tapete, sofá, mesa e teto, nessa ordem. Transform-origin: top left nos presets do manifest. Translações são frações do tamanho total do palco, não da área visível do objeto.
4. Ajuste a escala e a posição visual de cada camada. Foram geradas separadamente e há variações de enquadramento, forma e textura; não são recortes de registro pixel perfeito da imagem montada. Os valores do manifest são um ponto de partida, sem validação de composição em navegador.
5. Mantenha a sala completa como imagem da abertura e do encerramento. Faça uma transição curta de opacidade para a composição em camadas, o que permite manter o acabamento visual nos dois extremos.
6. Construa textos e botões em HTML. Desenhe o rastro luminoso azul com SVG e anime seu traçado. Assim, o brilho e os textos permanecem nítidos em qualquer tela.

## Roteiro de scroll sugerido

| Progresso | Ação |
| --- | --- |
| 0–15% | Sala montada, título e chamada de orçamento visíveis |
| 15–25% | Transição suave para as camadas; teto começa a subir |
| 25–55% | Paredes e móveis se afastam; tapete e piso revelam a separação |
| 55–70% | Composição suspensa; rastro azul percorre os detalhes com mensagens curtas |
| 70–90% | Camadas voltam ao lugar, com sobreposição temporal dos movimentos |
| 90–100% | Transição para a sala montada e entrada da próxima seção |

Faça a seção do hero permanecer fixa durante essa sequência. Os deslocamentos do manifest são sugestões para explorar o movimento, não keyframes definitivos. Evite grandes rotações das imagens: elas têm uma perspectiva já renderizada. A aproximação pode ser feita no conjunto inteiro.

## Escopo e preparação para produção

Os PNGs permitem um efeito em 2,5D com deslocamento independente, parallax, escala e opacidade. Uma câmera que gira e revela lados inéditos dos móveis exige modelos 3D ou uma sequência renderizada a partir deles.

Antes de publicar, revise a composição em fundo claro e escuro, refine eventuais halos nas bordas e ajuste o alinhamento no tamanho real do hero. Use a imagem montada para telas pequenas e para prefers-reduced-motion. Otimize o peso na implementação; mantenha os PNGs deste pacote como fontes. Não há animação implementada neste pacote.

Geração: ferramenta integrada de geração de imagens, a partir da direção visual aprovada. Este pacote contém os assets e as orientações de montagem.
