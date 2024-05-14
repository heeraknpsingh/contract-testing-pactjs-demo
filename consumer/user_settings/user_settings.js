import axios from "axios";
import adapter from "axios/lib/adapters/http";
import { API } from "../endpoints";
axios.defaults.adapter = adapter;

const authHeaderWithEmptyBearerToken = {
  accept: "application/json",
  authorization: "Bearer ",
};

const authHeaderWithValidBearerToken = {
  accept: "application/json",
  authorization: "Bearer 1234",
};

export class UserSettings {
  constructor(url) {
    if (url === undefined || url === "") {
      url = process.env.BASE_URL;
    }
    this.url = url;
  }

  withPath(path) {
    return `${this.url}${path}`;
  }

  async getUserSettingsStatus(token) {
    let reqHeaders;
    if (token === "valid") {
      reqHeaders = authHeaderWithValidBearerToken;
    } else if (token === "empty") {
      reqHeaders = authHeaderWithEmptyBearerToken;
    } else {
      throw error("token not passed");
    }
    return axios
      .get(this.withPath(API.USER_INFO), {
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
export default new UserSettings(process.env.BASE_URL);
