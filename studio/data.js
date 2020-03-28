const fs = require("fs");
const data = JSON.parse(fs.readFileSync("covidsverige0328.json"));
const coordinates = JSON.parse(fs.readFileSync("geoSverige.json"));
const _ = require("lodash");

const docs = data
  .map(x => {
    const geo = coordinates.find(y => y.Region === x.Region);
    if (geo) {
      const document = {
        _type: "country",
        _id: `${Math.round(geo.lat)}${Math.round(geo.lng)}`,
        name: x.Region,
        cases: x.senaste + x.nya,
        newCases: x.nya,
        // deaths: x.newDeaths,
        // newDeaths: x.newDeaths - x.deaths,
        // newDeaths: something
        lat: geo.lat,
        lng: geo.lng,
      };

      return document;
    }
  })
  .filter(Boolean);
console.log(docs);

fs.writeFileSync("data.json", JSON.stringify(docs));
// cat data.json | jq -c '.[]' > data.ndjson
