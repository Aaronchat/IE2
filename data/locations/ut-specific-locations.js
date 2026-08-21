const location = (id, name, prompt, environment) => Object.freeze({ id, name, prompt, environment });

export const UT_SPECIFIC_LOCATIONS = Object.freeze({
  id: "ut-specific-locations",
  name: "UT Specific Locations",
  defaults: Object.freeze({ enabled: true, selectionWeight: 1 }),
  items: Object.freeze([
    location("ut-tower", "UT Tower", "at the UT Tower on the University of Texas at Austin campus", "outdoor"),
    location("darrell-k-royal-texas-memorial-stadium", "Darrell K Royal-Texas Memorial Stadium", "at Darrell K Royal-Texas Memorial Stadium", "outdoor"),
    location("campbell-williams-field", "Campbell-Williams Field", "at Campbell-Williams Field", "outdoor"),
    location("moody-center", "Moody Center", "inside the Moody Center", "indoor"),
    location("ufcu-disch-falk-field", "UFCU Disch-Falk Field", "at UFCU Disch-Falk Field", "outdoor"),
    location("mike-a-myers-stadium", "Mike A. Myers Stadium", "at Mike A. Myers Stadium", "outdoor"),
    location("red-charline-mccombs-field", "Red and Charline McCombs Field", "at Red and Charline McCombs Field", "outdoor"),
    location("gregory-gymnasium", "Gregory Gymnasium", "inside Gregory Gymnasium", "indoor"),
    location("texas-tennis-center", "Texas Tennis Center", "at the Texas Tennis Center", "outdoor"),
    location("lee-joe-jamail-texas-swimming-center", "Lee and Joe Jamail Texas Swimming Center", "inside the Lee and Joe Jamail Texas Swimming Center", "indoor"),
    location("texas-rowing-center", "Texas Rowing Center", "at the Texas Rowing Center", "outdoor"),
    location("moncrief-neuhaus-athletic-center", "Moncrief-Neuhaus Athletic Center", "inside the Moncrief-Neuhaus Athletic Center", "indoor"),
    location("denius-fields", "Denius Fields", "at Denius Fields", "outdoor"),
    location("longhorns-football-locker-room", "Longhorns Football Locker Room", "in the Longhorns football locker room", "indoor"),
    location("longhorns-tailgate-area", "Longhorns Tailgate", "at a Longhorns tailgate", "outdoor"),
    location("longhorns-trophy-room", "Longhorns Trophy Room", "in the Longhorns trophy room", "indoor"),
    location("longhorns-indoor-football-practice-facility", "Longhorns Indoor Football Practice Facility", "inside the Longhorns indoor football practice facility", "indoor"),
  ]),
});
