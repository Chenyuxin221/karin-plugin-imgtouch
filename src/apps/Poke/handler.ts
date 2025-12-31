import karin, { segment, logger} from "node-karin";
import { getRandomPokeImage } from "@/model/Poke";

export const groupPoke = karin.accept(
    "notice.groupPoke",
    async (ctx, next) => {
        if (ctx.content.targetId !== ctx.selfId) return next();

        const imagePath = await getRandomPokeImage();
        if (imagePath) {
            logger.info(`${logger.violet(`[Bot:${ctx.selfId}]`)} ${logger.violet('[karin-plugin-imgtouch]')}${logger.green('[戳一戳]')} 发送图片: ${imagePath}`);
            await ctx.reply(segment.image(imagePath));
        }
        
        return next();
    },
    { name: '随机图片' }
);
