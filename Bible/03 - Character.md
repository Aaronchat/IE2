# Character

## Purpose

Character data defines the currently approved selectable Character choices under `data/character/`. Character data is intentionally basic and does not use Clothing metadata such as Temperature, Season, Formality, or Coverage.

`Random` and `None` are not Character data options. Random selection behavior belongs to the Randomness and application systems.

## Identity

Names are organized by approved ethnicity groups in `data/character/names.js`.

- Caucasian is the current default ethnicity group.
- The current approved data contains six ethnicity groups and 150 names.

## Appearance

### Skin

Active Skin settings are:

- Skin Tone
- Freckles
- Condition, a manual multi-select that also supports Random for one surface/body condition

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

Character Features is active and manual multi-select. Random selects one approved Character Feature. The approved choices are stored in `data/character/character-features.js`; multiple manually selected approved features may coexist in one Character prompt.

## Physical Appearance

Active Physical Appearance settings are:

- Build
- Chest
- Hip Width
- Waist
- Pregnancy

Chest consists of a Chest Description with an optional Adjective. Absence of an adjective means the description is used unmodified; there is no `None` adjective option. No additional combination or compatibility rules are currently approved.

Pregnancy is an optional Physical Appearance setting. The currently approved value is `Very Pregnant`; leaving the control blank adds no pregnancy description.

Abdomen remains Reserved.

## Validation

`engine/validation/character.js` validates the approved Character data structure, required arrays/objects, and accidental duplicate active options. It does not define compatibility or random-selection behavior.

## Selection

Character selection resolves Ethnicity before Name because Random Name depends on the selected Ethnicity. Caucasian remains the approved default Ethnicity. Skin Condition and Character Features remain manual multi-select controls, while each also supports a Random mode that chooses one approved item. Pregnancy is selected separately under Physical Appearance.
