import { credentials, loadPackageDefinition } from "@grpc/grpc-js";
import { loadSync } from "@grpc/proto-loader";

const PROTO_PATH = __dirname + "/../../protos/calculator.proto";
const packageDefinition = loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const calc_proto = loadPackageDefinition(packageDefinition).calculator;

const main = async () => {
  const target = "localhost:50051";

  const client = new (calc_proto as any).Calculator(
    target,
    credentials.createInsecure()
  );

  client.addNums({ num1: 1, num2: 2 }, (err: any, response: any) => {
    console.log("addNums response: ", response.num);
  });
};

main();
