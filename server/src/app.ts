import {
  loadPackageDefinition,
  sendUnaryData,
  Server,
  ServerCredentials,
  ServerUnaryCall,
} from "@grpc/grpc-js";
import { loadSync } from "@grpc/proto-loader";

// load grpc
const PROTO_PATH = __dirname + "/../../protos/calculator.proto";
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
  call: ServerUnaryCall<any, any>,
  callback: sendUnaryData<any>
) => {
  const { num1, num2 } = call.request;
  console.log(typeof num1);
  callback(null, { num: num1 + num2 });
};

const main = async () => {
  const server = new Server();

  server.addService((calc_proto as any).Calculator.service, { addNums });

  server.bindAsync("0.0.0.0:50051", ServerCredentials.createInsecure(), () => {
    server.start();
  });
};

main();
