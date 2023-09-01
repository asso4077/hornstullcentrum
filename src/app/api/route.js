import Webflow from "webflow-api";
import { isSameDay, parseISO } from "date-fns";

const allowCors = (fn) => async (req, res) => {
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
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

const middleware = allowCors;

// Handle GET request
export async function GET(req, res) {
  // Use uppercase GET here
  // Initialize API
  const api = new Webflow({
    token: "2d84f9720ff8aadf4b0b94cc2f0141b0b7131e4300fa18fc8f248acb43f4eb7c",
  });

  try {
    // Fetch items in the collection "Öppettidersplashes"
    const it = await api.items({
      siteId: "64b6afc54c1a9ceff92d8f2a",
      collectionId: "64b6afc54c1a9ceff92d8f6b",
    });

    // Get hours for a specific date
    const thisDate = it.items.filter(
      (item) => !!item.datum && isSameDay(parseISO(item.datum), new Date())
    );

    // Get hours for a generic date
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

    // Return specific if it exists, or generic if not.
    if (thisDate[0]) {
      console.log("thisDate", thisDate[0]["text-som-visas"]);
      res.setHeader("Content-Type", "application/json");
      res.end(
        JSON.stringify({
          body: thisDate[0]["text-som-visas"],
          query: req.query,
          cookies: req.cookies,
        })
      );
    } else {
      console.log("genericDate", genericDay[0]["text-som-visas"]);
      res.setHeader("Content-Type", "application/json");
      res.end(
        JSON.stringify({
          body: genericDay[0]["text-som-visas"],
          query: req.query,
          cookies: req.cookies,
        })
      );
    }
  } catch (error) {
    console.error(error);
    res.statusCode = 500; // Set the status code directly
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "An error occurred" }));
  }
}

export default middleware(GET);
