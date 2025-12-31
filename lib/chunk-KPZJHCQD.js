import {
  dir
} from "./chunk-NF24Q4FD.js";

// src/utils/config.ts
import fs from "fs";
import path from "path";
import { parse } from "yaml";
import {
  watch,
  logger,
  filesByExt,
  copyConfigSync
} from "node-karin";
copyConfigSync(dir.defConfigDir, dir.ConfigDir, [".yaml"]);
var readYaml = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      return parse(fs.readFileSync(filePath, "utf8"));
    }
  } catch (err) {
    logger.error(`[karin-plugin-imgtouch] \u8BFB\u53D6\u914D\u7F6E\u6587\u4EF6\u5931\u8D25: ${filePath}`, err);
  }
  return {};
};
var config = () => {
  const cfg = readYaml(path.join(dir.ConfigDir, "config.yaml"));
  const def = readYaml(path.join(dir.defConfigDir, "config.yaml"));
  const merged = { ...def };
  if (cfg.poke) merged.poke = { ...def.poke, ...cfg.poke };
  if (cfg.summary) merged.summary = { ...def.summary, ...cfg.summary };
  return merged;
};
setTimeout(() => {
  const list = filesByExt(dir.ConfigDir, ".yaml", "abs");
  list.forEach((file) => watch(file, () => {
    logger.info(`${logger.violet("[karin-plugin-imgtouch]")}${logger.green("[\u914D\u7F6E]")} \u914D\u7F6E\u6587\u4EF6\u5DF2\u66F4\u65B0`);
  }));
}, 2e3);

export {
  config
};
