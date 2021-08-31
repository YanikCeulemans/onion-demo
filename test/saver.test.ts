import { mkSaveFile } from "../src/saver";

describe("saveFile", () => {
  it("should work", async () => {
    const logSpy = jest.fn();
    const saveFile = mkSaveFile({
      logger: {
        log: logSpy
      },
      persistence: {
        write: () => Promise.resolve("success"),
      }
    })

    await expect(
      saveFile("test/test-file.txt", Buffer.from("test contents"))
    ).resolves.toEqual(undefined);
    expect(logSpy).toHaveBeenCalledWith(expect.stringMatching(/saving file/));
    expect(logSpy).toHaveBeenCalledWith(expect.stringMatching(/successfully saved file/));
  });

  it("should throw an error when saving failed", async () => {
    const saveFile = mkSaveFile({
      logger: {
        log: () => {},
      },
      persistence: {
        write: () => Promise.resolve("error"),
      }
    })

    await expect(
      saveFile("test/test-file.txt", Buffer.from("test contents"))
    ).rejects.toThrow(/Failed to save file/);
  });
});
