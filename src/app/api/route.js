import Webflow from "webflow-api";
import { isSameDay, parseISO } from "date-fns";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // Initialize API
  const api = new Webflow({
    token: "2d84f9720ff8aadf4b0b94cc2f0141b0b7131e4300fa18fc8f248acb43f4eb7c",
  });

  try {
    const it = await api.items({
      siteId: "64b6afc54c1a9ceff92d8f2a",
      collectionId: "64b6afc54c1a9ceff92d8f6b",
    });

    // Get hours for a specific date
    const thisDate = it.items.find(
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
    const genericDay = it.items.find((item) => item.slug === daySlug);

    // Return specific if it exists, or generic if not.
    const response = thisDate
      ? thisDate["text-som-visas"]
      : genericDay
      ? genericDay["text-som-visas"]
      : "No data available";

    console.log("Response:", response);

    // Send the response as JSON
    return res.status(200).json({
      body: response,
      query: req.query,
      cookies: req.cookies,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An error occurred" });
  }
}
