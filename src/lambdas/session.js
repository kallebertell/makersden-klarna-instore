import axios from "axios";
import { pathOr } from "ramda";
import { credentials } from "../lambda-utils/credentials";
import { buildOrderData } from "../lambda-utils/buildOrderData";

export async function handler(event, context) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 404,
      body: "Unsupported method."
    };
  }

  const payload = JSON.parse(event.body);
  const { order_lines } = payload;

  try {
    const response = await axios.post(
      "https://api.playground.klarna.com/payments/v1/sessions",
      buildOrderData({ order_lines }),
      {
        auth: credentials
      }
    );

    return {
      statusCode: 200,
      body: JSON.stringify(response.data)
    };
  } catch (e) {
    const statusCode = pathOr(500, ["response", "status"], e);
    const message = pathOr(
      ["Something went wrong"],
      ["response", "data", "error_messages"],
      e
    ).join(", ");

    return {
      statusCode,
      body: JSON.stringify({
        message
      })
    };
  }
}
