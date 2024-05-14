const { Verifier } = require("@pact-foundation/pact");
const path = require("path");
import * as dotenv from "dotenv";
dotenv.config({
  path: path.resolve(__dirname + "./../../.env"),
});

describe("ATP Pact Verification", () => {
  test("should validate the expectations of ATP", async () => {
    const opts = {
      provider: "ATP_Provider",
      logLevel: process.env.LOG_LEVEL,
      providerBaseUrl: process.env.BASE_URL,
      stateHandlers: {
        "when no auth passed": () => {
          return Promise.resolve("no token needed");
        },
      },
      // pactBrokerUrl: process.env.PACT_BROKER_URL,
      // pactBrokerToken: process.env.PACT_BROKER_TOKEN,
      // publishVerificationResult: true,
      // consumerVersionSelectors: [
      //   { consumer: "ATP_Consumer", branch: "branch1" },
      // ],
      // providerVersion: "1.0.0",
      pactUrls: [
        path.resolve(__dirname, "../../pacts/ATP_Consumer-ATP_Provider.json"),
      ],
    };
    return new Verifier(opts)
      .verifyProvider()
      .then((output) => {
        console.log(output);
      })
      .finally(() => {
        console.log("ATP Pact Verification Completed!");
      });
  });
});
