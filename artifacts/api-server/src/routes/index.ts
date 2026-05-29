import { Router, type IRouter } from "express";
import healthRouter from "./health";
import auth from "./auth";
import jobs from "./jobs";
import tasks from "./tasks";
import habits from "./habits";
import profile from "./profile";
import dashboard from "./dashboard";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/auth", auth);
router.use("/jobs", jobs);
router.use("/tasks", tasks);
router.use("/habits", habits);
router.use("/profile", profile);
router.use("/dashboard", dashboard);

export default router;
