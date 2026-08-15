# Footwear

## Purpose

Footwear is an independent selectable data domain under `data/footwear/`. It is separate from ordinary Clothing, Accessories, and Packages while reusing the project's approved environmental metadata and body-coverage vocabulary.

## Organization

Footwear records are organized in group files. The currently approved groups are:

- Sneakers & Athletic Shoes
- Boots
- Flats & Classic Shoes
- Heels
- Sandals & Casual Shoes
- Gothic & Alternative Footwear

The number of Footwear files is organizational and does not define engine behavior.

## Records

Footwear uses the existing data-group shell:

```text
Group -> Footwear record
```

A Footwear group contains `id`, `name`, `defaults`, and `items`.

Current group defaults are:

- `enabled: true`
- `selectionWeight: 1`

A Footwear record uses:

- stable `id`
- `name`
- natural-language `prompt`
- `temperature`
- `season`
- one primary `formality`
- `coverage`

No Footwear variant layer is established at this time.

## Controlled Vocabulary

Temperature, Season, and Formality use only the approved values in `data/vocabulary/`.

Footwear does not currently define or assign Style, Mood, or Theme Affinity.

## Coverage

Footwear reuses the existing coverage structure exactly:

```js
coverage: {
  covered: [...],
  partiallyCovered: [...]
}
```

Coverage uses exact body-region IDs and side values from `data/vocabulary/body-regions.js`.

Both fully covered and partially covered Footwear regions block tattoo placement under `Bible/08 - Rules.md`.

Open or minimal footwear may still block an entire body region when the approved conservative coverage data marks that region covered.

## Prompt Behavior

Each Footwear record carries its own natural-language prompt. Prompt wording follows the established selectable-data convention and is not assembled from metadata fields.

## Selection Metadata

Every Footwear record resolves an effective boolean `enabled` value and a finite non-negative `selectionWeight` through its group defaults unless explicitly overridden by approved data.

## Validation

Footwear validation checks:

- approved group IDs
- unique Footwear record IDs
- required names and prompts
- Temperature, Season, and Formality vocabulary references
- effective `enabled` and `selectionWeight`
- valid body-region IDs and side values
- no side on body regions that do not support sides
- no duplicate coverage entries
- no identical region/side entry in both coverage buckets
- absence of deferred Style, Mood, and Theme Affinity fields

There is no central Footwear registry/index at this time. Loading and resolution may be designed later when engine behavior requires it.
