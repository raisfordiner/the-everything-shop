import { ErrorHandler } from "../helper/error";

const unknownEndpoint = (req, res) => {
  throw new ErrorHandler(401, "Unknown Endpoint");
};

export default unknownEndpoint;
