export const COVER_TYPES = Object.freeze({
  id: "cover-types",
  name: "Cover Type",
  defaults: Object.freeze({ enabled: true, selectionWeight: 1 }),
  items: Object.freeze([
    Object.freeze({ id: "novel", name: "Novel", prompt: "novel cover" }),
    Object.freeze({ id: "album", name: "Album", prompt: "album cover" }),
    Object.freeze({ id: "dvd", name: "DVD", prompt: "movie DVD cover" }),
    Object.freeze({ id: "movie-poster", name: "Movie Poster", prompt: "movie poster" }),
    Object.freeze({ id: "magazine", name: "Magazine", prompt: "magazine cover" }),
  ]),
});
