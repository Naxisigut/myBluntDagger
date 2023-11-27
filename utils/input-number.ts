
/* v1.10 20231127 */

/** 只保留字符串内的数字
 * 
 * @param val 
 * @returns 
 */
export const sanitize2Number = (val:string) => val.replace(/[^0-9]/g, '')

/** 只保留字符串内的数字，小数点
 * 
 * @param val 
 * @returns 
 */
export const sanitize2NumberDot = (val:string) => val.replace(/[^0-9.]/g, '')

/** 只保留字符串内的数字，负号
 * 
 * @param val 
 * @returns 
 */
export const sanitize2NumberMinus = (val:string) => val.replace(/[^0-9-]/g, '')

/** 只保留字符串内的数字，负号，小数点
 * 
 * @param val 
 * @returns 
 */
export const sanitize2NumberMinusDot = (val:string) => val.replace(/[^0-9.-]/g, '')

/** 将字符串最前面的连续0+数字替换为该数字
 *  如 0001 => 1
 * @param val 
 * @returns 
 */
export const sanitizeSequentialZero = (val: string) => val.replace(/^0+(?=\d)/, '')

/** 只保留字符串内的首个小数点
 *  如 1.2.3 => 1.23
 * @param val 
 * @returns 
 */
export const sanitize2OneDot = (val: string) => val.replace('.','$#$').replace(/\./g,'').replace('$#$','.')

/** 只保留字符串的位于最开头的负号
 * 如 -1-2 => -12, 1-2 => 12
 * @param val 
 * @returns 
 */
export const sanitize2FirstMinus = (val: string) => {
  const regex = /^(-)|-/g; // 匹配开头的负号和其他负号
  return val.replace(regex, '$1'); // 替换其他负号为空字符串，保留开头的负号
}

/** 保留小数点后的固定位数
 * 
 * @param val 
 * @param digits 要保留的位数 
 * 
 */
export const sanitizeFixedDigits = (val: string, digits: number) => {
  if(digits <= 0)throw new Error('digits should be positive int')
  if(digits.toString().includes('.'))throw new Error('digits should be positive int')
  const reg = new RegExp(`(\\.\\d{${digits}})\\d+$`) // 动态生成正则
  return val.replace(reg, '$1') 
}

/** 限定字符串为非负整数
 * 
 * @param val 
 * @returns 
 */
export const toNonNegativeInt = (val:string)=> sanitizeSequentialZero(sanitize2Number(val));

/** 限定输入非负数
 * 
 * @param val 
 * @returns 
 */
export const toNonNegative = (val:string)=> sanitize2OneDot(sanitizeSequentialZero(sanitize2NumberDot(val)));

/** 限定输入整数
 * 
 * @param val 
 * @returns 
 */
export const toInt = (val:string)=>{
  const res1 = sanitize2FirstMinus(sanitize2NumberMinus(val))
  let isPositive = !res1.startsWith('-')
  let positivePart = res1.startsWith('-') ? res1.slice(1) : res1
  return `${isPositive ? '' : '-'}${sanitizeSequentialZero(positivePart)}`
}

/** 限定输入数字
 * 
 * @param val 
 * @returns 
 */
export const toNumber = (val:string)=>{
  const res1 = sanitize2FirstMinus(sanitize2NumberMinusDot(val))
  let isPositive = !res1.startsWith('-')
  let positivePart = res1.startsWith('-') ? res1.slice(1) : res1
  return `${isPositive ? '' : '-'}${sanitize2OneDot(sanitizeSequentialZero(positivePart))}`
}

type SanitizeOption = {
  isMinusAllowed?: boolean,
  isDotAllowed?: boolean,
  digits?: number
}

/** 数字字符串的输入处理
 * 
 * @param val 
 * @param option 处理配置
 * - isMinusAllowed 是否允许负数,  不传默认为false
 * - isDotAllowed 是否允许小数，不传默认为false
 * - digits 保留位数，仅在允许小数时生效，小于1时保留1位; 不填则默认保留任意位数。
 * @returns 
 */
