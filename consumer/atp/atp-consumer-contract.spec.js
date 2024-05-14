import { PactV3 } from "@pact-foundation/pact";
import * as dotenv from "dotenv";
import { API } from "../endpoints";
const { Atp } = require("./atp");
const path = require("path");
dotenv.config({
  path: path.resolve(__dirname + "./../../.env"),
});

const provider = new PactV3({
  consumer: "ATP_Consumer",
  provider: "ATP_Provider",
  logLevel: process.env.LOG_LEVEL,
  dir: path.resolve(process.cwd(), "pacts"),
});

describe("ATP Pact test", () => {
  beforeAll(() => provider.setup());

  describe("get atp health status", () => {
    const EXPECTED_BODY = { status: "ok" };

    test("status should be ok", async () => {
      await provider.addInteraction({
        states: [{ description: "when no auth passed" }],
        uponReceiving: "200 http response code with status=ok >> ",
        withRequest: {
          method: "GET",
          path: API.ATP_HEALTH,
          contentType: "application/json",
          headers: { accept: "application/json" },
        },
        willRespondWith: {
          status: 200,
          contentType: "application/json; charset=utf-8",
          body: EXPECTED_BODY,
        },
      });

      await provider.executeTest(async (mockService) => {
        const api = new Atp(mockService.url);
        const product = await api.getAtpStatus();
        expect(product).toStrictEqual(EXPECTED_BODY);
      });
    });
  });
});
