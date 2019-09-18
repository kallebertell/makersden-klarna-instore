const products = [
  {
    name: "Nike Air Max",
    price: 15000,
    imageUrl:
      "https://images.nike.com/is/image/DotCom/CI2299_002?$NIKE_PWP_GRAY$&wid=150&hei=150"
  },
  {
    name: "Brooks Launch 6",
    price: 12000,
    imageUrl: "https://m.media-amazon.com/images/I/81mbn7ZSVsL._AC_SX255_.jpg"
  },
  {
    name: "Sandy Sandals",
    price: 9000,
    imageUrl:
      "https://www.bfgcdn.com/out/pictures/generated/product/1/215_215_90/sol_025-0425-0211_pic1_1.jpg"
  },
  {
    name: "Lucky Brand Kenri",
    price: 8600,
    imageUrl: "https://m.media-amazon.com/images/I/71hCLfjRvmL._AC_SX272_.jpg"
  },
  {
    name: "Jose Real",
    price: 23000,
    imageUrl:
      "https://images-na.ssl-images-amazon.com/images/I/81WOgK9HtUL._UX395_.jpg"
  }
];

const toHashCode = str => {
  let hash = 0,
    i,
    chr;
  if (str.length === 0) {
    return hash;
  }
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return Math.abs(hash);
};

async function getProduct(event) {
  const serial = event.path.split("/").pop();

  // Integrate into your Product Information DB here.

  const product = products[toHashCode(serial) % products.length];

  return {
    statusCode: 200,
    body: JSON.stringify({
      serial,
      ...product
    })
  };
}

export async function handler(event, context) {
  if (event.httpMethod === "GET") {
    return getProduct(event);
  }

  return {
    statusCode: 404,
    body: "Unsupported method."
  };
}