export const numSanitize = (val: string | number, option: SanitizeOption = {})=>{
  if(typeof val === 'number')return val
  let { isDotAllowed, isMinusAllowed, digits }  = option
  if(digits !== undefined){
    digits = Math.max(1, digits)
    digits = parseInt(digits.toString())
  }

  // 过滤
  if(isDotAllowed && isMinusAllowed){
    val = sanitize2NumberMinusDot(val)
  }else if(isDotAllowed){
    val = sanitize2NumberDot(val)
  }else if(isMinusAllowed){
    val = sanitize2NumberMinus(val)  
  }else{
    val = sanitize2Number(val)
  }

  // 处理负号：只保留位于首位的负号, 并将其提取出来
  if(isMinusAllowed){
    val = sanitize2FirstMinus(val)
  }
  let isPositive = !val.startsWith('-')
  val = val.startsWith('-') ? val.slice(1) : val
  // 处理字符串首连续0
  val = sanitizeSequentialZero(val)
  // 处理小数点
  if(isDotAllowed){
    val = sanitize2OneDot(val)
    if(val.startsWith('.'))val = '0' + val
    // 保留位数
    if(digits !== undefined){
      val = sanitizeFixedDigits(val, digits)
    }
  }

  // 还原负号
  return `${isPositive ? '' : '-'}${val}`
}

const enum CharactorTypes{
  DOT = 'dot',
  MINUS = 'minus',
  NUMBER = 'number',
  OTHER = 'other'
}
const enum commandTypes{
  KEEP = 1,
  DELETE = 2,
  DELETE_PREV_ONE = 3,
  DELETE_NEXT_ALL = 4
}
export function iptNumFilter_1(val: string, option: SanitizeOption = {}){
  function createCtx(source, option){
    let digits = option.digits === undefined ? Infinity : Math.floor(Math.max(1, option.digits))
    const ctx = {
      source,
      dotAllowed: !!option.isDotAllowed,
      minusAllowed: !!option.isMinusAllowed,
      digits,

      dot: false,
      minus: false,
      currentDigits: 0,
      result: '',
      shift(){ // 删除source首个字符并返回
        const ch = ctx.source.slice(0, 1)
        ctx.stepIn()
        return ch
      },
      stepIn(){ // 删除source首个字符
        ctx.source = ctx.source.slice(1)
      },
      resStart(ch){ // result是否以某字符开头
        return ctx.result.startsWith(ch)
      },
      behead(){ // 删除result首个字符
        ctx.result = ctx.result.slice(1)
      },
      expand(ch){ // 在result尾部加入字符
        ctx.result += ch
      },
      postProcess(){
        while(ctx.resStart('0') || ctx.resStart('-')){
          ctx.behead()
        }
        if(ctx.resStart('.')){
          ctx.result = `0${ctx.result}`
        }
        if(ctx.minus)ctx.result = `-${ctx.result}`
      }
    }
    return ctx
  }
  function isEnd(ctx){
    return ctx.source.length === 0 || ctx.currentDigits >= ctx.digits
  }
  function isEnough(ctx){
    return ctx.dot && ctx.currentDigits >= ctx.digits
  }
  function getFirstChType(ctx){
    const ch = ctx.shift()
    let type = CharactorTypes.OTHER
    if(/\d/.test(ch)){
      type = CharactorTypes.NUMBER
    }else if(ch === '.'){
      type = CharactorTypes.DOT
    }else if(ch === '-'){
      type = CharactorTypes.MINUS
    }
    return{
      ch,
      type
    }
  }
  function handleNumber(ctx: any, ch: string) {
    if(!ctx.dot){
      ctx.expand(ch)
      return
    }
    if(!isEnough(ctx)){
      ctx.expand(ch)
      ctx.currentDigits++
      return
    }
  }
  function handleMinus(ctx: any, ch: string) {
    if(!ctx.minusAllowed || ctx.minus)return
    ctx.expand(ch)
    ctx.minus = true
  }
  function handleDot(ctx: any, ch: string) {
    if(!ctx.dotAllowed || ctx.dot)return
    ctx.expand(ch)
    ctx.dot = true
  }
  // debugger
  const ctx = createCtx(val, option)

  while(!isEnd(ctx)){
    const { ch, type } = getFirstChType(ctx)
    switch (type) {
      case CharactorTypes.DOT:
        handleDot(ctx, ch)
        break;
      case CharactorTypes.NUMBER:
        handleNumber(ctx, ch)
        break;
      case CharactorTypes.MINUS:
        handleMinus(ctx, ch)
        break;
    
      default:
        break;
    }
  }

  ctx.postProcess()
  return ctx.result
}


