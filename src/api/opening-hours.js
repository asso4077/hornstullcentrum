const Webflow = require("webflow-api");
var isSameDay = require("date-fns/isSameDay");
var parseISO = require("date-fns/parseISO");

const allowCors = (fn) => async (req, res) => {
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  return await fn(req, res);
};

const handler = (req, res) => {
  // Initialize the API
  const api = new Webflow({
    token: "f7797288bd0730a647f47476d0b84017c4f3a60711ec5675c27421a287362bc7",
  });

  // Examples
  // api.sites().then(sites => console.log(sites));
  // api.site({ siteId: '64b6afc54c1a9ceff92d8f2b' }).then(site => console.log(site));
  // api.collection({ siteId: '64b6afc54c1a9ceff92d8f2b', collectionId: '64b6afc54c1a9ceff92d8f6b' }).then(collections => console.log(collections));

  // Fetches the items in the collection "Öppettidersplashes"
  api
    .items({
      siteId: "64b6afc54c1a9ceff92d8f2a",
      collectionId: "64b6afc54c1a9ceff92d8f6b",
    })
    .then((it) => {
      // console.log(res.items);

      // get hours for a specific date
      const thisDate = it.items.filter(
        (item) => !!item.datum && isSameDay(parseISO(item.datum), new Date())
      );

      // get hours for a generic date
      const date = new Date().getDate();
      let dag = "sondag";
      switch (date) {
        case 1:
          dag = "mandag";
          break;
        case 2:
          dag = "tisdag";
          break;
        case 3:
          dag = "onsdag";
          break;
        case 4:
          dag = "torsdag";
          break;
        case 5:
          dag = "fredag";
          break;
        case 6:
          dag = "lordag";
          break;
      }
      const daySlug = `generell-${dag}`;
      const genericDay = it.items.filter((item) => item.slug === daySlug);

      // return specific if it exists, or generic if not.
      if (thisDate[0]) {
        console.log("thisDate", thisDate[0]["text-som-visas"]);
        res.json({
          body: thisDate[0]["text-som-visas"],
          query: req.query,
          cookies: req.cookies,
        });
      } else {
        console.log("genericDate", genericDay[0]["text-som-visas"]);
        res.json({
          body: genericDay[0]["text-som-visas"],
          query: req.query,
          cookies: req.cookies,
        });
      }
    });
};
module.exports = allowCors(handler);
