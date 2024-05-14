import axios from "axios";
import adapter from "axios/lib/adapters/http";
import * as dotenv from "dotenv";

axios.defaults.adapter = adapter;
const path = require("path");
const CryptoJS = require("crypto-js");

dotenv.config({
  path: path.resolve(__dirname + "./../../.env"),
});

export class Login {
  constructor(url) {
    if (url === undefined || url === "") {
      url = process.env.BASE_URL;
    }
    this.url = url;
  }

  withPath(path) {
    return `${this.url}${path}`;
  }

  async getToken() {
    const payload = {
      email: "sherif+102@rain.bh",
      password: "mzb_test_Q@123",
      remember_me: false,
    };

    const secret = process.env.BASE_URL;
    let timestamp = Math.floor(Date.now() / 1000);
    let hashedContent = CryptoJS.SHA512(payload).toString(CryptoJS.enc.Hex);
    let concatenatedStr =
      secret + timestamp + hashedContent + "POST" + "/api/1/login";
    let signature = CryptoJS.HmacSHA512(concatenatedStr, secret).toString(
      CryptoJS.enc.Hex
    );

    let req_headers = {
      accept: "application/json",
      "Content-Type": "application/json",
      "API-Content-Hash": hashedContent,
      "API-key": process.env.BASE_URL,
      "API-Timestamp": timestamp,
      "API-Signature": signature,
      "Rain-2fa-Token": "1234",
    };

    return axios({
      method: "post",
      url: this.url + "/api/1/login",
      headers: req_headers,
      data: payload,
      NODE_TLS_REJECT_UNAUTHORIZED: "0",
    })
      .then((r) => {
        return r.data.token;
      })
      .catch((error) => {
        throw new Error(error);
      });
  }
}
export default new Login(process.env.BASE_URL);
