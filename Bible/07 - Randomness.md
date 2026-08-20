# Randomness

## Purpose

Randomness is a modular selection system. Each domain owns its own Random eligibility, bucket behavior, weighting policy, decay strength, recovery rate, and special exclusions.

There is no requirement for every selectable domain to support Random.

Camera and Effects do not support Random. Their existing defaults and explicit controls remain authoritative.

Themes support Random under the approved Theme-specific policy below.

## Runtime State

Random catalog records remain static.

Temporary decay state and lifetime selection counters live only in runtime Random state under `engine/selection/random/`. They are never written into catalog records.

Stable catalog record IDs are used when available. Character v1 stores many approved choices as strings rather than ID-bearing records, so Character Random uses runtime-only namespaced keys derived from the existing approved values, such as:

```text
character:hair-color:natural:black
character:name:caucasian:emily
character:gaze:looking-at-camera
```

This does not modify Character catalog data.

Lifetime counters are observational only. They do not automatically change probability. They exist so later audits can identify imbalance and allow deliberate base-weight changes.

When a temporary decay entry recovers to 100% strength, it may be discarded.

## Seeded Randomness

Random selection uses a shared seedable RNG primitive. Domain selectors do not scatter independent `Math.random()` calls.

Seeded runs allow tests and unusual generations to be reproduced.

## Standard Individual Decay

Unless a module has an approved exception, eligible individual records begin at equal effective base strength.

After selection:

```text
100 -> 25
```

Recovery after each completed generation:

```text
25 -> 30 -> 35 -> 40 -> ... -> 100
```

Recovery is +5 percentage points per completed generation and occurs even if another domain or bucket was selected during that generation.

Repeats remain possible; decay discourages them rather than banning them.

Existing `enabled` and `selectionWeight` metadata remains available to the selection primitive. Current approved catalogs use equal selection weights unless a module policy below explicitly supplies a different base weight.

## Standard Equal-Bucket Decay

Where Random uses equal buckets:

1. choose the bucket
2. choose the individual option from that bucket

Bucket decay is separate from individual decay. Raw record count inside a bucket does not make the bucket more likely.

For ordinary equal buckets, the rotation step is based on the number of sibling buckets:

```text
step = 100 / sibling bucket count
```

The selected bucket drops to that step and recovers by the same step after each completed generation.

Examples:

Four buckets:

```text
25 -> 50 -> 75 -> 100
```

Three buckets:

```text
33.333... -> 66.666... -> 100
```

Two buckets:

```text
50 -> 100
```

Module-specific exceptions override this standard when explicitly approved.

## Locations

Location Random uses the four existing top-level Location groups as equal buckets:

- General Locations
- Named Landmarks & Destinations
- Named UT Sports Locations
- Event / Scene Locations

Bucket decay:

```text
25 -> 50 -> 75 -> 100
```

Individual Locations use standard 25 / +5 decay and lifetime counters.

## Atmosphere

Atmosphere Random uses the existing top-level groups:

- Clear
- Wind
- Non-Clear

The three buckets begin equally weighted.

Selected bucket recovery follows:

```text
33.333... -> 66.666... -> 100
```

Individual Atmosphere records use standard 25 / +5 decay.

Existing Atmosphere compatibility remains authoritative. When two Atmosphere records are requested, the eligible pool is rebuilt after the first selection. Clear versus Non-Clear restrictions, Wind + Wind prohibition, same-phenomenon-group prohibition, maximum selection count, Indoor -> None behavior, and Rainy Neon Alley restrictions remain owned by the existing Atmosphere configuration.

Random does not invent a separate chance for Atmosphere None. A caller may request zero, one, or two Atmosphere records according to the existing Atmosphere control state.

## Time of Day

Time of Day uses two Random buckets.

Bright base weight: 80

Bright entries:

- Sunrise
- Early Morning
- Morning
- Late Morning
- Midday
- Afternoon
- Golden Hour
- Sunset

When Bright is selected, its bucket strength drops to 90% and recovers +5 points per completed generation.

Dark base weight: 20

Dark entries:

- Blue Hour
- Evening
- Night
- Late Night
- Midnight

When Dark is selected, its bucket strength drops to 25% and recovers +10 points per completed generation.

Individual Time-of-Day records use standard 25 / +5 decay.

## Character

Character Random works control-by-control. Random remains a control state and is not inserted into Character catalog data.

### Ethnicity

Random Ethnicity uses equal eligible weights and standard individual decay.

`Black` remains manually selectable but is excluded from the current Random Ethnicity pool. The catalog option is not deleted or disabled.

### Name

Name Random depends on the already-resolved Ethnicity. Only names belonging to that ethnicity are eligible.

