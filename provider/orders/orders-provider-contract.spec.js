const { Verifier } = require("@pact-foundation/pact");
const path = require("path");
import * as dotenv from "dotenv";
const { Login } = require("../login");
dotenv.config({
  path: path.resolve(__dirname + "./../../.env"),
});

describe("Orders pact verification", () => {
  let token;
  test("should validate the expectations of Orders", async () => {
    const opts = {
      providerBaseUrl: process.env.BASE_URL,
      provider: "Orders_Provider",
      logLevel: process.env.LOG_LEVEL,
      stateHandlers: {
        "valid bearer token": async () => {
          const api = new Login();
          let token_value = await api.getToken();
          token = token_value;
          return Promise.resolve("valid token passed");
        },
      },
      // pactBrokerUrl: process.env.PACT_BROKER_URL,
      // pactBrokerToken: process.env.PACT_BROKER_TOKEN,
      // publishVerificationResult: true,
      // consumerVersionSelectors: [
      //   { consumer: "Orders_Consumer", branch: "branch1" },
      // ],
      // providerVersion: "1.0.0",
      pactUrls: [
        path.resolve(
          __dirname,
          "../../pacts/Order_Consumer-Order_Provider.json"
        ),
      ],
      requestFilter: (req, res, next) => {
        if (token == null || token == undefined) {
        } else {
          req.headers["authorization"] = `Bearer ${token}`;
        }
        next();
      },
    };
    return new Verifier(opts)
      .verifyProvider()
      .then((output) => {
        console.log(output);
      })
      .finally(() => {
        console.log("Orders Pact Verification Completed!");
      });
  });
});
