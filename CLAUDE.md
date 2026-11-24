# Banners de Natal — contexto do projeto

Réplica da infraestrutura do projeto "BANNERS FIM DE ANO" (Thanksgiving, D:\CLIENTES\BANNERS FIM DE ANO), trocada para Natal 2026 (25/12).
Veio só o que serve para o Natal: o motor, o editor, as texturas, os adereços neutros de cada ofício, as fotos de estoque sem outono, os dados dos clientes e os lotes.
Ficou de fora: os modelos, os elementos de Thanksgiving, as referências e os exports.
Os banners de Natal devem ser **diferentes** dos de Thanksgiving, **sem a ideia de mockup**. Isso quer dizer que a foto do cliente não entra numa moldura, num cartão impresso, numa amostra, num espelho, numa janela ou num quadro na parede.

## Estrutura

- `app/engine.js`: o motor em canvas, igual ao original. Desktop 1920×800, mobile 1080×1350. `BannerEngine.render(canvas, model, fmt, state)`.
- `app/scenes.js`: helpers. `rng`, `bokeh` (luzes desfocadas), `drawSlots` (desenha os slots por profundidade, com sombra e contato), `texture`, `light`, `bubble/bubbles`.
- `app/elements.js`: catálogo de recortes. Está **vazio**, para receber os elementos de Natal.
- `app/assets/el/`: só adereços neutros dos ofícios: pincel, pinceladas, ferramentas, escada, espátulas, amostras de piso, bolhas.
  - Os revisores rejeitaram esponja, pano e trena ("não fazem sentido"). Não use sem pedido.
- `app/assets/natal/` (120) e `app/assets/ano-novo/` (81): recortes de festa (guirlandas, cantos, bolas, árvores, molduras, famílias, 2027, taças, fogos). O guia de uso e a lista de recortes com névoa estão em `app/assets/ELEMENTOS_FESTAS.md`, e cada pasta tem um `manifest.json`.
- `app/assets/tex/`: texturas de madeira, mármore, pedra, reboco, telhas e pisos, que vieram do Thanksgiving. **Não use nos banners de Natal e Ano Novo** (ver "Proibido nos banners").
- `app/assets/photo/`: fotos de estoque por ofício (prefixos c01, cl, dw, fl, gs, home, ms, pt, sr). As fotos de outono e de mesa de Thanksgiving ficaram de fora. **Proibidas nos banners de Natal e Ano Novo:** use só fotos do cliente.
- `app/models/`: vazio. O modelo é `models/<nicho>-0N.js`, mais um kit opcional `models/<nicho>-shared.js`. Cada modelo precisa de `<script>` em **index.html e render.html**.
- `app/clients/<slug>/`: fotos e logos de cada cliente, mais o `cliente.json` (nome, lote, cores primária e secundária, lista de fotos).
  - As fotos são as usadas no Thanksgiving. Se o site tiver outra foto boa, prefira a outra, para o banner de Natal não parecer repetido.
- `CLIENTES_LOTE1.md`, `CLIENTES_LOTE_2..4.md`: os lotes, com acesso e indicação de site em código ou WP.
- `REGISTRO_CLIENTES.md`: controle de não repetição do Natal. Tem cores, pasta e tipo de site, com modelo, tom e foto em branco.
- `exports/`: os exports de cada cliente vão para `exports/clientes/lote-N/<CLIENTE>/{desktop,mobile}.{png,webp}`.
- `refs/`: as referências visuais vão em `refs/natal/` e `refs/ano-novo/`, descritas em `refs/README.md`.

## Contrato de um modelo (registrado em `window.BannerModels[id]`)

Campos:
- `id`, `niche` (um dos NICHES do editor), `name`, `style`, `credit`, `palettes: [{primary, secondary}]`, `defaultTone`.
- `photos: [{id, name, src, desktop: {photo, params}, mobile: {...}}]` e `defaultPhoto`. `photo` é o fallback.
- `params`, mais `choices` e `controls` para o editor.
- `elementPresets: [{name, slots: {slotId: elId|null}}]` e `elementPath(el)`, que devolve o caminho do PNG.
- `assets(R)`, que devolve `{nome: src}` com texturas e artes extras.
- `formats.{desktop,mobile}`:
  - `copy: {x, y, w, h}`, a área do texto em frações de 0 a 1.
  - `photo: {fx, fy, zoom}` e `params`.
  - `slots`, cada um com `id`, `kind`, `label`, `el`, `x`, `y`, `size`, `rot` e `depth: ground|far|mid|near`.
