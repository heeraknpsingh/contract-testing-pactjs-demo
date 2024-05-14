import { PactV3 } from "@pact-foundation/pact";
import * as dotenv from "dotenv";
import { API } from "../endpoints";
const path = require("path");
const { UserSettings } = require("./user_settings");
dotenv.config({
  path: path.resolve(__dirname + "./../../.env"),
});

const provider = new PactV3({
  consumer: "User_Settings_Consumer",
  provider: "User_Settings_Provider",
  logLevel: process.env.LOG_LEVEL,
  dir: path.resolve(process.cwd(), "pacts"),
});

describe("User Settings", () => {
  beforeAll(() => provider.setup());

  describe("get user settings", () => {
    test("expired bearer token", async () => {
      const EXPECTED_BODY = {
        code: 401,
        message:
          "square/go-jose/jwt: validation failed, token is expired (exp)",
        internal: {},
      };
      await provider.addInteraction({
        states: [{ description: "expired bearer token" }],
        uponReceiving:
          "401 http response code when expired bearer token passed >> ",
        withRequest: {
          method: "GET",
          path: API.USER_INFO,
          contentType: "application/json",
          headers: {
            accept: "application/json",
            authorization: "Bearer 1234",
          },
        },
        willRespondWith: {
          status: 401,
          body: EXPECTED_BODY,
        },
      });
      await provider.executeTest(async (mockService) => {
        const api = new UserSettings(mockService.url);
        const product = await api.getUserSettingsStatus("valid");
        expect(product).toStrictEqual(EXPECTED_BODY);
      });
    });
    test("valid bearer token", async () => {
      const EXPECTED_BODY = { status: "approved", email_verified: true };
      await provider.addInteraction({
        states: [{ description: "valid bearer token" }],
        uponReceiving:
          "200 http response code when valid bearer token passed >> ",
        withRequest: {
          method: "GET",
          path: API.USER_INFO,
          contentType: "application/json",
          headers: {
            accept: "application/json",
            authorization: "Bearer 1234",
          },
        },
        willRespondWith: {
          status: 200,
          contentType: "application/json; charset=utf-8",
          body: EXPECTED_BODY,
        },
      });
      await provider.executeTest(async (mockService) => {
        const api = new UserSettings(mockService.url);
        const product = await api.getUserSettingsStatus("valid");
        expect(product).toStrictEqual(EXPECTED_BODY);
      });
    });
    test("empty bearer token", async () => {
      const EXPECTED_BODY = {
        code: 401,
        message: "invalid auth scheme",
      };
      await provider.addInteraction({
        states: [{ description: "empty bearer token" }],
        uponReceiving:
          "401 http response code when empty token value passed >> ",
        withRequest: {
          method: "GET",
          path: API.USER_INFO,
          contentType: "application/json",
          headers: {
            accept: "application/json",
          },
        },
        willRespondWith: {
          status: 401,
          contentType: "application/json;charset=utf-8",
          body: EXPECTED_BODY,
        },
      });
      await provider.executeTest(async (mockService) => {
        const api = new UserSettings(mockService.url);
        const product = await api.getUserSettingsStatus("empty");
        expect(product).toStrictEqual(EXPECTED_BODY);
      });
    });
  });
});
