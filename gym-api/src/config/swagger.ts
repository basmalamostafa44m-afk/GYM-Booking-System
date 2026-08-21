import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Gym / Fitness Class Booking API",
      version: "1.0.0",
      description:
        "A booking system where a gym publishes class sessions and members book a spot, with trainers managing the schedule."
    },
    servers: [
      {
        url: "http://localhost:" + (process.env.PORT || 3000)
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    }
  },
  apis: ["./src/routes/*.ts"]
};

export const swaggerSpec = swaggerJSDoc(options);