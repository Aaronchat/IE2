# Aspect Ratio

## Purpose

Aspect Ratio is an optional generation-format domain that tells the downstream image generator the desired image proportions.

## Catalog

The approved initial values are:

- 9:16
- 9:19.5

Both values have been manually tested successfully before implementation.

## Selection

Aspect Ratio is Manual-or-blank. No Random behavior, default ratio, compatibility rule, or Resolution transformation is approved.

When blank, Aspect Ratio is absent from Selection and contributes no prompt text.

## Resolution

Aspect Ratio passes through Resolution unchanged. It does not alter Camera, Framing, Covers / Presentation, or any other domain.

## Prompt Behavior

When selected, Aspect Ratio is the first canonical prompt section, before Character.

Approved prompt fragments are:

```text
9:16 aspect ratio
9:19.5 aspect ratio
```

## UI

Aspect Ratio is the first top-level selection category, before Character / Identity.

## Validation

Validation checks the exact two approved records, required prompt wording, and standard enabled/selection-weight metadata.
