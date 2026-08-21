# Character

## Purpose

Character data defines the currently approved selectable Character choices under `data/character/`. Character data is intentionally basic and does not use Clothing metadata such as Temperature, Season, Formality, or Coverage.

Random-selection behavior is not implemented here. `Random` and `None` are not Character data options; future selection and UI behavior belong to the Randomness and application systems.

## Identity

Names are organized by approved ethnicity groups in `data/character/names.js`.

- Caucasian is the current default ethnicity group.
- The current approved data contains six ethnicity groups and 150 names.

## Appearance

### Skin

Active Skin settings are:

- Skin Tone
- Freckles
- Condition, a manual multi-select for surface/body conditions

Beauty Mark, Scars, and Birthmarks remain deferred for future design.

### Hair

Active Hair settings are:

- Hair Color, organized as Natural and Fantasy
- Hair Length
- Hair Texture
- Hair Style, organized as Loose/Down, Short, Ponytails, Buns, Braids, and Alternative

### Eyes

Eye Color is active.

### Expression and Gaze

Expression is active.

Gaze is an active Character setting with the currently approved choices stored in `data/character/expression.js`.

### Makeup

Makeup is active.

Makeup Accents remain future/optional. Eyeliner, Winged Eyeliner, Red Lipstick, Glossy Lips, and Glitter are not active Character data and have no approved combination behavior.

### Character Features

Character Features is active, expandable, and manual multi-select. The approved choices are stored in `data/character/character-features.js`; multiple approved features may coexist in one Character prompt.

## Physical Appearance

Active Physical Appearance settings are:

- Build
- Chest
- Hip Width
- Waist

Chest consists of a Chest Description with an optional Adjective. Absence of an adjective means the description is used unmodified; there is no `None` adjective option. No additional combination or compatibility rules are currently approved.

Abdomen remains Reserved.

## Future Modules

Pregnancy remains Future.

## Validation

`engine/validation/character.js` validates the approved Character data structure, required arrays/objects, and accidental duplicate active options. It does not define compatibility, random-selection behavior, or requirements for deferred Character features.

## Selection

Character selection resolves Ethnicity before Name because Random Name depends on the selected Ethnicity. Caucasian remains the approved default Ethnicity. Skin Condition and Character Features are manual multi-select controls. Their selected values coexist in the generated Character prompt, subject only to the approved data lists and each control's configured maximum.
