# Covers / Presentation

## Purpose

Covers is an optional finished-artifact presentation domain. It takes the normally resolved Infinite Engine image concept and presents it as fictional media such as a novel cover, album cover, DVD cover, movie poster, or magazine cover.

Covers does not replace, suppress, or reinterpret Character, Clothing, Packages, Footwear, Accessories, Location, Atmosphere, Time of Day, Camera, Effects, or Themes. Camera remains active when Covers is selected.

## Blank, Manual, and Random

An untouched Covers section is absent from Selection and emits no prompt text. There is no default Cover Type. Blank and Random are different states.

Random always resolves concrete enabled catalog records. The word `Random` is never emitted as Covers prompt content.

## Initial Catalog

Cover Types:

- Novel
- Album
- DVD
- Movie Poster
- Magazine

Contextual Styles:

- Novel: Romance, Mystery, Horror
- Album: Metal, Rap, Yodeling
- DVD: Romance, Action, Horror
- Magazine: Men's Magazine, Home & Garden, Fitness, Sports Magazine, Hunting Magazine

Movie Poster has no approved initial Style catalog. No Movie Poster subtype is invented by this implementation.

Optional Era / Decade values are 1950s through 2020s by decade. Era may remain blank, resolve through Random, or be selected explicitly.

## Contextual Selection

Style eligibility follows the resolved Cover Type. Styles are never drawn from one global pool. A Novel cannot receive an Album, DVD, or Magazine Style.

Random Cover Type first resolves a concrete Cover Type. When that type has an approved Style group, it then resolves one concrete Style from that group. Movie Poster remains type-only because no Style values are approved.

An explicit Cover Type may leave Style blank, select an explicit valid Style, or choose Random Style. Era is independent and optional.

## Optional Text

Manual text fields are contextual and optional:

- Novel: Title, Author
- Album: Album Title, Artist / Band
- DVD: Movie Title, Tagline, Starring Name
- Movie Poster: Movie Title, Tagline, Starring Name
- Magazine: Magazine Name, Primary Headline

Blank fields tell the downstream image generator to invent the corresponding fictional text. Partial overrides are valid. Text belonging to one Cover Type is invalid under another Cover Type.

## Prompt Behavior

Prompt Building first assembles the existing normal prompt through Themes without changing its established order or comma-separated formatting.

When Covers is active, Prompt Building adds terminal punctuation to that normal prompt and appends one separate paragraph containing the Covers instruction.

Example:

```text
Emily, Caucasian, 19 years old, teal hair, blood-stained sweater dress, inside an ancient castle, at midday, captured with a Canon EOS R5.

Presented as a 1970s horror movie DVD cover, featuring a fictional movie title, a fictional tagline, and a fictional starring name.
```

When Covers is untouched, Prompt Building appends nothing and the original prompt string remains exactly unchanged.

## Boundaries

Covers passes through Resolution unchanged and creates no compatibility behavior. It does not disable Camera, expand Themes, create clothing or location requirements, or maintain giant catalogs of fictional titles, authors, artists, actors, reviews, headlines, or branding.

VHS Cover and additional Cover Types or Styles remain unapproved for the initial catalog.

## UI

Covers / Presentation is the final top-level UI category after Themes. Cover Type controls contextual Style and metadata visibility. Era remains independently optional.

## Validation

Covers validation checks the exact initial Type, Style, and Era catalogs; enabled records and weights; contextual Style mappings; absence of an invented Movie Poster Style catalog; contextual metadata fields; and separation of Random from catalog data.
