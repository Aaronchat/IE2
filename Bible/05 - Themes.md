# Themes

## Purpose

Themes provide lightweight global creative context for the generated prompt. The downstream image generator interprets a Theme stack naturally alongside every other selected domain.

Themes do not control, override, map to, or impose requirements on Character, Clothing, Packages, Footwear, Accessories, Location, Atmosphere, Time of Day, Camera, Effects, or any other domain.

## Catalog

The initial catalog contains three organizational categories:

- Colors: Red, White, Pink, Hot Pink, Purple
- Holidays & Events: Christmas, Halloween, Easter, Valentine's Day, New Year's Eve, Fourth of July
- Genres & Aesthetics: Gothic, Western, Victorian, Noir, Psychedelic

Selectable records live under `data/themes/`. Each category contains `id`, `name`, `defaults`, and `items`. Every Theme record requires a stable `id`, display `name`, and authoritative compact `prompt`. Effective `enabled` and `selectionWeight` values follow the established catalog pattern.

Categories exist only to organize browsing and future catalog expansion. They do not affect compatibility, eligibility, meaning, weight, or dominance. Themes from the same category may be stacked.

## Selection

Themes support None, Manual, and Random.

None is an exclusive control state rather than catalog data. It produces no Theme prompt output.

Manual selection allows one, two, or three unique enabled Themes. Three is the maximum. Exact duplicate records are rejected, while any distinct combination is valid regardless of category.

Theme order defines no architectural dominance or priority.

## Random

Random selects unique enabled Themes from one flat pool. Categories are not Random buckets, and Random may select multiple Themes from the same category.

Approved stack-size odds are:

- one Theme: 50%
- two Themes: 40%
- three Themes: 10%

Individual Theme selection uses the shared seeded RNG, effective catalog weights, standard item decay, and lifetime counters. A Theme already chosen for the current stack is removed from that generation's remaining eligible pool.

## Resolution

Themes pass through Resolution unchanged. Resolution does not add compatibility checks, reorder domains based on Theme, alter other selections, or expand Themes into domain-specific instructions.

No Theme Affinity, domain mapping, mandatory thematic element, compatibility matrix, per-domain weighting, or primary/secondary/tertiary dominance system is implemented.

## Prompt Behavior

Theme is the final canonical positive-prompt section, after Effects. Active Theme prompt values are combined into one compact fragment beginning with `Theme:`.

Examples include:

```text
Theme: Christmas
Theme: red and white
Theme: Christmas and Halloween
Theme: Gothic Western Noir
```

Theme output contains no explanatory prose and does not generate Clothing, Location, or other domain instructions. None emits nothing.

## UI

Themes is the final top-level selector. Its three catalog categories are available for browsing, and the interface prevents a fourth structured manual selection. Random and None remain parent-level Theme actions.

Effects is displayed inside Camera immediately before Themes, but Camera and Effects retain separate data, Selection, Resolution, and prompt semantics.

## Validation

Theme validation checks the three approved categories and 16 initial records, stable unique IDs and names, required prompts, effective enabled/weight values, the maximum-three rule, None silence, the approved 50/40/10 Random stack-size policy, and the absence of unapproved record fields.
