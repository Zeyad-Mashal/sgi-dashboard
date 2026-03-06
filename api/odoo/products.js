const ODOO_BASE = "https://sgicompany.odoo.com/api";

export default async function handler(req, res) {
  // CORS: اسمح للدومين الخاص بالداشبورد
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-API-KEY");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const apiKey = process.env.ODOO_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      message: "ODOO_API_KEY is not set in Vercel environment variables",
    });
  }

  try {
    const response = await fetch(`${ODOO_BASE}/products`, {
      method: "GET",
      headers: {
        "X-API-KEY": apiKey,
      },
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error("Odoo proxy error:", error);
    res.status(502).json({ message: "Failed to fetch from Odoo", error: String(error.message) });
  }
}
