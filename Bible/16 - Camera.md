# Camera

## Purpose

Camera controls how the generated image is notionally captured, framed, and viewed. Infinite Engine 2.1E deliberately presents Camera in plain photographic concepts instead of asking the user to assemble professional camera equipment.

Camera is separate from Character Gaze, Location, Atmosphere / Weather, Time of Day, Themes, Pose, Accessories, and Effects.

In the UI, Effects is displayed beneath Camera to keep related image-capture controls together. This is presentation only: Effects remains a separate domain with separate data and prompt semantics.

## 2.1E User-Facing Controls

Camera exposes six user-facing controls:

1. Photo Look
2. Framing
3. Camera Angle
4. Subject View
5. Viewer POV
6. Spatial-Safe Framing

The exhaustive selectable catalogs live in `data/camera/` rather than being duplicated here.

## Photo Look

Photo Look answers a simple question: what kind of photograph should this resemble?

Photo Look owns complete photographic recipes rather than making the user separately choose a camera body, capture medium, lens, and focus treatment. Those technical details may still appear inside an authoritative Photo Look prompt when useful.

The initial 2.1E Photo Look catalog contains 15 distinct looks. `Normal Photo` is the approved default. It represents a clean modern photorealistic photograph and should be appropriate for the large majority of ordinary generations.

Other Photo Looks deliberately create recognizable deviations such as professional portrait photography, glamour photography, candid snapshots, smartphone photography, selfie-stick photography, disposable-camera photographs, Polaroids, decade-specific film looks, vintage black-and-white photography, VHS/camcorder frames, security-camera footage, and paparazzi photography.

Photo Look is manual-only in 2.1E. No Random weighting is approved.

## Legacy Technical Camera Controls

The previous Camera Body / Capture Device, Capture Medium, Lens / Look, and Focus / Depth catalogs remain available to the engine only for backward compatibility with older saved or programmatic inputs.

They are no longer user-facing controls in 2.1E. Their legacy defaults do not contribute prompt text. An explicit manual legacy selection remains valid and may still contribute its authoritative prompt.

This compatibility path prevents the Camera overhaul from breaking older callers while moving technical photography behind the curtain.

## Normal Defaults

The visible normal Camera setup is:

- Photo Look: Normal Photo
- Framing: Full Body
- Camera Angle: no visible override
- Subject View: no visible override
- Viewer POV: no visible override
- Spatial-Safe Framing: None

Only Normal Photo and Full Body contribute positive Camera prompt wording when the user leaves Camera untouched.

The engine retains Eye-Level, Straight-On View, and Direct Portrait View as legacy internal defaults for compatibility, but Prompt Building suppresses those default-origin fragments. Explicit manual selections of those controls still emit.

## Framing

Framing contains the approved close-up through environmental-portrait choices. Full Body remains the approved default.

Framing directly controls how much of the Character and scene should appear and remains independent from Camera Angle, Subject View, and Viewer POV.

## Camera Angle and Subject View

Camera Angle describes vertical/angular capture orientation such as Eye-Level, Low Angle, High Angle, Dutch Angle, or Overhead View.

Subject View separately describes how the subject is presented relative to the viewer, such as Straight-On View, Three-Quarter View, or Side Profile.

Because these are separate controls, combinations such as Low Angle + Side Profile remain valid.

## Viewer POV

Viewer POV describes the perceived position, identity, context, or motion of the viewer.

Preset Viewer POV records remain available for recurring concepts such as direct portrait, observer, sports, crowd, paparazzi, and surveillance viewpoints.

### Custom POV

2.1E adds a free-text Custom POV field under Viewer POV.

Custom POV is intended for natural-language dynamic viewpoints that cannot reasonably be cataloged. The user may describe what the viewpoint entity is, where it is, and what it is doing relative to the Character.

Prompt Building wraps approved Custom POV text as:

```text
seen from the first-person viewpoint of [CUSTOM POV]; the viewpoint entity itself is not visible in the image
```

This preserves the first-person visual relationship while discouraging the generator from rendering the viewing entity itself in-frame.

A preset Viewer POV and Custom POV may not both be manually active. Custom POV is manual-only and its text is whitespace-normalized before use.

Custom POV may influence perspective, motion, trajectory, composition, and the Character's natural reaction. It does not move Character Gaze ownership into Camera.

## Viewer POV and Character Gaze

Character retains ownership of Gaze. Camera does not duplicate Looking at Camera or Looking Off-Camera as Camera records.

Gaze answers where the Character is looking. Viewer POV answers who or what is viewing the scene, from where, and potentially in what motion or relationship to the Character.

No Camera/Gaze compatibility matrix exists in 2.1E.

## Spatial-Safe Framing

Spatial-Safe Framing is Camera composition, not an Effect.

`None` is the default control state and contributes no Spatial-Safe prompt wording. It is not a Camera catalog record.

`Spatial Scene Safe` requests extra headroom, side margins, and surrounding composition space so the selected framing remains comfortably inside the image for later spatial/depth cropping.

Spatial Scene Safe stacks with normal Framing. It does not replace or weaken the selected Framing.

## Prompt Behavior

Prompt Building is active and authoritative.

Camera emits current user-facing selections in configuration order. Normal Photo and Full Body are the baseline positive Camera defaults. Legacy technical Camera defaults are silent, as are untouched legacy defaults for Camera Angle, Subject View, and Viewer POV.

Explicit manual legacy technical selections remain supported and emit normally for backward compatibility.

When Custom POV is active, its deterministic first-person wrapper is emitted after configured Camera fragments.

## Boundaries

Camera does not own:

- Character Gaze
- Location or Location Environment
- Atmosphere / Weather
- Time of Day
- Lighting
- Themes
- physical camera accessories
- Covers / finished-artifact formats

A physical camera appearing in an image remains an Accessories concept.

No active Lighting catalog is created by Camera 2.1E.

## Validation

Camera validation checks the ten engine Camera catalogs currently retained: the new Photo Look catalog, the five current composition/view controls, Spatial-Safe Framing, and the four legacy technical compatibility catalogs.

It verifies:

- 15 approved Photo Look records and Normal Photo as the Photo Look default
- 89 Camera records total across current and compatibility catalogs
- approved group IDs and required group structure
- unique record IDs, names, and prompts
- required non-empty record fields
- effective `enabled` and `selectionWeight`
- one-selection-per-catalog configuration
- Full Body remains the Framing default
- Spatial-Safe default None behavior
- Spatial Scene Safe exists exactly once
- Character Gaze values are not duplicated into Camera
- unapproved professional-simulation metadata remains absent

UI exposure is narrower than engine compatibility: 2.1E presents six Camera controls, not all ten retained catalogs.
