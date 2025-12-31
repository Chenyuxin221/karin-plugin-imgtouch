import { hooks, logger } from "node-karin";
import { config } from "@/utils/config";

let cachedSummary: string | null = null;
let lastFetchTime = 0;

async function getSummary(): Promise<string> {
    const { cacheDuration, apiUrl, fallbackText } = config().summary;
    const now = Date.now();
    
    if (cachedSummary && (now - lastFetchTime < cacheDuration)) {
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

export function initSummary() {
    hooks.sendMsg.message(async (contact, elements, retryCount, next) => {
        const { enable } = config().summary;
        if (!enable) return next();

        const hasImage = elements.some(e => e.type === "image");
        if (!hasImage) return next();

        try {
            const summary = await getSummary();
            let applied = false;
            elements.forEach(e => {
                if (e.type === "image" && !e.summary) {
                    e.summary = summary;
                    applied = true;
                }
            });
            if (applied) {
                logger.info(`${logger.violet('[Bot:Global]')} ${logger.violet('[karin-plugin-imgtouch]')}${logger.green('[图片外显]')} ${summary}`);
            }
        } catch (err) {
            logger.error(`${logger.violet('[karin-plugin-imgtouch]')}${logger.red('[图片外显]')} 错误: ${err}`);
        }

        return next();
    });
    logger.info(`${logger.violet('[karin-plugin-imgtouch]')}${logger.green('[图片外显]')} 初始化完成`);
}