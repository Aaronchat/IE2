# Packages

## Purpose

Packages represent complete outfits, uniforms, costumes, and other coordinated looks that should be selected as one unit rather than assembled as ordinary independent Clothing records.

Selectable Package data lives in `data/packages/`. Package records are organized into group files such as Sci-Fi, Historical, Athletic, Occupations, Costumes, and Cultural. Diner Waitress Outfit is an approved Occupations Package because it represents a coordinated complete outfit rather than one ordinary garment.

## Inheritance

Packages use one inheritance level:

```text
Group -> Package
```

Group defaults currently provide:

- `enabled: true`
- `selectionWeight: 1`

A Package may override those values when explicitly approved. Package variants are deferred.

## Package Records

A Package record uses:

- stable `id`
- `name`
- authoritative `prompt`
- `temperature`
- `season`
- primary `formality`
- `coverage`
- optional Package-local `components` only where explicitly required

Temperature, Season, and Formality use the existing approved controlled vocabularies in `data/vocabulary/`.

Style, Mood, and Theme Affinity are excluded and remain deferred.

## Coverage

Packages reuse the Clothing coverage structure:

```js
coverage: {
  covered: [...],
  partiallyCovered: [...]
}
```

Coverage uses the official body-region IDs from `data/vocabulary/body-regions.js`.

Package-level coverage is authoritative for the completed Package. Both covered and partially covered regions block tattoo placement under `Bible/08 - Rules.md`.

## Components

Components are Package-local descriptive objects:

```js
{ id, name }
```

They are not references to Clothing, Footwear, or Accessory records. Component IDs need only be unique within their Package.

Components do not currently carry their own coverage or prompt fields. Package-level coverage and the Package prompt remain authoritative.

## Prompt Behavior

Every Package has its own required prompt. The Package prompt is authoritative and is not automatically built by concatenating component names.

Unless an explicitly approved Package needs different wording, the prompt follows the established project convention of using the Package name as a natural prompt phrase.

## Selection Metadata

Every Package resolves an effective boolean `enabled` value and a finite non-negative numeric `selectionWeight`.

## Validation

Package validation checks:

- approved group IDs
- unique Package IDs
- required Package names and prompts
- Temperature, Season, and Formality vocabulary references
- effective `enabled` and `selectionWeight`
- valid body-region IDs and side values
- no side on regions that do not support sides
- no duplicate coverage entries
- no identical region/side entry in both coverage buckets
- valid component IDs and names
- component IDs unique within each Package

Validation does not add rules for deferred features.

## Registry

There is no central Package registry or index at this time. Package loading and resolution may be designed later when engine behavior requires it.
