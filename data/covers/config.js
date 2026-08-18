const field = (id, label) => Object.freeze({ id, label });

export const COVERS_CONFIG = Object.freeze({
  styleGroupByType: Object.freeze({
    novel: "novel-styles",
    album: "album-styles",
    dvd: "dvd-styles",
    magazine: "magazine-styles",
  }),
  randomTypeResolvesStyle: true,
  metadataFieldsByType: Object.freeze({
    novel: Object.freeze([field("title", "Title"), field("author", "Author")]),
    album: Object.freeze([field("album-title", "Album Title"), field("artist-band", "Artist / Band")]),
    dvd: Object.freeze([
      field("movie-title", "Movie Title"),
      field("tagline", "Tagline"),
      field("starring-name", "Starring Name"),
    ]),
    "movie-poster": Object.freeze([
      field("movie-title", "Movie Title"),
      field("tagline", "Tagline"),
      field("starring-name", "Starring Name"),
    ]),
    magazine: Object.freeze([field("magazine-name", "Magazine Name"), field("primary-headline", "Primary Headline")]),
  }),
});
