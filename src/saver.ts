import * as path from "path";

export interface Logger {
  log: (message: string) => void;
}

export interface Persistence {
  write: (path: string, contents: Buffer) => Promise<"success" | "error">
}

export type Dependencies = {
  logger: Logger;
  persistence: Persistence;
}

export const mkSaveFile = ({ logger, persistence }: Dependencies) => async (p: string, contents: Buffer): Promise<void> => {
  logger.log(`saving file ${path.basename(p)} to ${path.dirname(p)}`);
  const response = await persistence.write(p, contents);

  if (response === "success") {
    logger.log(`successfully saved file ${p}`);
  } else {
    throw new Error(`Failed to save file ${p}`);
  }
};