export function iptNumFilter_2(val: string, option?: SanitizeOption){
  const ctx = createCtx(val, option)
  while(ctx.pointer < ctx.source.length){
    // debugger
    const { type } = getChType(ctx, ctx.pointer)
    let command
    switch (type) {
      case CharactorTypes.NUMBER:
        command = getNumCommand(ctx)
        break;
      case CharactorTypes.MINUS:
        command = getMinusCommand(ctx)
        break;
      case CharactorTypes.DOT:
        command = getDotCommand(ctx)
        break;

      default: // CharactorTypes.Other
        command = commandTypes.DELETE
        break;
    }

    ctx.excute(command)
    
  }

  return ctx.source
}

function genOption(option: SanitizeOption = {}){
  const newOption: SanitizeOption = {
    digits: option.digits === undefined ? Infinity : Math.floor(Math.max(1, option.digits)),
    isDotAllowed: !!option.isDotAllowed,
    isMinusAllowed: !!option.isMinusAllowed
  }
  return newOption
}
function createCtx(val: string, option?: SanitizeOption){
  const newOption = genOption(option)
  // 操作: 删除 保留 删除前一个字符
  const ctx = {
    source: val,
    option: newOption,
    pointer: 0,
    dotIndex: -1,
    delete(targetIndex: number){ // 删除指定位置的单个字符
      const endIndex = ctx.source.length
      ctx.source = ctx.source.slice(0, targetIndex) + ctx.source.slice(targetIndex + 1, endIndex)
    },
    cross(){
      ctx.pointer++
    },
    docking(index){ // 去除尾部，不包含index对应的值
      ctx.source = ctx.source.slice(0, index)
    },
    isNegative(){
      return ctx.option.isMinusAllowed && ctx.source[0] === '-'
    },
    isDotted(){
      return ctx.dotIndex !== -1 
    },
    excute(command){
      switch (command) {
        case commandTypes.DELETE:
          ctx.delete(ctx.pointer)
          break;
        case commandTypes.DELETE_PREV_ONE:
          ctx.delete(ctx.pointer - 1)
          break;
        case commandTypes.DELETE_NEXT_ALL:
          ctx.docking(ctx.pointer + 1)
          ctx.pointer = ctx.source.length
          break;
        case commandTypes.KEEP:
          ctx.cross()
          break;
      
        default:
          break;
      }
    }
  }
  return ctx
}
function getChType(ctx, index){
  const ch = ctx.source[index]
  let type = CharactorTypes.OTHER
  if(/\d/.test(ch)){
    type = CharactorTypes.NUMBER
  }else if(ch === '.'){
    type = CharactorTypes.DOT
  }else if(ch === '-'){
    type = CharactorTypes.MINUS
  }
  return{
    ch,
    type
  }
}
function getMinusCommand(ctx){
  const { option: { isMinusAllowed } } = ctx

  if(!isMinusAllowed)return commandTypes.DELETE
  if(ctx.pointer !== 0)return commandTypes.DELETE
  return commandTypes.KEEP
}
function getDotCommand(ctx){
  const { option: { isDotAllowed } } = ctx

  if(!isDotAllowed)return commandTypes.DELETE
  if(ctx.isDotted())return commandTypes.DELETE
  if(ctx.pointer === 0)return commandTypes.DELETE

  ctx.dotIndex = ctx.pointer
  return commandTypes.KEEP
}
function getNumCommand(ctx){
  const { option: {isDotAllowed, digits}} = ctx
  // 小数-整数部分: 去除前置的0
  // 小数-小数部分: 满足位数限制
  // 整数: 去除前置的0

  
  // 小数-小数部分处理
  if(isDotAllowed && ctx.isDotted()){ 
    const currDigits = ctx.pointer - ctx.dotIndex
    if(currDigits === digits){
      return commandTypes.DELETE_NEXT_ALL
    }
  }
  
  // 整数 或 小数-整数部分
  else{ 
    // 正数中，最前为0且继续输入数字时，这个0是多余的
    if(ctx.pointer === 1 && ctx.source.startsWith('0')){ // 01 => 1
      return commandTypes.DELETE_PREV_ONE
    }

    // 负数中, 第2位是0且继续输入数字时，这个0是多余的
    if(ctx.pointer === 2 && ctx.source.startsWith('-0')){ // -01 => -1
      return commandTypes.DELETE_PREV_ONE
    }
  }
  return commandTypes.KEEP

}





