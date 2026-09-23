# IT'S PROBABLY FINE

A cosmic-horror office comedy visual novel. One overnight deploy window, one
depreciated god in Sub-Basement 3, six endings.

**Play:** https://fabled-murk.github.io/its-probably-fine/

## Look

Three colours only — `#FFFFFF`, `#0A0A0A`, `#E01B18` — flat hard-edged shapes,
SUPERHOT's white void crossed with Invader Zim's jagged expressionism. Red is a
signal colour, never decoration.

## Layout

```
docs/          the game, served by GitHub Pages
  index.html   page shell
  style.css
  engine.js    ~80-line VN engine: nodes, typing, choices, flags, endings
  script.js    the whole story as one data structure (62 nodes, 6 endings)
  assets/      keyed sprites + backgrounds
art/
  gen.py       Replicate image generation; embeds the locked style token
  key.py       border flood-fill backdrop removal + green despill
  jobs-*.json  the prompts, verbatim
  out/         raw generations + .json sidecars (prompt, model, prediction id)
  ref/         likeness reference
```

Every generated image has a sidecar recording its prompt, model and prediction
id, so a matching asset can be made later.

## Adding to the story

Add a node to `SCRIPT` in `docs/script.js`:

```js
my_node: {bg:'office', left:'robin-tired', who:'YOU', text:"...",
          choices:[{t:"Option", to:'other_node', set:{flag:true}}]},
```

`next` for a linear beat, `choices` for a branch, `ending:true` to finish.
`{if:'flag'}` on a choice hides it until the flag is set.

## Checks

`node test.mjs` (needs `npm i jsdom`) loads the real page into a simulated DOM
and walks every reachable node depth-first, asserting that each one renders,
that visible choice buttons match the script's own flag conditions, that every
ending sets the ending state and offers a restart, and that keyboard selection
and the mute toggle work. Current run: 62/62 nodes, 6/6 endings, 0 errors.
