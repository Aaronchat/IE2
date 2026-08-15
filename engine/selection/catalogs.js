import { FOOTWEAR_RANDOM_BUCKETS } from "./random/footwear.js";
import { ACCESSORY_RANDOM_BUCKETS } from "./random/accessories.js";
import { LOCATION_RANDOM_BUCKETS } from "./random/locations.js";
import { ATMOSPHERE_RANDOM_BUCKETS } from "./random/atmosphere.js";
import { PACKAGE_ORGANIZATIONAL_GROUPS } from "./random/packages.js";
import {
  TOP_RANDOM_BUCKETS, BOTTOM_RANDOM_BUCKETS, DRESS_RANDOM_BUCKETS,
  ONE_PIECE_RANDOM_BUCKETS, SLEEPWEAR_RANDOM_BUCKETS, SWIMWEAR_CATALOG_GROUPS,
  OUTERWEAR_RANDOM_BUCKETS, HOSIERY_CATALOG_GROUPS,
} from "./random/clothing.js";
import { UNDERWEAR_LINGERIE } from "../../data/clothing/lingerie/underwear-lingerie.js";
import { TIME_OF_DAY } from "../../data/time-of-day/time-of-day.js";
import { CAMERA_BODY } from "../../data/camera/camera-body.js";
import { CAPTURE_MEDIUM } from "../../data/camera/capture-medium.js";
import { LENS_LOOK } from "../../data/camera/lens-look.js";
import { FOCUS_DEPTH } from "../../data/camera/focus-depth.js";
import { FRAMING } from "../../data/camera/framing.js";
import { CAMERA_ANGLE } from "../../data/camera/camera-angle.js";
import { SUBJECT_VIEW } from "../../data/camera/subject-view.js";
import { VIEWER_POV } from "../../data/camera/viewer-pov.js";
import { SPATIAL_SAFE_FRAMING } from "../../data/camera/spatial-safe-framing.js";
import { EFFECTS_IMPERFECTIONS } from "../../data/effects/imperfections.js";
import { FILM_AGE } from "../../data/effects/film-age.js";

export const CATALOGS = Object.freeze({
  footwear: FOOTWEAR_RANDOM_BUCKETS,
  accessories: ACCESSORY_RANDOM_BUCKETS,
  locations: LOCATION_RANDOM_BUCKETS,
  atmosphere: ATMOSPHERE_RANDOM_BUCKETS,
  timeOfDay: Object.freeze([TIME_OF_DAY]),
  packages: PACKAGE_ORGANIZATIONAL_GROUPS,
  clothing: Object.freeze([
    ...TOP_RANDOM_BUCKETS, ...BOTTOM_RANDOM_BUCKETS, ...DRESS_RANDOM_BUCKETS,
    ...ONE_PIECE_RANDOM_BUCKETS, ...SLEEPWEAR_RANDOM_BUCKETS, ...SWIMWEAR_CATALOG_GROUPS,
    ...OUTERWEAR_RANDOM_BUCKETS, ...HOSIERY_CATALOG_GROUPS, UNDERWEAR_LINGERIE,
  ]),
  camera: Object.freeze({
    "camera-body": CAMERA_BODY, "capture-medium": CAPTURE_MEDIUM, "lens-look": LENS_LOOK,
    "focus-depth": FOCUS_DEPTH, framing: FRAMING, "camera-angle": CAMERA_ANGLE,
    "subject-view": SUBJECT_VIEW, "viewer-pov": VIEWER_POV,
    "spatial-safe-framing": SPATIAL_SAFE_FRAMING,
  }),
  effects: Object.freeze({ "effects-imperfections": EFFECTS_IMPERFECTIONS, "film-age": FILM_AGE }),
});