- `draw(ctx, R, A)`. `R` traz W, H, tone, primary e secondary em RGB, photo, slots e params. `A` traz photo, els[slotId], os assets e api.

Overrides por cliente, via `render.html`:
- `?model=&fmt=desktop|mobile&tone=dark|light&p=HEX&s=HEX&src=&fx=&fy=&zoom=&prm=<json>&slots=<json>&els=N&copy=1`
- O merge de `slots` deve ser **por slot**, com all + formato. Um merge raso já derrubou trocas antes.

## Render local

1. Sirva a pasta `app/` com um servidor estático em node, na porta 8931.
2. Tire o print de `render.html?...` no Chrome headless. O `document.title` vira `done` quando terminar.

Os scripts antigos (collect.py, jobs.py, key.py, ext.py, holiday_tpl.css) ficavam no scratchpad e não existem mais. Reescreva quando precisar.

## Skill de design

Antes de criar, ajustar ou revisar qualquer banner, carregue a skill **`banner-festas`** (`.claude/skills/banner-festas/SKILL.md`). Ela traz as famílias de referência, as medidas, o limite de elementos e o checklist final.

## Proibido nos banners de Natal e Ano Novo (decidido pelo usuário em 24/11/2026)

Estas regras vêm antes das regras herdadas do Thanksgiving abaixo. Se houver conflito, valem estas.

1. **Sem texturas.** Nada de madeira, mármore, reboco, pedra ou piso como fundo ou painel (`app/assets/tex/`).
   - O fundo é cor da marca, luz, bokeh e brilho.
   - A superfície sob objetos de chão pode existir se vier do próprio recorte (neve, tapete, chão recortado). Também vale sombra de contato.
2. **Sem visual poluído.** Poucos elementos, num arranjo só. Na dúvida, tire um elemento.
3. **Sem banco de imagens.** Use só fotos do próprio cliente. `app/assets/photo/` está proibida. Se o site não tiver foto boa, avise o usuário em vez de usar estoque.
4. **Nenhum banner igual ao de outro site.** Mude composição, elementos, variante e paleta de cliente para cliente, e registre em `REGISTRO_CLIENTES.md`.
5. **Onde vai texto, não vai elemento.** A área de copy fica livre. Nada de galho, bola, fogos ou brilho forte invadindo a headline, a sub ou o CTA.
6. **Não fugir muito das referências.** Fique perto de `refs/natal/` e `refs/ano-novo/` (`refs/README.md`).
7. **Sem animação, cartoon, ilustração chapada ou vetor infantil.** Só recortes fotográficos e luz realista.
8. **Sem gradientes exagerados.** Só transições suaves e discretas, sem degradê multicolor nem arco-íris.
9. **Sem imagem de baixa qualidade.** Nada pixelado, borrado, com artefato de compressão ou ampliado além do tamanho de origem. Isso vale para foto do cliente e para elemento.
10. **Espaçamento equilibrado.** O conteúdo não fica apertado nem perdido no vazio. As margens são consistentes entre o texto, a borda e o arranjo.
11. **Header transparente ou sobreposto ao hero.** Meça a altura do header no site ao vivo. O topo da área de copy começa abaixo dele, com folga (cerca de 40 px ou mais), nunca com margem pequena. Isso vale para desktop e mobile. Caso conhecido: Rob.

12. **No mobile, a foto ocupa a largura toda.** Não pode haver laterais esmaecidas nem "recortes laterais", pedido do usuário em 24/11/2026.
    - Se a foto for mais estreita que 1080 px, é permitida uma ampliação leve, até cerca de 1,2×, com Lanczos e nitidez. Confira em tamanho real.
    - Só a borda de cima pode se dissolver no fundo.

As famílias de `app/assets/natal/familias/` estão **liberadas com rosto**. A regra do Thanksgiving de "só costas e mãos" não vale para elas.

## Regras que valem (aprendidas no Thanksgiving)

### Visual

- "Bonito e fluido". Quando pedirem "bonito", entregue riqueza no nível das referências:
  - brilho quente e bokeh;
  - buquês exuberantes;
  - curvas suaves com borda metálica ou brilhante;
  - uma foto grande e bonita.
