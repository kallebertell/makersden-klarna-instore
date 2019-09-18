require("dotenv").config();

export const credentials = {
  username: process.env.KP_API_USERNAME,
  password: process.env.KP_API_PASSWORD
};
