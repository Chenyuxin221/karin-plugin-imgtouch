import { dir } from '@/dir'
import fs from 'node:fs'
import path from 'node:path'
import { parse } from 'yaml'
import {
  watch,
  logger,
  filesByExt,
  copyConfigSync,
} from 'node-karin'

export interface Config {
  poke: {
    baseDir: string;
    baseUrl: string;
    groups: string[];
    excludedGroups: string[];
  };
  summary: {
    enable: boolean;
    apiUrl: string;
    cacheDuration: number;
    fallbackText: string;
  };
}

/**
 * @description 初始化配置文件
 */
copyConfigSync(dir.defConfigDir, dir.ConfigDir, ['.yaml'])

/**
 *读取 YAML 配置文件
 */
const readYaml = (filePath: string) => {
  try {
    if (fs.existsSync(filePath)) {
      return parse(fs.readFileSync(filePath, 'utf8'))
    }
  } catch (err) {
    logger.error(`[karin-plugin-imgtouch] 读取配置文件失败: ${filePath}`, err)
  }
  return {}
}

/**
 * @description 配置文件
 */
export const config: () => Config = () => {
  const cfg = readYaml(path.join(dir.ConfigDir, 'config.yaml'))
  const def = readYaml(path.join(dir.defConfigDir, 'config.yaml'))
  
  // 深合并逻辑
  const merged = { ...def };
  if (cfg.poke) merged.poke = { ...def.poke, ...cfg.poke };
  if (cfg.summary) merged.summary = { ...def.summary, ...cfg.summary };
  
  return merged as Config;
}

/**
 * @description 监听配置文件
 */
setTimeout(() => {
  const list = filesByExt(dir.ConfigDir, '.yaml', 'abs')
  list.forEach(file => watch(file, () => {
    logger.info(`${logger.violet('[karin-plugin-imgtouch]')}${logger.green('[配置]')} 配置文件已更新`)
  }))
}, 2000)
