//The above is because we're getting stuff from external servers and we can't control the types
import { createCaller } from "@/server/api/root";
import { createInnerTRPCContext } from "@/server/api/trpc";
import type { NextApiRequest, NextApiResponse } from "next";


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
  const trpc = createCaller(createInnerTRPCContext({}));

  const body = req.body as { appId: string; log: any };
  const appId = body.appId;
  const log = body.log;
  console.log("REQ: ", JSON.stringify(req.body));
  console.log("COE: ", JSON.stringify(body));
  if (!appId) {
    res.status(400).json({ message: "appId is required" });
    return;
  }
  const app = await trpc.apps.getApps({ appId: appId });

  if (!app || app.length === 0) {
    res.status(400).json({ message: "App not found" });
    return;
  }

  const missing = verifyLog(log);
  if (missing !== true) {
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