- Conceitos espertos mas ralos, sobre fundo chapado, parecem baratos.
- Layout simples e didático. Nada de cenas montadas com prateleiras, adereços e mini-cenários.
- Cada nicho pode ter conceitos próprios. Não copie o mesmo layout entre nichos.
- Faixas decorativas ficam exatamente na divisa entre foto e painel.
- Elementos com contenção:
  - nada de pilhas num canto;
  - nada solto em cima do assunto da foto;
  - nada "voando": objeto de chão precisa de superfície desenhada embaixo;
  - recorte não pode aparecer cortado.
- Elementos agrupados em arranjos desenhados (buquê no topo de uma borda, base sob objetos), não espalhados ao acaso.
- Sem pinceladas ásperas, sem texturas procedurais ruidosas, sem conceito de antes e depois, sem trigo.

### Recortes

- Sem resto de fundo, sem alpha falhado.
- Confira sobre fundo escuro, claro e saturado antes de usar.
- Corrija no PNG de origem e guarde o original.
- Ferramentas com corte reto no cabo: o corte sai pela borda do banner.
- Pexels: se o JS da página estiver bloqueado, pegue os IDs com a ferramenta `find` e baixe de `images.pexels.com` com curl. O Adobe recusa URL do Pexels, então faça o key localmente com Python.

### Clientes

- Nenhum banner igual a outro.
- Use as fotos do próprio cliente: limpas, nítidas, a melhor da página.
- Nada de foto gerada por IA ("-ia" ou ilustrativa), de antes e depois ou com borda de portfólio.
- Logo do cliente **nunca** dentro da arte.

### Copy

Adapte as regras do Thanksgiving:
- Inglês para o site, com tradução em PT só para revisão.
- Uma versão recomendada, mais um headline alternativo e um CTA alternativo.
- Headline com até cerca de 6 palavras ou 40 caracteres.
- Sub com até cerca de 20 palavras, numa frase.
- CTA de 2 a 4 palavras.
- Sem ofertas inventadas, com no máximo um fato de credibilidade tirado do site.
- Siga a voz de cada site.
- Não repita headline nem sub entre clientes.
- A data-limite de validade, se o banner fica até o Ano Novo, ainda precisa ser definida com o usuário.

### Fontes

As prévias de copy usam as fontes do próprio site. Leia o font-family, o peso e o text-transform computados de h1, p e botão no site ao vivo.

## Aplicação nos sites (troca Thanksgiving → Natal)

Regras gerais:
- Mostre tudo antes de publicar. Nada de push ou de "Update" no Elementor sem aprovação.
- O usuário digita os logins do WP no Chrome.

Sites em código:
- O banner atual está em `assets/.../holiday/thanksgiving-{desktop,mobile}.webp`, com `assets/css/holiday.css` separado e um `<picture>` no hero (mobile < 1024px).
- Para o Natal, troque as imagens e o copy nesses mesmos arquivos.
- Nem todo site faz deploy automático. Gomes e LCG-PROD ficam na Hostinger hcdn e precisam de deploy manual no hPanel > Git; confira com curl.
- WC Painting: o site ao vivo é `static-site/`, que precisa de upload manual.

Sites WP:
- O hero original foi **escondido** e um container novo de Thanksgiving foi inserido acima dele.
- Para o Natal, troque o conteúdo desse container. Nunca edite o hero original.
- Faça upload pelo input de arquivo de `media-new.php`.

Pendências e particularidades do Thanksgiving:
- **ES Hardwood**: o site estava fora do ar.
- **André**: o site redireciona para o Lofty, sem acesso.
- **LCG**: o hero original foi restaurado, a pedido.
- **Durable** e **Mr Blu**: a edição se perdeu.
- **Rob**: o header sobrepõe o topo.

Mobile:
- O banner é estendido para cima com a cor do painel ("tall fade": 1500px que se dissolvem numa cor chapada). Não use espelho de textura, porque texturas estão proibidas.
- Reavalie a área livre do topo depois de cada export.

## Pasta compartilhada

Outras sessões ou pessoas podem editar a mesma pasta. Liste a pasta antes de criar arquivos e use nomes e IDs novos. Nunca sobrescreva sem conferir.
