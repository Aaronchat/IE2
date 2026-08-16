# Clothing

## Purpose

Clothing is a data-driven system. Each selectable garment carries the information the engine needs to build coherent outfits, apply guided randomness, assemble prompts, and prevent conflicts with body details such as tattoos.

The number of clothing files is an organizational choice, not an engine limitation. Files may be divided into small, easy-to-edit groups such as `tank-tops.js`, `jeans.js`, `sundresses.js`, and `boots.js`. Adding or splitting files later must not require redesigning the clothing system.

## Organization

The planned data structure separates the major modules:

```text
data/
|-- clothing/
|   |-- tops/
|   |-- bottoms/
|   |-- dresses/
|   |-- one-piece/
|   |-- swimwear/
|   |-- hosiery/
|   |-- outerwear/
|   |-- sleepwear/
|   `-- lingerie/
|-- footwear/
|-- accessories/
`-- packages/
```

Complete outfits, uniforms, and costumes that prescribe multiple pieces belong to Packages. Footwear and Accessories remain independent modules.

## Clothing Records

Clothing uses controlled inheritance with no more than three levels:

```text
Group -> Garment -> Optional Variant
```

- A group contains only properties genuinely shared by that clothing family.
- A garment inherits its group defaults and stores its individual information.
- A variant may inherit from one existing garment and add or override specific details.
- Variant values override garment values. Garment values override group defaults.
- The engine resolves inherited information into one complete garment before selection or prompt generation.

Example:

```text
Tank Top group
`-- Fitted Tank Top
    `-- Metallica Tank Top variant
```

A future clothing record may know:

- Name and stable ID
- Prompt wording
- Category and family
- Clothing slot and layer
- Base garment, when it is a variant
- Coverage
- Temperature
- Season
- Formality
- Style
- Mood
- Theme affinity
- Compatibility exceptions
- Enabled state and random-selection weight

Temperature, Season, and Formality have approved controlled vocabularies in `data/vocabulary/`. Style is deferred and intentionally open-ended. Mood and Theme affinity are deferred. Deferred fields have no approved selectable values unless and until they are explicitly approved.

## Temperature

Temperature describes the general weather conditions in which a garment would conventionally be considered suitable. It is descriptive metadata that may support temperature-aware filtering or generation; it does not prohibit the garment from appearing under other temperature conditions.

- A garment may reference multiple temperature values.
- No exact Fahrenheit or Celsius boundaries are defined.
- Temperature does not represent season, current weather, body temperature, total outfit warmth, layering behavior, or a hard garment restriction.
- The official allowed values and their definitions live in `data/vocabulary/temperatures.js`.

## Season

Season describes the season or seasons with which a garment is conventionally suitable or associated. It may support garment filtering and provide seasonal context for other systems without defining those systems' behavior.

- A garment may reference multiple season values.
- There is no separate all-season value; referencing all four approved seasons represents that case.
- `autumn` is the canonical machine-readable term; no duplicate `fall` value is maintained.
- Season is separate from Temperature and Theme.
- Season does not itself define environmental behavior such as foliage, weather, or scenery.
- Season metadata is descriptive, not a restriction on whether a garment may appear.
- The official allowed values live in `data/vocabulary/seasons.js`.

## Formality

Formality describes a garment's conventional position on the social formality spectrum.

- A garment has one primary Formality value.
- The official allowed values and their definitions live in `data/vocabulary/formalities.js`.

## Style

Style is deferred and intentionally open-ended. No Style values are currently approved.

- Style should not be finalized before the Clothing catalog is sufficiently developed; useful values may emerge as actual garments are reviewed.
- Infinite Engine's Style vocabulary does not need to conform to an external fashion-industry definition of style. A future Style value may exist because it is a useful selectable or filterable category for Infinite Engine.
- Concepts discussed during design remain proposals unless explicitly approved and must not be treated as established Style values.
- Style may remain an evolving controlled vocabulary rather than requiring a permanently final list.

## Mood

