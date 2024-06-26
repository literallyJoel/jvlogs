//The above is because we're getting stuff from external servers and we can't control the types
import { createCaller } from "@/server/api/root";
import { createInnerTRPCContext } from "@/server/api/trpc";
import type { NextApiRequest, NextApiResponse } from "next";
import NextCors from "nextjs-cors";

const verifyLog = (_log: any) => {
  const log = _log as {
    date: string;
    type: string;
    route: string;
    message: string;
  };

  const missing = [];
  if (!log) {
    missing.push("log");
    return missing;
  }

  if (!log.date) {
    missing.push("date");
  }
  if (!log.type) {
    missing.push("type");
  }
  if (!log.route) {
    missing.push("route");
  }
  if (!log.message) {
    missing.push("message");
  }

  if (missing.length > 0) {
    return missing;
  } else {
    return true;
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await NextCors(req, res, {
    origin: "*",
    optionsSuccessStatus: 200,
  });
  const trpc = createCaller(createInnerTRPCContext({}));

  const body = req.body as { appId: string; log: any };
  const appId = body.appId;
  let log = body.log;
  if (typeof log === "string") {
    log = JSON.parse(log);
  }

  if (!appId) {
    console.log("appId not provided");
    res.status(400).json({ message: "appId is required" });
    return;
  }
  const app = await trpc.apps.getApps({ appId: appId });

  if (!app || app.length === 0) {
    console.log("App not found");
    res.status(400).json({ message: "App not found" });
    return;
  }

  const missing = verifyLog(log);
  if (missing !== true) {
    console.log(`${missing.join(", ")} is required`);
    res.status(400).json({ message: `${missing.join(", ")} is required` });
    return;
  }

  const newLog = await trpc.logs.createLog({ appId: appId, log: log });

  if (newLog) {
    res.status(201).json({ message: "Log created" });
  } else {
    res.status(500).json({ message: "Failed to create log" });
  }
}
