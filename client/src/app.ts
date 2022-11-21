import { credentials, loadPackageDefinition, Metadata } from "@grpc/grpc-js";
import { loadSync } from "@grpc/proto-loader";

const PROTO_PATH = "../protos/calculator.proto";
const packageDefinition = loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const calc_proto = loadPackageDefinition(packageDefinition).calculator;

const main = async () => {
  const target = process.env.TARGET || "localhost:50051";

  const client = new (calc_proto as any).Calculator(
    target,
    credentials.createInsecure()
  );

  // setup metadata
  const metadata = new Metadata();
  const api_key = process.env.API_KEY || "12345";
  metadata.add("x-api-key", api_key);

  // make call every 5 seconds
  setInterval(() => {
    // generate 2 random numbers between 1 and 1000
    const nums = {
      num1: Math.floor(Math.random() * 1000) + 1,
      num2: Math.floor(Math.random() * 1000) + 1,
    };
    client.addNums(nums, metadata, (err: any, response: any) => {
      if (err) {
        console.log("error:", err.details);
      } else {
        console.log("addNums response: ", response);
      }
    });
  }, 1000);
};

main();
