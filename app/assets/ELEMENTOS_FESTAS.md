# Elementos de Natal e Ano Novo

Os elementos foram copiados em 24/11/2026 de `Downloads/ELEMENTOS DE NATAL` e `Downloads/ELEMENTOS DE ANO NOVO`.
- Os originais continuam lá e não foram alterados.
- Todos são PNG RGBA com fundo transparente.
- Cada pasta tem um `manifest.json` com o caminho de origem, o tamanho, a % de transparência e o bbox do conteúdo. Recortes com problema têm o campo `problema`.
- Todos foram conferidos sobre fundo escuro, creme e vermelho.

## natal/ (120 arquivos)

| Pasta | Qtde | O que é | Como usar |
|---|---|---|---|
| `01-bordas-superiores` | 5 | Guirlanda horizontal com laços, bolas e luzinhas | Faixa no topo ou exatamente na divisa entre foto e painel. |
| `02-cantos-opostos` | 5 | Um galho grande no canto superior direito e um pequeno no inferior esquerdo, no mesmo PNG | Moldura leve em diagonal sobre o painel de copy. |
| `03-bordas-esquerdas` | 5 | Guirlanda vertical com **corte reto à esquerda** | Encostar na borda esquerda do banner, com o corte saindo pela borda. |
| `04-bordas-direitas` | 5 | Guirlanda vertical larga com **corte reto à direita** | Encostar na borda direita. |
| `05-bolas-e-estrelas` | 5 | Cacho de bolas e estrelas em canto (vermelho/dourado, champanhe, bordô, prata/azul, verde/dourado) | Canto superior. Variar a paleta conforme o cliente. |
| `06-enfeites-pendurados` | 5 | Bolas e estrelas penduradas por fios que vêm do topo | Pendurar da borda superior. O fio precisa sair pelo topo. |
| `07-presentes-e-pinheiros` | 5 | Presentes com pinheiro e bolas, com **corte reto à direita** | Canto inferior direito, apoiado na base. |
| `08-bordas-de-festa` | 5 | Guirlanda vertical com champanhe, presentes e fitas, com **corte à esquerda** | Tem garrafa, então combina mais com a virada do ano do que com o Natal. |
| `09-cantos-com-estrelas` | 5 | Galho de canto com estrela pendurada e fita | Canto superior direito. |
| `familias/01-ceia` | 10 | Família à mesa redonda da ceia, com peru | Ilustrativas, geradas por IA. Usar só como elemento de cena, nunca no lugar da foto do cliente. |
| `familias/02-sofa` | 10 | Família no sofá, com árvore e presentes | Idem. |
| `familias/03-chao` | 10 | Família sentada no tapete diante da árvore, abrindo presentes | Idem. O tapete já serve de superfície. |
| `hero/01-neve` | 15 | Árvore com lanterna e presentes sobre um montinho de neve | Objeto de chão: a neve é a superfície. Alguns têm um galho com laço solto ao lado. |
| `hero/02-lanternas-presentes` | 15 | Árvore com lanternas e presentes, sem neve | Precisa de uma superfície desenhada embaixo (madeira, chão). |
| `hero/03-molduras-pinheiros` | 15 | Moldura dourada fina com pinheiro, fitas e estrelas (uma oval, a 13). Vários pinheiros têm **corte reto** na lateral. | Moldura do **copy**, nunca da foto do cliente (regra do sem mockup). O corte vai na borda do banner. |

## ano-novo/ (81 arquivos)

| Pasta | Qtde | O que é | Como usar |
|---|---|---|---|
| `01-2027-metalico` | 10 | "2027" em dourado metálico, em linha ou empilhado (20/27). A 08 é entalhada. | Título visual no painel. |
| `02-2027-baloes` | 10 | "2027" em balões metalizados (dourado, champanhe, rosé) | Ar festivo. Nos que têm cordinha, ela precisa ficar inteira. |
| `03-2027-relogio` | 10 | "2027" com um relógio marcando meia-noite no lugar do 0 | Formato bem horizontal (cerca de 3:1). Funciona como faixa no desktop. |
| `04-taca-individual` | 10 | Taça de champanhe sozinha (flute, coupe, vinho) | Objeto de chão: precisa de superfície embaixo. |
| `05-brinde` | 9 | Duas taças brindando. Não existe a 02 na origem. | Idem. |
| `06-fogos` | 10 | Fogos dourados soltos (estouro, leque, anel, rastro) | Luz sobre fundo escuro. Pouco contraste sobre o creme. |
| `extras` | 17 | Composições prontas: 2027 com fitas, relógio, fogos, taças, champanhe no balde, cachos de presentes e bolas pretas e douradas | São arranjos completos. Use um por banner, sem somar outros elementos. |

## Recortes com problema (não use sem corrigir)

A correção deve ser feita no PNG, guardando o original.
- `ano-novo/02-2027-baloes/02-2027-baloes-07.png`: névoa branca entre os balões, visível em qualquer fundo.
- `ano-novo/01-2027-metalico/01-2027-metalico-03.png`: névoa acinzentada no canto superior direito.
- `ano-novo/extras/escultura-dourada-2027-com-fitas-e-fogos-7.png`: névoa clara atrás dos fogos.
- `ano-novo/06-fogos/06-fogos-07.png`: caixa de névoa clara, que aparece sobre o vermelho.
- `ano-novo/06-fogos/06-fogos-03.png`: leve névoa escura, que aparece sobre fundo claro.

## Observações

- Os arquivos são grandes, cerca de 360 MB no total, entre 1 e 2 MB cada. Para o render local isso não é problema. Se o peso atrapalhar, gere cópias `.webp` só dos elementos escolhidos.
- O registro em `app/elements.js` ainda não foi feito. Ele entra quando cada modelo escolher os seus elementos.
