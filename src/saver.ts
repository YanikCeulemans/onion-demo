import * as path from "path";
import axios from "axios";

export const saveFile = async (p: string, contents: Buffer): Promise<void> => {
  console.log(`saving file ${path.basename(p)} to ${path.dirname(p)}`);
  const response = await axios.post(`http://localhost:54321/${p}`, contents);

  if (response.status === 200) {
    console.log(`successfully saved file ${p}`);
  } else {
    throw new Error(`Failed to save file ${p}`);
  }
};
