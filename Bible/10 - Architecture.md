# Architecture

## Project Layers

```text
Infinite Engine/
|-- README.md
|-- package.json
|-- Bible/
|-- Ideas/
|-- data/
|   |-- vocabulary/
|   |-- character/
|   |-- clothing/
|   |-- footwear/
|   |-- accessories/
|   |-- locations/
|   |-- time-of-day/
|   |-- camera/
|   |-- effects/
|   |-- weather/
|   |-- poses/
|   |-- themes/
|   `-- packages/
|-- engine/
|   |-- selection/
|   |-- resolution/
|   |-- prompt-building/
|   `-- validation/
|-- app/
`-- tests/
```

Folders are created when their first approved content is ready. The number of data files is an organizational choice and must not change engine behavior.

## Ownership

| Area | Owns |
| --- | --- |
| `README.md` | Project overview and navigation |
| `package.json` | JavaScript module format and future project commands |
| `Bible/` | Human-readable design decisions and behavior |
| `Ideas/` | Unapproved possibilities; never loaded by the engine |
| `data/` | Actual selectable options and controlled vocabularies |
| `engine/` | Selection, compatibility, inheritance, resolution, and prompt logic |
| `app/` | Screens, controls, and user settings |
| `tests/` | Automated checks for broken data and behavior |

## Source Of Truth

- Bible owns behavior and design intent.
- Data owns selectable options and their metadata.
- Engine owns the implementation of approved behavior.
- Ideas have no engine effect until approved and moved.
- Tests verify that engine behavior and data remain consistent with the Bible.
- Once an approved option list exists in `data/`, the Bible summarizes the system instead of duplicating every record.

## Domain Ownership

| Information | Owner |
| --- | --- |
| Clothing-system explanation | `Bible/04 - Clothing.md` |
| Footwear-system explanation | `Bible/11 - Footwear.md` |
| Accessories-system explanation | `Bible/12 - Accessories.md` |
| Location-system explanation | `Bible/13 - Locations.md` |
| Atmosphere-system explanation | `Bible/14 - Atmosphere.md` |
| Time-of-Day-system explanation | `Bible/15 - Time of Day.md` |
| Camera-system explanation | `Bible/16 - Camera.md` |
| Effects-system explanation | `Bible/17 - Effects.md` |
| Theme-system explanation | `Bible/05 - Themes.md` |
| Package-system explanation | `Bible/06 - Packages.md` |
| Random-selection behavior | `Bible/07 - Randomness.md` |
| Cross-engine rules | `Bible/08 - Rules.md` |
| Official body regions | `data/vocabulary/body-regions.js` |
| Official temperatures, seasons, formalities, styles, moods, and theme affinities | `data/vocabulary/` |
| Tank Top records and coverage | `data/clothing/tops/tank-tops.js` |
| Footwear records and coverage | `data/footwear/` |
| Accessories records and coverage | `data/accessories/` |
| Location records and Environment metadata | `data/locations/` |
| Atmosphere records and selection configuration | `data/weather/` |
| Time of Day records and selection configuration | `data/time-of-day/` |
| Camera records and selection configuration | `data/camera/` |
| Effects records and selection configuration | `data/effects/` |
| Complete outfits, uniforms, and costumes | `data/packages/` |
| Coverage resolution | `engine/resolution/` |
| Prompt assembly | `engine/prompt-building/` |
| Data and rule validation | `engine/validation/` and `tests/` |

## Clothing Inheritance

Clothing uses no more than three levels:

```text
Group -> Garment -> Optional Variant
```

Variant values override garment values. Garment values override group defaults. The engine resolves these layers into one complete garment before selection or prompt generation.

## Change Discipline

Before adding approved material:

1. Identify whether it is design intent, a cross-engine rule, controlled vocabulary, selectable data, engine logic, interface behavior, or an unapproved idea.
2. Place it under that owner's directory.
3. Avoid duplicating selectable records across the Bible and data files.
4. Validate references, IDs, inheritance, and vocabulary values before release.

## Generation Orchestration

`engine/generation/` is the top-level prompt-generation layer. Its public `prepareGeneration(...)` entry point coordinates the existing public pipeline in order: Selection -> Resolution -> Prompt Building. It preserves the structured outputs from those layers and returns the shared `RandomRuntimeState` by reference for explicit caller-managed reuse across generation sequences.

Generation Orchestration does not duplicate catalog lookup, Random selection, compatibility resolution, coverage logic, or prompt formatting. It introduces no hidden global state and does not generate implicit seeds; Random-enabled controls retain Selection's requirement for an explicit seed or RNG.

A generation completes when Prompt Building succeeds and the final prompt has been constructed. At that point the orchestrator calls `completeGeneration()` automatically exactly once. If Selection, Resolution, or Prompt Building fails, Random recovery is not advanced. Infinite Engine does not own or require an external image-generation provider.

## Selection Engine

`engine/selection/` owns translation of current control states into requested catalog selections. It preserves explicit manual choices, applies only approved defaults and None states, delegates Random to `engine/selection/random/`, and enforces approved local selection limits. It does not perform cross-domain compatibility, coverage consequences, inheritance consequences, or prompt assembly; those remain Resolution or Prompt Building responsibilities.

Selection results preserve selection provenance (`manual`, `default`, `none`, or `random`) alongside the selected value/record so later layers can distinguish why a value is present or absent. Disabled catalog records are not valid manual selections. Random requires an explicit seed or RNG and uses the shared `RandomRuntimeState`. Selection does not call `completeGeneration()`; the generation owner does so only after a completed generation.

## Resolution Engine

`engine/resolution/` consumes a completed Selection result and produces the coherent structured generation state used by later Prompt Building. Resolution preserves Selection provenance, enforces approved cross-domain compatibility, applies Location consequences such as indoor Atmosphere suppression, preserves Built Outfit and Package structure, and calculates final body coverage and tattoo eligibility. Resolution does not perform ordinary re-selection, assemble final prompt prose, or call `completeGeneration()`.

Clothing compatibility helpers owned by Resolution may be called by Random Selection when an approved compatibility decision is required during assembly. Those helpers do not own Random weighting, decay, RNG, or lifetime behavior.

## Prompt Builder

`engine/prompt-building/` consumes the final Resolution result and deterministically converts it into structured positive-prompt sections plus one canonical prompt string. It does not select, randomize, default, repair, re-resolve, suppress, or complete a generation.

Canonical section order is:

1. Character
2. Clothing / Package
3. Footwear
4. Accessories
5. Location
6. Atmosphere
7. Time of Day
8. Camera
9. Effects

Catalog-owned `prompt` fields are authoritative wherever they exist. Package prompts are authoritative for Packages; Package-local components are not emitted. Character currently has no catalog prompt fields, so Prompt Building applies fixed deterministic formatting to active Character values while omitting Character Name as engine metadata. Character Features emit only their selected feature wording; placement-sensitive tattoo prompting remains deferred until active tattoo records exist and must use Resolution's `tattooVisibility` rather than recalculating coverage.

Multiple Accessories and Atmosphere selections are emitted in established catalog order. Camera controls and Effects controls are emitted in their established configuration order, with multi-select values emitted in catalog order. The first eight approved Camera defaults are positive generation instructions and therefore emit their authoritative prompts. Camera Spatial-Safe None, Effects None/default-empty states, user-selected None, and Resolution-suppressed Atmosphere states emit no positive prompt text.

Prompt fragments are whitespace-normalized, trailing separator punctuation is removed, and non-empty fragments are joined with `, `. Prompt Building does not deduplicate fragments or rewrite authoritative catalog wording. Its structured result preserves silent-state distinctions through omission metadata for user None, default None, and Resolution suppression.
