# Accessories

## Purpose

Accessories are an independent selectable data domain under `data/accessories/`. They are separate from ordinary Clothing, Footwear, and Packages while reusing the project's approved environmental metadata and body-coverage vocabulary.

## Organization

Accessories records are organized in group files. The currently approved groups are:

- Eyewear
- Earrings
- Chokers
- Necklaces
- Headwear
- Hair Accessories
- Scarves & Wraps
- Bracelets & Watches
- Rings
- Anklets
- Body Chains & Harnesses
- Bags
- Belts
- Gloves
- Themed Props

The number of Accessories files is organizational and does not define engine behavior.

## Records

Accessories use the existing independent-data group shell:

```text
Group -> Accessory record
```

An Accessories group contains `id`, `name`, `defaults`, and `items`.

Current group defaults are:

- `enabled: true`
- `selectionWeight: 1`

An Accessory record uses:

- stable `id`
- `name`
- natural-language `prompt`
- `temperature`
- `season`
- one primary `formality`
- `coverage`

No Accessories variant layer is established at this time.

## Controlled Vocabulary

Temperature, Season, and Formality use only the approved values in `data/vocabulary/`.

Accessories do not currently define or assign Style, Mood, or Theme Affinity.

## Coverage

Accessories reuse the existing coverage structure exactly:

```js
coverage: {
  covered: [...],
  partiallyCovered: [...]
}
```

Coverage uses exact body-region IDs and side values from `data/vocabulary/body-regions.js`.

Both fully covered and partially covered Accessory regions block tattoo placement under `Bible/08 - Rules.md`. An Accessory may have empty coverage when it does not correspond to an approved body region. No new body region is created solely to describe an Accessory.

## Prompt Behavior

Each Accessory record carries its own natural-language prompt. Prompt wording follows the established selectable-data convention and is not assembled from metadata fields.

## Selection Metadata

Every Accessory record resolves an effective boolean `enabled` value and a finite non-negative `selectionWeight` through its group defaults unless explicitly overridden by approved data.

## Validation

Accessories validation checks:

- approved group IDs
- unique Accessory record IDs
- required names and prompts
- Temperature, Season, and Formality vocabulary references
- effective `enabled` and `selectionWeight`
- valid body-region IDs and side values
- no side on body regions that do not support sides
- no duplicate coverage entries
- no identical region/side entry in both coverage buckets
- absence of deferred Style, Mood, and Theme Affinity fields

There is no central Accessories registry/index at this time. Loading and resolution may be designed later when engine behavior requires it.

## Selection Limit

Manual Accessories selection allows a maximum of two Accessories. Random Accessories retains its separately approved 0/1/2 count weighting and Random bucket behavior.
