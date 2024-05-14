const { Verifier } = require("@pact-foundation/pact");
const { Login } = require("../login");
const path = require("path");
import * as dotenv from "dotenv";
dotenv.config({
  path: path.resolve(__dirname + "./../../.env"),
});

describe("User settings pact verification", () => {
  let token;
  test("should validate the expectations of User Settings", async () => {
    const opts = {
      providerBaseUrl: process.env.BASE_URL,
      provider: "User_Settings_Provider",
      logLevel: process.env.LOG_LEVEL,
      stateHandlers: {
        "expired bearer token": () => {
          token =
            "eyJhbGciOiJFUzI1NiJ9.eyJhdWQiOlsicmFpbi1xY";
          return Promise.resolve("expired token passed");
        },
        "valid bearer token": async () => {
          const api = new Login();
          let token_value = await api.getToken();
          token = token_value;
          return Promise.resolve("valid token passed");
        },
        "empty bearer token": async () => {
          token = "";
          return Promise.resolve("empty token passed");
        },
      },
      // pactBrokerUrl: process.env.PACT_BROKER_URL,
      // pactBrokerToken: process.env.PACT_BROKER_TOKEN,
      // publishVerificationResult: true,
      // providerVersion: "1.0.0",
      // consumerVersionSelectors: [
      //   { consumer: "User_Settings_Consumer", branch: "branch1" },
      // ],
      pactUrls: [
        path.resolve(
          __dirname,
          "../../pacts/User_Settings_Consumer-User_Settings_Provider.json"
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
        console.log("User_Settings Pact Verification Completed!");
      });
  });
});
