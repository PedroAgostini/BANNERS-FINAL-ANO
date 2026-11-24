---
name: banner-festas
description: Direção de design gráfico para os banners de hero de Natal e Ano Novo deste projeto (desktop 1920×800, mobile 1080×1350). Use ao criar, ajustar, revisar ou aprovar qualquer modelo ou banner de cliente, ao escolher elementos, cores ou composição, e antes de exportar. Junta as proibições do usuário, as referências, o catálogo de elementos, as medidas de composição e o checklist final.
---

# Banners de festa: design gráfico

Esta skill transforma as regras do projeto em decisões visuais. O banner vai como fundo do hero de sites de home services nos EUA, e o site sobrepõe o próprio texto em HTML. Um bom banner tem:
- uma foto bonita do cliente;
- uma área de texto limpa;
- um arranjo de festa só, bem desenhado;
- luz quente.
É rico pela luz e pela qualidade, não pela quantidade.

## 0. Antes de desenhar

Leia, sem pular nenhum:
1. Em `CLAUDE.md`, as seções "Proibido nos banners de Natal e Ano Novo" e "Regras que valem". As proibições ganham de tudo.
2. `refs/README.md`, e abra as imagens de `refs/natal/` ou `refs/ano-novo/`.
3. `app/assets/ELEMENTOS_FESTAS.md`, que é o catálogo. Pule os recortes listados com problema.
4. `app/clients/<slug>/cliente.json`, com as cores e as fotos, e `REGISTRO_CLIENTES.md`, para não repetir o que outro site já tem.
5. O site ao vivo do cliente. Meça:
   - a altura do header e se ele é transparente ou fica sobre o hero;
   - as fontes de h1, p e botão;
   - a cor do botão.

## 1. Escolha uma família de referência

Não invente um estilo novo. Cada banner parte de uma destas famílias e varia dentro dela.

| Família | Ref | Fundo | Arranjo | Combina com |
|---|---|---|---|---|
| **A. Noite verde-ouro** | natal-01 | verde muito escuro ou a cor primária escurecida, com poeira de luz | filete dourado na divisa, um flare quente, ramo num canto | tom escuro e marcas sóbrias |
| **B. Campo vermelho** | natal-04, natal-05 | vermelho rico chapado, ou a cor da marca se for quente | cacho de bolas no topo e presentes ou árvore na base, num lado só | marcas quentes |
| **C. Bokeh escuro** | ano-novo-01 | quase preto, com bokeh dourado grande e desfocado | um objeto preso à borda (bola, taça, galho) | Ano Novo e marcas premium |
| **D. Creme com fio dourado** | ano-novo-03 | creme claro, com bokeh muito suave | moldura fina dourada em volta do **copy**, arranjo num canto e uma fita que flui | `tone=light` e marcas claras |
| **E. Céu de fogos** | ano-novo-02, ano-novo-04 | céu escuro, com gradiente leve de uma cor só | fogos como foco de luz, sempre longe do texto | Ano Novo |

Natal usa A, B ou D. Ano Novo usa C, D ou E. Clientes vizinhos no lote devem cair em famílias diferentes.

## 2. Composição e medidas

**Desktop (1920×800)**
- A área de copy fica à esquerda e ocupa de 40% a 46% da largura.
- A margem lateral é de no mínimo 120 px. O texto deve ficar centrado na vertical dentro da área útil.
- A foto do cliente fica à direita, grande e nítida. A divisa entre painel e foto é uma transição suave ou um filete metálico fino, nunca uma moldura em volta da foto.

**Mobile (1080×1350)**
- A área de copy fica no topo e ocupa de 40% a 48% da altura. A foto fica embaixo.
- A foto **ocupa a largura toda**, sem laterais esmaecidas. Só a borda de cima se dissolve no fundo. Se a foto tiver menos de 1080 px, amplie no máximo cerca de 1,2× (Lanczos e nitidez) e confira em tamanho real.
- Se a foto ficar alta e subir, corte a rua ou o chão da parte de baixo para a casa descer, e deixe o céu escuro livre para o arranjo.
- A margem lateral é de no mínimo 72 px.

