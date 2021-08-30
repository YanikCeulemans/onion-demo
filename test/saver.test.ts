import axios from "axios";
import { saveFile } from "../src/saver";

describe("saveFile", () => {
  it("should work", async () => {
    jest.spyOn(axios, "post").mockResolvedValue({ status: 200 });
    jest.spyOn(console, 'log').mockReturnValue(undefined);

    await expect(
      saveFile("test/test-file.txt", Buffer.from("test contents"))
    ).resolves.toEqual(undefined);
  });

  it("should throw an error when saving failed", async () => {
    jest.spyOn(axios, "post").mockResolvedValue({ status: 500 });
    jest.spyOn(console, 'log').mockReturnValue(undefined);

    await expect(
      saveFile("test/test-file.txt", Buffer.from("test contents"))
    ).rejects.toThrow(/Failed to save file/);
  });
});
