import express from "express";
import type { ErrorRequestHandler, Express } from "express";
import fs from "fs";
import * as path from "path";
import { mkSaveFile } from "./saver";

const setupExpressApp: (setup: (app: Express) => void) => void = (setup) => {
  const app = express();

  setup(app);

  app.use("/persistence/:fileName", (req, res, _next) => {
    res.send("ok");
  });

  app.use((_req, res, _next) => res.status(404).send("Not found"));

  const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
    console.error(error.message);
    res.status(500).send("Internal server error");
  };
  app.use(errorHandler);

  app.listen(54321, () =>
    console.log("server listening on http://localhost:54321")
  );
};

const main = async () => {
  setupExpressApp((app) => {
    app.put("/api/save-file", async (_req, res, next) => {
      const logs: string[] = [];
      const saveFile = mkSaveFile({
        logger: { log: logs.push.bind(logs) },
        persistence: {
          write: async (p, contents) => {
            try {
              const filePath = path.resolve("/Users/yanikceulemans/Desktop", p);
              logs.push(`making directories for ${filePath}`);
              await fs.promises.mkdir(path.dirname(filePath), {
                recursive: true,
              });
              logs.push(`about to write ${filePath}`);
              await fs.promises.writeFile(filePath, contents);
              logs.push("wrote file");
              return "success";
            } catch (e) {
              logs.push(`${e}`);
              return "error";
            }
          },
        },
      });

      try {
        await saveFile(
          "persistence/thefile.txt",
          Buffer.from("the file contents")
        );
        res.send("ok");
      } catch (e) {
        next(e);
      } finally {
        console.log(logs.join("\n\t"));
      }
    });
  });
};

main().catch(console.error);