Mood is deferred. No Mood definition, structure, or values are currently approved.

- Its eventual usefulness and purpose remain unresolved.
- Mood remains available for future development but has no current prompt or generation behavior.

## Theme Affinity

Theme affinity is deferred. No Theme Affinity definition, structure, or values are currently approved.

- Theme architecture remains reserved and unapproved.
- Theme Affinity must not be implemented by inventing or assuming Theme architecture.

## Coverage

Coverage is body-region data used for clothing assembly, layering, and safe placement of tattoos or other body details.

Each garment may mark a body region as:

- `Covered`: The garment covers the region.
- `Partially covered`: The garment covers some portion of the region.
- `Not listed`: The garment does not cover the region.

Garments record what they cover. The engine calculates what remains visible only after the complete outfit and all clothing layers have been assembled.

The official body-region vocabulary lives in `data/vocabulary/body-regions.js`. Actual garment coverage lives with each garment group in `data/clothing/`. Cross-engine tattoo behavior lives in `Bible/08 - Rules.md`.

## Validation

Clothing data is validated automatically by `engine/validation/clothing.js`. The current validator checks the Clothing catalog that is already approved without inventing future Clothing behavior.

It validates:

- The complete approved Clothing group set and unique group IDs.
- Unique garment IDs, plus non-empty garment names and prompt wording.
- Effective Category, Temperature, Season, Formality, Coverage, Enabled state, and selection weight after garment values override group defaults.
- Temperature, Season, Formality, and body-region references against their approved controlled vocabularies.
- Coverage structure, valid side usage, duplicate coverage entries, and conflicts between Covered and Partially Covered.
- Deferred Style, Mood, and Theme Affinity fields remain absent until those systems are approved.

Slot and Layer are not current validation requirements. Variant/inheritance validation is also deferred until the Variant data structure is explicitly approved.

## Manual Selection

Manual Clothing selection preserves the caller's explicit path and requested records. Built Outfit and Package remain structurally distinct. Explicit garment, Outerwear, Hosiery, and Lingerie choices are validated as catalog selections but are not rewritten for compatibility by Selection. Compatibility, final coverage, and other cross-garment consequences belong to Resolution. Random Clothing continues to use the approved Random subsystem and its Clothing-owned resolver hooks.

Approved resolver behavior:

- Random Swimwear first selects from the approved Swimwear catalog. A `one-piece` selection is complete. A `top` selection is completed with one Random Swimwear `bottom`; a `bottom` selection is completed with one Random Swimwear `top`. Specialty Swimwear follows each record's approved slot.
- Random Hosiery is eligible only with Dresses, Skirts, and Skorts. It is not Random-added to pants/jeans, shorts, One-Piece outfits, Swimwear, Sleepwear, or Packages. Manual Hosiery remains an explicit user selection.
- These compatibility decisions are Clothing-owned helpers that Random Selection may call; Random weighting, decay, RNG, and lifetime behavior remain owned by the Random subsystem.

## UI Selection and Omission

Clothing UI sections expose garment families as separate manual-selection menus under their parent Clothing section. For example, `Tops` contains separate menus for Tank Tops, Short Sleeve Tops, Blouses, and the other approved Top families instead of one combined scrolling selector.

At the Clothing-section level:

- `Random` selects from the full approved catalog for that Clothing section. Random is not duplicated on each garment-family menu.
- `None` means **leave that Clothing section unspecified in the positive prompt**. It does not mean nudity, removal of clothing, or a negative instruction.
- A manual selection within a garment family clears the parent section's Random/None mode and remains the explicit selection for that section.
- Tops and Bottoms may be specified independently. Either slot may be intentionally omitted with None while the other is selected or Random. Coverage is calculated only from garments that Infinite Engine actually selected or specified; omitted clothing is not assumed for tattoo-visibility calculations.
- Lingerie remains Manual-or-None and has no Random control.

The UI also provides one reset action that clears user selections/modes and restores established defaults. Collapsed parent sections display an indicator when a specific manual choice exists below them.
