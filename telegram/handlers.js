import { isMember, addMember } from '../db/sqlite.js'
import { isBlacklisted } from './blacklist.js'
import { freezeTRX } from '../tron/energy.js'
import { swapUSDTtoTRX } from '../tron/swap.js'

export async function handleStart(ctx) {
  const userId = ctx.from.id
  const userName = ctx.from.username || ctx.from.first_name || '用户'

  if (await isBlacklisted(userId)) {
    return ctx.reply('抱歉，你在黑名单中，无法使用本机器人。')
  }

  // 简单自动加会员（也可改成管理员审批）
  if (!(await isMember(userId))) {
    await addMember(userId)
  }

  await ctx.reply(`欢迎，${userName}！请发送你的 TRON 地址以租借能量或进行闪兑。发送 /menu 查看菜单。`)
}

export async function handleMenu(ctx) {
  await ctx.reply('菜单功能尚未完善，敬请期待！')
}

export async function handleMessage(ctx) {
  const msg = ctx.message.text.trim()

  // 简单验证地址格式
  if (!/^T[a-zA-Z0-9]{33}$/.test(msg)) {
    return ctx.reply('请输入有效的 TRON 地址，例如以 T 开头，长度34位。')
  }

  if (await isBlacklisted(ctx.from.id)) {
    return ctx.reply('抱歉，你在黑名单中，无法使用本机器人。')
  }

  if (!(await isMember(ctx.from.id))) {
    return ctx.reply('你不是会员，无法使用本功能。请联系管理员加入会员。')
  }

  try {
    // 先冻结 5 TRX 能量示例
    await freezeTRX(5, 'ENERGY', msg)
    // 示例调用闪兑，0.1 USDT 兑换 TRX
    const receivedTRX = await swapUSDTtoTRX(0.1)

    await ctx.reply(`已为地址 ${msg} 租借能量，并兑换约 ${receivedTRX.toFixed(4)} TRX。`)
  } catch (err) {
    console.error(err)
    await ctx.reply('处理请求时发生错误，请稍后重试。')
  }
}
