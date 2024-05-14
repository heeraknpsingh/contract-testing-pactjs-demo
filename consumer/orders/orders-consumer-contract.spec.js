import { PactV3, Matchers } from "@pact-foundation/pact";
const path = require("path");
const { Orders } = require("./orders");
import { API } from "../endpoints";

const provider = new PactV3({
  consumer: "Orders_Consumer",
  provider: "Orders_Provider",
  logLevel: process.env.LOG_LEVEL,
  dir: path.resolve(process.cwd(), "pacts"),
});

describe("Orders", () => {
  beforeAll(() => provider.setup());

  describe("get user orders", () => {
    test("valid bearer token", async () => {
      const EXPECTED_BODY = {
        id: "6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b",
        status: "cancelled",
        created: "2022-01-21T07:58:26.251019Z",
        updated: "2022-01-21T07:58:26.251019Z",
        type: "market",
        side: "sell",
        filled_quantity: {
          amount: "0.00070000",
          currency: "btc",
        },
      };
      await provider.addInteraction({
        states: [{ description: "valid bearer token" }],
        uponReceiving:
          "200 http response code when valid bearer token passed >> ",
        withRequest: {
          method: "GET",
          path: API.ORDERS,
          contentType: "application/json",
          headers: {
            accept: "application/json",
            authorization: "Bearer 1234",
          },
        },
        willRespondWith: {
          status: 200,
          contentType: "application/json; charset=utf-8",
          body: Matchers.eachLike(
            {
              id: Matchers.uuid("6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b"),
              status: Matchers.term({
                matcher: "completed|cancelled|reversed|processing",
                generate: "cancelled",
              }),
              updated: Matchers.iso8601DateTimeWithMillis(
                "2022-01-21T07:58:26.251019Z"
              ),
              created: Matchers.iso8601DateTimeWithMillis(
                "2022-01-21T07:58:26.251019Z"
              ),
              type: Matchers.string("market"),
              side: Matchers.string("sell"),
              filled_quantity: Matchers.like({
                amount: Matchers.string("0.00070000"),
                currency: Matchers.string("btc"),
              }),
            },
            { min: 1 }
          ),
        },
      });
      await provider.executeTest(async (mockService) => {
        const api = new Orders(mockService.url);
        const product = await api.getUserOrders("valid");
        expect(product).toEqual([EXPECTED_BODY]);
      });
    });
  });
});
