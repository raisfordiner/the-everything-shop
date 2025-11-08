import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    servers: [
      {
        url: "/api",
        description: "API server",
      },
    ],
    info: {
      title: "E-Shop API",
      version: "1.0.0",
    },
  },
  apis: ["./src/**/*.route.ts"],
};

const specs = swaggerJsdoc(options);

export { specs, swaggerUi };
