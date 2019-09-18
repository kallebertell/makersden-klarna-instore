import axios from "axios";
import { pathOr } from "ramda";
import { credentials } from "../lambda-utils/credentials";
import { buildOrderData } from "../lambda-utils/buildOrderData";

async function createOrder(event) {
  const payload = JSON.parse(event.body);
  const { order_lines, authorization_token } = payload;

  try {
    const response = await axios.post(
      `https://api.playground.klarna.com/payments/v1/authorizations/${authorization_token}/order`,
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

async function getOrder(event) {
  const orderId = event.path.split("/").pop();

  try {
    const response = await axios.get(
      `https://api.playground.klarna.com/ordermanagement/v1/orders/${orderId}`,
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

export async function handler(event, context) {
  if (event.httpMethod === "POST") {
    return createOrder(event);
  }

  if (event.httpMethod === "GET") {
    return getOrder(event);
  }

  return {
    statusCode: 404,
    body: "Unsupported method."
  };
}
