# Effects

## Purpose

Effects is a separate visual-treatment domain. It describes optional imperfections applied to the resulting image rather than where the scene occurs, environmental Atmosphere, temporal context, or how the source image is framed.

Effects remains separate from Camera even though the user-facing Effects section is displayed beneath Camera in the UI.

## 2.1E User-Facing Control

Infinite Engine 2.1E exposes one Effects control:

1. Effects / Imperfections

The exhaustive selectable catalog lives in `data/effects/imperfections.js`.

## Effects / Imperfections

Effects / Imperfections contains:

- Grain
- Dust
- Scratches
- Light Leak
- Lens Flare
- Motion Blur
- Soft Focus
- Chromatic Aberration
- Film Gate
- Double Exposure
- Chemical Stains
- Fingerprints
- Torn Edges

Zero, one, or two Effects / Imperfections may be active. Two is the maximum.

None is the default control state, is exclusive with actual Effects selections, and contributes no Effects / Imperfections prompt wording. None is not catalog data.

Effects / Imperfections is manual-only in 2.1E. No Random weighting is approved.

## Film Age Compatibility

The previous Film Age catalog remains in the engine for backward compatibility with older saved or programmatic inputs, but it is no longer user-facing in 2.1E.

Photo Look now owns the normal photographic age and era recipe. A user selecting a 1970s Photo, Polaroid Photo, Disposable Camera Photo, or other period/capture look does not separately assemble Film Age.

The legacy Film Age default remains silent. An explicit legacy programmatic Film Age selection remains valid and may still contribute its authoritative prompt.

## Boundaries

Effects does not own environmental Atmosphere such as fog, mist, haze, smoke, rain, snow, dust/sand, steam, or ash.

Effects does not create a Lighting system. Natural Light Portrait, Flash Photography, and Harsh On-Camera Flash remain outside Effects.

Photographic capture identities and period recipes belong to Camera Photo Look rather than Effects.

Covers belong to the separate Covers / Presentation domain and are not Effects.

## Prompt Behavior

Effects contributes only active visual-treatment wording. None/default-empty states remain silent.

The current user-facing Effects / Imperfections selection emits after Camera in the canonical prompt order. Explicit legacy Film Age inputs remain compatible and emit in the established Effects order.

## Validation

Effects validation continues to cover the complete compatibility surface:

- 13 Effects / Imperfections records
- 7 legacy Film Age records
- 20 Effects records total
- approved group IDs and required group structure
- unique IDs, names, and prompts
- required non-empty record fields
- effective `enabled` and `selectionWeight`
- maximum two Effects / Imperfections selections
- maximum one legacy Film Age selection
- both engine controls default to silent None states
- None remains control state rather than catalog data
- Atmosphere catalog entries do not leak into Effects
- deferred Lighting candidates remain absent
- Cover concepts remain absent from Effects

UI exposure is intentionally narrower than engine compatibility: 2.1E exposes Effects / Imperfections only.
