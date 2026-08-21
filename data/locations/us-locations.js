const location = (id, name, prompt, environment = "outdoor") => Object.freeze({ id, name, prompt, environment });

export const US_LOCATIONS = Object.freeze({
  id: "us-locations",
  name: "U.S. Locations",
  defaults: Object.freeze({ enabled: true, selectionWeight: 1 }),
  items: Object.freeze([
    location("texas-ranch", "Texas Ranch", "at a Texas ranch"),
    location("times-square", "Times Square", "in Times Square"),
    location("grand-canyon", "Grand Canyon", "at the Grand Canyon"),
    location("golden-gate-bridge", "Golden Gate Bridge", "at the Golden Gate Bridge"),
    location("crater-lake", "Crater Lake", "at Crater Lake"),
    location("white-sands", "White Sands", "at White Sands"),
    location("las-vegas-strip", "Las Vegas Strip", "on the Las Vegas Strip"),
    location("hollywood-boulevard", "Hollywood Boulevard", "on Hollywood Boulevard"),
    location("new-orleans-french-quarter", "New Orleans French Quarter", "in the French Quarter of New Orleans"),
    location("miami-south-beach", "Miami South Beach", "in South Beach, Miami"),
  ]),
});
