import axios from "axios";
import adapter from "axios/lib/adapters/http";
import { API } from "../endpoints";
axios.defaults.adapter = adapter;

const authHeaderWithValidBearerToken = {
  accept: "application/json",
  authorization: "Bearer 1234",
};

export class Orders {
  constructor(url) {
    if (url === undefined || url === "") {
      url = process.env.BASE_URL;
    }
    this.url = url;
  }

  withPath(path) {
    return `${this.url}${path}`;
  }

  async getUserOrders(token) {
    let reqHeaders;
    if (token === "valid") {
      reqHeaders = authHeaderWithValidBearerToken;
    } else {
      throw error("token not passed");
    }
    return axios
      .get(this.withPath(API.ORDERS), {
        headers: reqHeaders,
      })
      .then((r) => {
        return r.data;
      })
      .catch((error) => {
        if (error.response.status === 401) {
          return Promise.resolve(error.response.data);
        } else {
          throw new Error(error);
        }
      });
  }
}
export default new Orders(process.env.BASE_URL);
