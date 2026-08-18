export const NOVEL_COVER_STYLES = Object.freeze({
  id: "novel-styles",
  name: "Novel Style",
  defaults: Object.freeze({ enabled: true, selectionWeight: 1 }),
  items: Object.freeze([
    Object.freeze({ id: "romance", name: "Romance", prompt: "cheesy romance novel cover" }),
    Object.freeze({ id: "mystery", name: "Mystery", prompt: "mystery novel cover" }),
    Object.freeze({ id: "horror", name: "Horror", prompt: "horror novel cover" }),
  ]),
});

export const ALBUM_COVER_STYLES = Object.freeze({
  id: "album-styles",
  name: "Album Style",
  defaults: Object.freeze({ enabled: true, selectionWeight: 1 }),
  items: Object.freeze([
    Object.freeze({ id: "metal", name: "Metal", prompt: "heavy metal album cover" }),
    Object.freeze({ id: "rap", name: "Rap", prompt: "rap album cover" }),
    Object.freeze({ id: "yodeling", name: "Yodeling", prompt: "yodeling album cover" }),
  ]),
});

export const DVD_COVER_STYLES = Object.freeze({
  id: "dvd-styles",
  name: "DVD Style",
  defaults: Object.freeze({ enabled: true, selectionWeight: 1 }),
  items: Object.freeze([
    Object.freeze({ id: "romance", name: "Romance", prompt: "romance movie DVD cover" }),
    Object.freeze({ id: "action", name: "Action", prompt: "action movie DVD cover" }),
    Object.freeze({ id: "horror", name: "Horror", prompt: "horror movie DVD cover" }),
  ]),
});

export const MAGAZINE_COVER_STYLES = Object.freeze({
  id: "magazine-styles",
  name: "Magazine Style",
  defaults: Object.freeze({ enabled: true, selectionWeight: 1 }),
  items: Object.freeze([
    Object.freeze({ id: "mens-magazine", name: "Men's Magazine", prompt: "men's magazine cover" }),
    Object.freeze({ id: "home-garden", name: "Home & Garden", prompt: "home and garden magazine cover" }),
    Object.freeze({ id: "fitness", name: "Fitness", prompt: "fitness magazine cover" }),
  ]),
});

export const COVER_STYLE_GROUPS = Object.freeze([
  NOVEL_COVER_STYLES,
  ALBUM_COVER_STYLES,
  DVD_COVER_STYLES,
  MAGAZINE_COVER_STYLES,
]);
