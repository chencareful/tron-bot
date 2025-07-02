import { Markup } from 'telegraf'

/**
 * 生成主菜单键盘
 * @returns {Markup.InlineKeyboardMarkup}
 */
export function mainMenuKeyboard() {
  return Markup.inlineKeyboard([
    [Markup.button.callback('租借能量', 'rent_energy')],
    [Markup.button.callback('闪兑 TRX↔USDT', 'swap_trx_usdt')],
    [Markup.button.callback('会员验证', 'check_membership')],
    [Markup.button.callback('帮助', 'help')]
  ])
}
