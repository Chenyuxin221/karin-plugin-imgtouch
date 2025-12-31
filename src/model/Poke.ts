import fs from "node:fs/promises";
import path from "node:path";
import { logger } from "node-karin";
import { config } from "@/utils/config";

const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp", ".svg"];

export async function getRandomPokeImage(): Promise<string | null> {
    try {
        const { baseDir, baseUrl, groups, excludedGroups } = config().poke;

        if (!groups || groups.length === 0) {
            logger.warn(`${logger.violet('[karin-plugin-imgtouch]')}${logger.red('[戳一戳]')} 未配置图片分组 (groups)`);
            return null;
        }

        // 过滤掉在排除列表中的分组
        const validGroups = groups.filter(group => !excludedGroups?.includes(group));

        if (validGroups.length === 0) {
             logger.warn(`${logger.violet('[karin-plugin-imgtouch]')}${logger.red('[戳一戳]')} 所有分组均被排除或列表为空`);
             return null;
        }

        const randomGroupName = validGroups[Math.floor(Math.random() * validGroups.length)];
        logger.info(`${logger.violet('[karin-plugin-imgtouch]')} 随机选中分组: ${randomGroupName}`);

        // 1. 优先尝试本地图片
        if (baseDir) {
            const targetDir = path.join(baseDir, randomGroupName);
            try {
                // 检查目录是否存在
                await fs.access(targetDir);
                const files = await fs.readdir(targetDir);
                const images = files.filter(file => {
                    const ext = path.extname(file).toLowerCase();
                    return IMAGE_EXTENSIONS.includes(ext);
                });

                if (images.length > 0) {
                    const randomImage = images[Math.floor(Math.random() * images.length)];
                    return `file://${path.join(targetDir, randomImage)}`;
                } else {
                    // 目录存在但无图片，仅警告，尝试降级到 baseUrl (如果存在)
                     logger.warn(`${logger.violet('[karin-plugin-imgtouch]')}${logger.yellow('[戳一戳]')} 本地目录为空: ${targetDir}`);
                }
            } catch (err) {
                 // 目录不存在或无法访问，仅警告，尝试降级到 baseUrl
                 logger.warn(`${logger.violet('[karin-plugin-imgtouch]')}${logger.yellow('[戳一戳]')} 本地目录不可用: ${targetDir} - ${err}`);
            }
        }

        // 2. 如果本地图片获取失败（未配置、目录不存在、无图片），尝试使用 BaseUrl
        if (baseUrl) {
            // 如果配置了模板 {name}，则进行替换
            if (baseUrl.includes('{name}')) {
                return baseUrl.replace('{name}', encodeURIComponent(randomGroupName));
            }
            // 否则按照原逻辑追加参数
            const separator = baseUrl.includes('?') ? '&' : '?';
            return `${baseUrl}${separator}name=${encodeURIComponent(randomGroupName)}`;
        }

        if (!baseDir) {
             logger.error(`${logger.violet('[karin-plugin-imgtouch]')}${logger.red('[戳一戳]')} baseDir 和 baseUrl 均未配置`);
        } else {
             logger.warn(`${logger.violet('[karin-plugin-imgtouch]')}${logger.yellow('[戳一戳]')} 本地图片获取失败且未配置 baseUrl`);
        }
        
        return null;

    } catch (error) {
        logger.error(`${logger.violet('[karin-plugin-imgtouch]')}${logger.red('[戳一戳]')} 业务逻辑错误: ${error}`);
        return null;
    }
}