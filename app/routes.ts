import { type RouteConfig, index, route } from "@react-router/dev/routes";
import auth from "./routes/auth";
export default [
  index("routes/home.tsx"),
  route("/auth", "routes/auth.tsx"),
] satisfies RouteConfig;
