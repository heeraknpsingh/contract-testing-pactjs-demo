import axios from "axios";
import adapter from "axios/lib/adapters/http";
axios.defaults.adapter = adapter;
import { API } from "../endpoints";

export class Atp {
  constructor(url) {
    if (url === undefined || url === "") {
      url = process.env.BASE_URL;
    }
    this.url = url;
  }

  withPath(path) {
    return `${this.url}${path}`;
  }

  async getAtpStatus() {
    return axios
      .get(this.withPath(API.ATP_HEALTH), {
        headers: {
          accept: "application/json",
        },
      })
      .then((r) => {
        return r.data;
      });
  }
}
export default new Atp(process.env.BASE_URL);