**Header sobreposto ou transparente**
- A área útil começa na altura do header medida no site, mais 40 px ou mais de folga.
- Isso vale nos dois formatos. Reavalie depois do "tall fade" do mobile.

**Espaçamento**
- A distância do texto à borda e do texto ao arranjo é parecida, nunca menor que 1,5 vez a altura da headline.
- Nada fica apertado contra a borda, e nada fica perdido no meio de um vazio.

## 3. Elementos: orçamento e posição

- **No máximo um arranjo principal e um acento**, por exemplo uma guirlanda na divisa e um cacho no canto oposto. Isso dá no máximo 3 recortes visíveis. Composições prontas de `extras/` contam como o banner inteiro.
- **A área de copy fica vazia.** Nenhum recorte, fogo ou brilho forte encosta nela. Deixe uma folga de pelo menos 40 px.
- Recortes com **corte reto** (bordas laterais, presentes e pinheiros, alguns pinheiros das molduras) ficam encostados na borda, com o corte para fora do banner.
- Objetos de chão (árvore sem neve, taça, brinde) precisam de uma superfície **do próprio recorte** ou de uma sombra de contato. Não use textura.
- Recortes nunca ficam em cima do assunto da foto do cliente, nem flutuando sem apoio.
- **Escala:** nunca desenhe um recorte maior que o tamanho de origem. Para saber o máximo, olhe `w`, `h` e `bbox` em `manifest.json`.
- As famílias (`natal/familias/`) estão liberadas com rosto. Use uma só, como cena, nunca no lugar da foto do cliente.

## 4. Cor, luz e gradiente

- **A base vem da marca:** a cor primária escurecida no tom escuro, ou clareada até creme no tom claro. O dourado é o acento comum a todas as famílias.
- **Bokeh:** de 6 a 14 discos grandes e bem desfocados, com 15% a 35% de opacidade, concentrados longe do texto.
- **Flare:** no máximo um, quente, na divisa ou atrás do arranjo.
- **Gradiente:** só de uma cor, com no máximo dois pontos e diferença pequena de luminosidade. Serve para vinheta ou para dar profundidade, nunca degradê multicolor.
- **Contraste do copy:** a headline de exemplo, na fonte do site, precisa de contraste de 4,5:1 ou mais sobre o fundo real da área de copy.

## 5. Como variar entre clientes

Antes de fechar, registre em `REGISTRO_CLIENTES.md`: família, lado do arranjo, recortes usados (com caminho), paleta e foto.

Um banner novo precisa mudar **pelo menos dois** destes eixos em relação a qualquer outro do mesmo lote:
- família;
- recorte principal;
- lado ou posição do arranjo;
- tom (claro ou escuro).

## 6. Checklist antes de mostrar ao usuário

Faça o render dos dois formatos pelo `render.html` e **olhe as imagens**: uma no tamanho real e uma reduzida a cerca de 400 px de largura. Responda item por item:

- [ ] Não tem nenhuma textura de fundo ou painel.
- [ ] Não tem foto de banco: é a foto do cliente, nítida e sem ampliar além da origem.
- [ ] Os recortes não estão ampliados além da origem. Não aparece halo, névoa nem resto de fundo.
- [ ] São no máximo um arranjo e um acento. O visual não está poluído.
- [ ] A área de copy está vazia. A headline de exemplo lê bem e tem contraste de 4,5:1 ou mais.
- [ ] O espaçamento está equilibrado e as margens respeitam o mínimo.
- [ ] Se o header é sobreposto, a área útil começa abaixo dele com folga, no desktop e no mobile.
- [ ] Os gradientes são discretos e sem multicor.
- [ ] Não tem cartoon nem ilustração chapada.
- [ ] O banner está perto da referência da família escolhida.
- [ ] O banner é diferente de todos os outros do lote, e o `REGISTRO_CLIENTES.md` está atualizado.
- [ ] O logo do cliente não aparece na arte. Não tem mockup (foto emoldurada, cartão, quadro, janela).

Se algum item falhar, corrija e renderize de novo. Mostre ao usuário as duas imagens e diga a família, os recortes e o que variou em relação aos outros banners. Não publique nada sem aprovação.
