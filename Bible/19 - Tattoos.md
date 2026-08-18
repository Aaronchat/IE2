# Tattoos

## Purpose

Tattoos is a repeatable body-detail module. A generation may contain zero, one, or multiple tattoos. Each tattoo is selected independently and preserves its own Placement, Size / Coverage Pattern, and Design.

Tattoos do not support Random in this initial implementation. Adding more tattoos does not create a shared style, placement, or compatibility state between them.

## Data

Selectable Tattoo data lives under `data/tattoos/`.

Each Placement owns its approved Size / Coverage Patterns. Each pattern declares the exact body-region entries that must remain fully uncovered for that tattoo to be prompt-eligible.

Initial placements cover Upper Chest, Abdomen, left/right Shoulder, left/right Arm, and left/right Leg. Arm placements support upper/lower small and large tattoos plus upper/lower half sleeves and full sleeves. Leg placements support upper/lower small and large tattoos plus upper/lower half-leg and full-leg patterns.

## Design

Design has two modes:

- Generic: selects one approved style record.
- Specific: accepts user-entered text.

Initial Generic styles are Traditional, Neo-Traditional, Japanese, Tribal, Blackwork, Fine-Line, Watercolor, Realism, Geometric, and Biomechanical.

Specific text is stored as user data rather than catalog data. Selection collapses repeated whitespace and rejects blank Specific designs.

## Selection

The public control shape is a repeatable `tattoos[]` array. Each element requires:

- `placementId`
- `patternId`
- `design`

Generic Design requires `styleId`. Specific Design requires `text`.

Selection validates that the Placement exists, the Size / Coverage Pattern belongs to that Placement, the Generic Style exists when used, and Specific text is non-empty. Tattoo order is preserved.

## Resolution

Resolution uses the existing `tattooVisibility` produced by final coverage resolution. It does not calculate body coverage again.

Every required body-region entry for a tattoo must have `allowed: true`. If even one required entry is covered or partially covered, that tattoo is omitted from prompt eligibility.

A blocked tattoo is never moved, substituted, or rerolled. Other tattoos in the same `tattoos[]` array resolve independently and may remain eligible.

The original selected tattoo list remains preserved in the resolved state. Resolution additionally records visible and omitted tattoos so Prompt Building does not have to infer coverage.

## Prompt Behavior

Tattoos is emitted immediately after Character and before Clothing / Package.

Prompt Building consumes only Resolution-approved visible tattoos. It must not inspect clothing coverage or `finalCoverage` itself.

Examples:

```text
a full watercolor tattoo sleeve on her left arm
a large "MBOTF" tattoo on her lower right arm
a small broken-heart tattoo on her abdomen
```

Multiple eligible tattoos emit in selected order as separate prompt fragments. Omitted tattoos emit no positive prompt text.

## UI

Tattoos is a repeatable top-level category after Character. The user may add or remove Tattoo entries. Each entry exposes Placement, contextual Size / Coverage Pattern, Design Type, and either Generic Style or Specific Design text.

## Validation

Tattoo validation checks unique Placement, Pattern, and Generic Style IDs; required names and prompt fields; allowed design modes; valid official body-region references and sides; non-empty required-region lists; and the approved initial Generic Style set.
