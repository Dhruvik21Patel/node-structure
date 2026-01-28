import cors from "cors";
import express, { Express, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger";
import loggerMiddleware from "./middlewares/logger.middleware";
import { errorMiddleware } from "./middlewares/error.middleware";
import routes from "./routes";

const app: Express = express();

app.use(
  cors({
    origin: "*", // for development
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());
app.use(loggerMiddleware);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

app.use("/api", routes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(errorMiddleware);

export default app;
