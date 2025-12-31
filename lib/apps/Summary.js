import {
  config
} from "../chunk-KPZJHCQD.js";
import "../chunk-NF24Q4FD.js";

// src/model/Summary.ts
import { hooks, logger } from "node-karin";
var cachedSummary = null;
var lastFetchTime = 0;
async function getSummary() {
  const { cacheDuration, apiUrl, fallbackText } = config().summary;
  const now = Date.now();
  if (cachedSummary && now - lastFetchTime < cacheDuration) {
    return cachedSummary;
  }
  try {
    const response = await fetch(apiUrl);
    if (response.ok) {
      const text = await response.text();
      cachedSummary = text;
      lastFetchTime = now;
      return text;
    }
  } catch (error) {
    logger.error(`[ImageSummary] Failed to fetch hitokoto: ${error}`);
  }
  return cachedSummary || fallbackText;
}
function initSummary() {
  hooks.sendMsg.message(async (contact, elements, retryCount, next) => {
    const { enable } = config().summary;
    if (!enable) return next();
    const hasImage = elements.some((e) => e.type === "image");
    if (!hasImage) return next();
    try {
      const summary = await getSummary();
      let applied = false;
      elements.forEach((e) => {
        if (e.type === "image" && !e.summary) {
          e.summary = summary;
          applied = true;
        }
      });
      if (applied) {
        logger.info(`${logger.violet("[Bot:Global]")} ${logger.violet("[karin-plugin-imgtouch]")}${logger.green("[\u56FE\u7247\u5916\u663E]")} ${summary}`);
      }
    } catch (err) {
      logger.error(`${logger.violet("[karin-plugin-imgtouch]")}${logger.red("[\u56FE\u7247\u5916\u663E]")} \u9519\u8BEF: ${err}`);
    }
    return next();
  });
  logger.info(`${logger.violet("[karin-plugin-imgtouch]")}${logger.green("[\u56FE\u7247\u5916\u663E]")} \u521D\u59CB\u5316\u5B8C\u6210`);
}

// src/apps/Summary.ts
initSummary();
