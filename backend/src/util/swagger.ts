import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
  },
  apis: ["./**/*.route.ts"],
};

const specs = swaggerJsdoc(options);

export { specs, swaggerUi };
