const ODOO_URL = "https://sgicompany.odoo.com/api/products";

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, X-API-KEY",
    },
  });
}

export async function GET() {
  const apiKey = process.env.ODOO_API_KEY;
  if (!apiKey) {
    return jsonResponse(
      { message: "ODOO_API_KEY is not set in Vercel environment variables" },
      500
    );
  }

  try {
    const response = await fetch(ODOO_URL, {
      method: "GET",
      headers: {
        "X-API-KEY": apiKey,
      },
    });

    const text = await response.text();
    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { message: text || "Invalid response from Odoo" };
    }

    return jsonResponse(data, response.status);
  } catch (error) {
    return jsonResponse(
      {
        message: "Failed to fetch from Odoo",
        error: error?.message || String(error),
      },
      502
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, X-API-KEY",
      "Access-Control-Max-Age": "86400",
    },
  });
}
