import { Storage } from "@google-cloud/storage";
const ksyFilename = require("./peak-lattice-274100-7f1157109f28.json");
import config from "../../config";

let projectId = "peak-lattice-274100";
let keyFilename = "peak-lattice-274100-7f1157109f28";
const storage = new Storage({
  projectId,
  keyFilename,
  credentials: ksyFilename,
});
const bucket = storage.bucket(config.NAMEGOOGLECLOUD);

export { bucket };
