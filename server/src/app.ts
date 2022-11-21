import {
  loadPackageDefinition,
  sendUnaryData,
  Server,
  ServerCredentials,
  ServerUnaryCall,
} from "@grpc/grpc-js";
import { loadSync } from "@grpc/proto-loader";

// load grpc
const PROTO_PATH = __dirname + "/../protos/calculator.proto";
const packageDefinition = loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const calc_proto = loadPackageDefinition(packageDefinition).calculator;

// implement the add method
const addNums = (
  call: ServerUnaryCall<{ num1: number; num2: number }, { num: number }>,
  callback: sendUnaryData<{ num: number }>
) => {
  const { num1, num2 } = call.request;
  const api_key = call.metadata.get("x-api-key");

  // check api key
  const expected_api_key = process.env.API_KEY || "12345";
  if (api_key.length === 0 || api_key[0] !== expected_api_key) {
    return callback({
      code: 401,
      message: "Unauthorized",
    });
  }

  callback(null, { num: num1 + num2 });
};

const main = async () => {
  const server = new Server();

  server.addService((calc_proto as any).Calculator.service, { addNums });

  const port = process.env.PORT || 50051;

  server.bindAsync(
    "0.0.0.0:" + port,
    ServerCredentials.createInsecure(),
    () => {
      server.start();
      console.log("server running on port", port);
    }
  );
};

main();