Names use equal base weight, standard decay, and runtime namespaced keys.

### Hair Color

Primary Hair Color uses the Natural and Fantasy families as equal buckets. Family selection occurs before individual color selection.

Family buckets use standard equal-bucket decay. Individual colors use standard individual decay.

Secondary Hair Color and Hair Color Treatment are manual-only in 2.1D. No Random activation chance or treatment weighting is approved, so Random does not invent multicolor Hair.

### Hair Style

Hair Style uses the approved complete-style families as equal buckets. Family selection occurs before individual style selection.

Complete styles may already encode length and texture, such as `Long Wavy Hair`. Hair Length and Hair Texture are no longer user-facing or Random controls. A hidden manual Hair Length compatibility path remains only so older saved/programmatic inputs do not break.

Family buckets use standard equal-bucket decay. Individual styles use standard individual decay.

### Direct Individual Character Controls

These use equal base weights and standard individual decay:

- Eye Color
- Makeup
- Build
- Chest Description
- Hip Width
- Waist
- Skin Tone
- Expression
- Gaze

Current Makeup Accents are not active Character data and are not part of Random.

### Chest Adjective

Random Chest Adjective supports these possible outcomes:

- no adjective
- Very
- Extremely
- Hyper
- Ultra

The exact base weighting between no adjective and the actual adjective options is not approved.

The implementation therefore requires an explicit weight configuration before Chest Adjective Random can execute. It does not invent a default.

Actual adjective selections may use standard individual decay. No adjective is represented only as a runtime outcome, not as Character catalog data.

### Freckles

Freckles uses a rare-biased Random policy:

- No Freckles / `Off`: base weight 85
- Freckles present: base weight 15

If Freckles is selected, the Freckles-presence strength drops to 10% and recovers +5 points per completed generation.

Within the Freckles-present outcome, the existing Light, Moderate, and Heavy choices begin equally weighted and use standard individual decay.

### Character Features

Character Features do not support Random in v1.

Fox Ears and Fox Tail remain manually selectable.

## Clothing

Clothing Random chooses between two primary paths.

### Primary Path

Built Outfit:

- base weight 75
- selected strength 90
- recovery +5 per completed generation

Package:

- base weight 25
- selected strength 25
- recovery +5 per completed generation

The base weights remain 75 / 25 while temporary strength acts as the modular decay multiplier.

### Built Outfit Structure

Built Outfit uses five equal base structures:

1. Top + Bottom
2. Dress
3. One-Piece
4. Swimwear
5. Sleepwear

Each structure begins at equal 20% base weight.

Selected structure decay is the explicitly approved exception:

```text
25 -> 50 -> 75 -> 100
```

Lifetime structure counters are retained.

### Top + Bottom

Top and Bottom each choose their existing garment-family bucket first, then an individual garment.

### Dress

Dress chooses one existing Dress family bucket, then one Dress.

### One-Piece

One-Piece chooses one existing One-Piece family bucket, then one item.

### Sleepwear

Sleepwear chooses from the existing Sleepwear groups.

Lingerie is excluded from Random and remains manually selectable.

### Swimwear

Random does not invent assembly rules for mixed one-piece, two-piece, set, and specialty Swimwear data.

Swimwear Random delegates assembly to a Clothing-owned `swimwearResolver` hook. The hook receives the existing Swimwear catalog groups and Random selection helpers so future approved Clothing assembly logic can preserve bucket and item decay without placing compatibility rules inside Random.

Until that Clothing-owned resolver exists, attempting to execute Swimwear Random without the hook is an explicit error rather than a guessed outfit.

### Garment Selection

Existing garment-family groups are equal-weight Random buckets unless later approved otherwise.

Individual garments use standard 25 / +5 decay and lifetime counters.

Random Clothing v1 selects garments only. It does not randomize color, material, condition, or future customization properties.

### Outerwear

Outerwear is optional rather than a Built Outfit structure.

Base activation:

- No Outerwear: 85
- Outerwear: 15

No additional activation decay was approved.

When active, existing Outerwear groups are equal buckets and selected garments use standard individual decay.

### Hosiery

Hosiery Random is conditional on the already-resolved outfit.

Random does not own the garment compatibility table. A Clothing-owned `hosieryEligibilityResolver` hook determines which existing Hosiery groups, if any, are eligible for the resolved outfit.

The Random module does not invent an activation probability for Hosiery. Its Hosiery selector is used only after the owning Clothing workflow decides Hosiery should be considered.

## Footwear

When Footwear is Random-selected, existing Footwear categories are equal buckets.

Choose category first, then individual Footwear.

Bucket decay uses standard equal-bucket rotation. Individual Footwear uses standard 25 / +5 decay and lifetime counters.

