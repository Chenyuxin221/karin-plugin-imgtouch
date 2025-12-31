import {
  config
} from "../../chunk-KPZJHCQD.js";
import "../../chunk-NF24Q4FD.js";

// src/apps/Poke/handler.ts
import karin, { segment, logger as logger2 } from "node-karin";

// src/model/Poke.ts
import fs from "fs/promises";
import path from "path";
import { logger } from "node-karin";
var IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp", ".svg"];
async function getRandomPokeImage() {
  try {
    const { baseDir, baseUrl, groups, excludedGroups } = config().poke;
    if (!groups || groups.length === 0) {
      logger.warn(`${logger.violet("[karin-plugin-imgtouch]")}${logger.red("[\u6233\u4E00\u6233]")} \u672A\u914D\u7F6E\u56FE\u7247\u5206\u7EC4 (groups)`);
      return null;
    }
    const validGroups = groups.filter((group) => !excludedGroups?.includes(group));
    if (validGroups.length === 0) {
      logger.warn(`${logger.violet("[karin-plugin-imgtouch]")}${logger.red("[\u6233\u4E00\u6233]")} \u6240\u6709\u5206\u7EC4\u5747\u88AB\u6392\u9664\u6216\u5217\u8868\u4E3A\u7A7A`);
      return null;
    }
    const randomGroupName = validGroups[Math.floor(Math.random() * validGroups.length)];
    logger.info(`${logger.violet("[karin-plugin-imgtouch]")} \u968F\u673A\u9009\u4E2D\u5206\u7EC4: ${randomGroupName}`);
    if (baseDir) {
      const targetDir = path.join(baseDir, randomGroupName);
      try {
        await fs.access(targetDir);
        const files = await fs.readdir(targetDir);
        const images = files.filter((file) => {
          const ext = path.extname(file).toLowerCase();
          return IMAGE_EXTENSIONS.includes(ext);
        });
        if (images.length > 0) {
          const randomImage = images[Math.floor(Math.random() * images.length)];
          return `file://${path.join(targetDir, randomImage)}`;
        } else {
          logger.warn(`${logger.violet("[karin-plugin-imgtouch]")}${logger.yellow("[\u6233\u4E00\u6233]")} \u672C\u5730\u76EE\u5F55\u4E3A\u7A7A: ${targetDir}`);
        }
      } catch (err) {
        logger.warn(`${logger.violet("[karin-plugin-imgtouch]")}${logger.yellow("[\u6233\u4E00\u6233]")} \u672C\u5730\u76EE\u5F55\u4E0D\u53EF\u7528: ${targetDir} - ${err}`);
      }
    }
    if (baseUrl) {
      if (baseUrl.includes("{name}")) {
        return baseUrl.replace("{name}", encodeURIComponent(randomGroupName));
      }
      const separator = baseUrl.includes("?") ? "&" : "?";
      return `${baseUrl}${separator}name=${encodeURIComponent(randomGroupName)}`;
    }
    if (!baseDir) {
      logger.error(`${logger.violet("[karin-plugin-imgtouch]")}${logger.red("[\u6233\u4E00\u6233]")} baseDir \u548C baseUrl \u5747\u672A\u914D\u7F6E`);
    } else {
      logger.warn(`${logger.violet("[karin-plugin-imgtouch]")}${logger.yellow("[\u6233\u4E00\u6233]")} \u672C\u5730\u56FE\u7247\u83B7\u53D6\u5931\u8D25\u4E14\u672A\u914D\u7F6E baseUrl`);
    }
    return null;
  } catch (error) {
    logger.error(`${logger.violet("[karin-plugin-imgtouch]")}${logger.red("[\u6233\u4E00\u6233]")} \u4E1A\u52A1\u903B\u8F91\u9519\u8BEF: ${error}`);
    return null;
  }
}

// src/apps/Poke/handler.ts
var groupPoke = karin.accept(
  "notice.groupPoke",
  async (ctx, next) => {
    if (ctx.content.targetId !== ctx.selfId) return next();
    const imagePath = await getRandomPokeImage();
    if (imagePath) {
      logger2.info(`${logger2.violet(`[Bot:${ctx.selfId}]`)} ${logger2.violet("[karin-plugin-imgtouch]")}${logger2.green("[\u6233\u4E00\u6233]")} \u53D1\u9001\u56FE\u7247: ${imagePath}`);
      await ctx.reply(segment.image(imagePath));
    }
    return next();
  },
  { name: "\u968F\u673A\u56FE\u7247" }
);
export {
  groupPoke
};
