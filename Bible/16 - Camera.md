# Camera

## Purpose

Camera controls how the generated image is notionally captured, framed, and viewed. Camera v1 is intentionally simple: it provides useful image-generation prompt language without becoming a professional camera simulator.

Camera is separate from Character Gaze, Location, Atmosphere / Weather, Time of Day, Themes, Pose, and Accessories.

In the UI, Effects sections are displayed beneath Camera to keep related image-capture controls together. This is presentation only: Effects remains a separate domain with separate data and prompt semantics.

## Controls

Camera v1 contains nine independent controls:

1. Camera Body / Capture Device
2. Capture Medium
3. Lens / Look
4. Focus / Depth
5. Framing
6. Camera Angle
7. Subject View
8. Viewer POV
9. Spatial-Safe Framing

Each control may contribute prompt wording together with the others.

The exhaustive selectable catalogs live in `data/camera/` rather than being duplicated here.

## Records

Camera controls use the established independent-data group shell:

```text
Group -> Camera record
```

Each group contains `id`, `name`, `defaults`, and `items`. Current group defaults are:

- `enabled: true`
- `selectionWeight: 1`

Each Camera record requires:

- stable `id`
- display `name`
- authoritative natural-language `prompt`

Camera records do not carry professional simulation metadata such as sensor size, aperture, f-stop, camera-height mathematics, pitch calculations, or focal-distance calculations.

## Normal Defaults

The approved normal Camera setup is:

- Camera Body / Capture Device: Canon EOS R5
- Capture Medium: Digital
- Lens / Look: 50mm Standard
- Focus / Depth: Balanced Focus
- Framing: Full Body
- Camera Angle: Eye-Level
- Subject View: Straight-On View
- Viewer POV: Direct Portrait View
- Spatial-Safe Framing: None

The first eight controls therefore have an approved default record. Spatial-Safe Framing defaults to None.

Selecting another option in a one-selection control replaces that control's default.

## Selection

Camera Body / Capture Device, Capture Medium, Lens / Look, Focus / Depth, Framing, Camera Angle, Subject View, and Viewer POV each allow exactly one active selection.

Spatial-Safe Framing allows either None or Spatial Scene Safe.

Camera v1 does not use a large compatibility matrix. Unusual photographic combinations remain valid unless a specific contradiction is separately approved.

## Framing

Framing contains:

- Extreme Close-Up
- Close-Up
- Head Shot
- Bust Portrait
- Waist-Up
- Three-Quarter Body
- Full Body
- Environmental Portrait

Full Body is the approved default.

Half Body is not an approved Framing record.

## Camera Angle and Subject View

Camera Angle describes vertical/angular capture orientation such as Eye-Level, Low Angle, High Angle, Dutch Angle, or Overhead View.

Subject View separately describes how the subject is presented relative to the viewer:

- Straight-On View
- Three-Quarter View
- Side Profile

Because these are separate controls, combinations such as Low Angle + Side Profile are valid.

Eye-Level is the approved Camera Angle default.

## Viewer POV and Character Gaze

Viewer POV describes the perceived position or context of the viewer/photographer.

Character retains ownership of Gaze. Camera does not duplicate:

- Looking at camera
- Looking off-camera

Gaze answers where the Character is looking. Camera answers how and from where the image is captured or viewed.

No Camera/Gaze compatibility matrix exists in v1.

## Spatial-Safe Framing

Spatial-Safe Framing is Camera composition, not an Effect.

`None` is the default control state and contributes no Spatial-Safe prompt wording. It is not a Camera catalog record.

`Spatial Scene Safe` requests extra headroom, side margins, and surrounding composition space so the selected framing remains comfortably inside the image for later spatial/depth cropping.

Spatial Scene Safe stacks with normal Framing. It does not replace or weaken the selected Framing. Full Body + Spatial Scene Safe must still preserve the full subject while adding extra composition room.

There is no Apple/iPhone-specific runtime integration.

## Prompt Behavior

Camera data exists to contribute clean image-generation prompt language. Record prompts are authoritative and category-appropriate rather than mechanically generated from display labels.

A future prompt builder may combine selected Camera prompts naturally. Camera v1 does not implement a prompt-building engine.

## Boundaries

Camera does not own:

- Character Gaze
- Location or Location Environment
- Atmosphere / Weather
- Time of Day
- Lighting
- Themes
- physical Camera accessories
- Covers / finished-artifact formats, which are owned by the separate active Covers domain

A physical camera appearing in an image remains an Accessories concept.

No active Lighting catalog is created by Camera v1.

## Validation

Camera validation checks:

- exactly nine approved Camera controls
- exact record counts per control and 74 Camera records total
- approved group IDs and required group structure
- unique record IDs, names, and prompts
- required non-empty record fields
- effective `enabled` and `selectionWeight`
- one-selection-per-control configuration
- the approved normal Camera defaults
- Full Body and Eye-Level defaults
- Spatial-Safe default None behavior
- Spatial Scene Safe exists exactly once
- Half Body, Realistic Photograph, and Clean Digital Image remain absent
- Character Gaze values are not duplicated into Camera
- unapproved cross-system Camera metadata remains absent

The validator does not add professional camera simulation or a compatibility matrix.