Random does not add outfit or Location compatibility gating.

## Accessories

Random Accessories supports at most two Accessories.

Count odds:

- 0 Accessories: 25
- 1 Accessory: 50
- 2 Accessories: 25

Accessory categories are equal buckets.

If two Accessories are selected, the first selected category is removed from eligibility before the second category draw. Two random Accessories therefore come from different categories.

Individual Accessories use standard 25 / +5 decay and lifetime counters.

## Packages

Package Random uses one flat pool.

The existing Package groups remain organizational and are not Random buckets.

All eligible Packages begin equally weighted. Selected Packages use standard 25 / +5 decay and lifetime counters.

## Tattoos

Tattoos Random is clothing-aware. Clothing is selected first, and Tattoos reuses the existing coverage resolver only to determine which approved Random tattoo areas are fully uncovered. Covered or partially covered areas are never selected as Random candidates.

The approved Random candidate areas are upper/lower left arm, upper/lower right arm, upper abdomen, lower abdomen, upper/lower left leg, and upper/lower right leg. Upper and lower abdomen each require both left and right sides of that body region to be uncovered.

Area-count selection is equal among the approved choices available for the number of exposed areas:

- one exposed area -> one area
- two exposed areas -> one or two areas
- three exposed areas -> one, two, or three areas
- four or more exposed areas -> one, two, three, or All exposed areas

Each chosen area then chooses Large or Small with equal probability. Large produces exactly one tattoo. Small chooses one, two, or three tattoos with equal probability.

Random Tattoos use Generic styles only. Generic styles use standard individual 25 / +5 decay and lifetime counters. Specific design text remains Manual-only.

## Themes

Theme Random uses one flat pool across all Theme categories. Categories remain organizational and are not Random buckets.

Stack-size odds:

- 1 Theme: 50%
- 2 Themes: 40%
- 3 Themes: 10%

Only unique enabled Themes may appear in a generated stack. After each Theme is chosen, that exact record is removed from the remaining pool for the current generation. Multiple Themes from the same category remain eligible.

Individual Themes use effective catalog weights, standard 25 / +5 item decay, lifetime counters, and the shared seeded RNG. Theme Random adds no cross-domain compatibility or interpretation.

## Covers / Presentation

Covers Random is contextual and hierarchical.

Random Cover Type selects one enabled record from the Cover Type group. When the resolved type has an approved Style group, Random Cover Type then selects one enabled record only from that contextual group. Movie Poster has no approved initial Style group and therefore resolves without a Style.

For an explicit Cover Type, Random Style selects only from that type's approved Style group. Styles are never selected from one global cross-type pool.

Random Era selects one enabled decade from the Era group only when the user explicitly chooses Random Era. A blank Era remains blank.

Cover Types, Styles, and Eras use effective catalog weights, standard 25 / +5 item decay, lifetime counters, and the shared seeded RNG. Random always resolves concrete records and never emits the word Random.

## Unsupported and Reserved Domains

Camera has no Random system.

Effects has no Random system.

Character Features have no Random system.

Lingerie is excluded from Random.

Story Elements remain Reserved and have no Random architecture.

## Completion Boundary

Decay recovery occurs once per completed generation through the shared runtime state. Calling a domain selector does not itself mark a generation complete because a single generation may use multiple Random-enabled domains.

The Generation Orchestrator is the generation owner. A generation is complete when Selection, Resolution, and Prompt Building all succeed and the final prompt has been constructed. The orchestrator then calls runtime-state completion automatically exactly once.

A failed Selection, Resolution, or Prompt Building step does not advance recovery. There is no manual caller-facing completion step and no hidden global Random state. Infinite Engine owns prompt generation only; external image generation is outside this lifecycle.

## Validation and Tests

Random-specific tests verify:

- deterministic seeded RNG behavior
- weighted selection
- item and bucket decay
- recovery and deletion of fully recovered temporary state
- lifetime counters remaining observational
- Location and Atmosphere bucket behavior
- Atmosphere compatibility and eligible-pool rebuilding
- Time-of-Day Bright/Dark policy
- Character exclusions and namespaced runtime keys
- unresolved Chest Adjective weights fail closed
- Lingerie and Character Features remain Random-excluded
- Swimwear and Hosiery require Clothing-owned hooks
- Footwear category-first selection
- Accessory 0/1/2 odds structure and two-category exclusion
- Packages use a flat pool
- Themes use approved 50/40/10 stack-size odds and a flat unique-record pool
- Covers uses contextual Type -> Style Random resolution with optional independent Era Random
- Camera and Effects receive no Random selector
- catalog files do not acquire runtime counter or decay fields

Existing domain validators remain authoritative for their catalogs.