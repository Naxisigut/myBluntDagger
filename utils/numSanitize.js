
/* 2024.01.18 */
const CharactorTypes = {
  DOT: 'dot',
  MINUS: 'minus',
  NUMBER: 'number',
  OTHER: 'other'
}
const commandTypes = {
  KEEP: 1,
  DELETE: 2,
  DELETE_PREV_ONE: 3,
  DELETE_NEXT_ALL: 4
}

export function numSanitize(val, option){
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

function genOption(option = {}){
  const newOption = {
    digits: option.digits === undefined ? Infinity : Math.floor(Math.max(1, option.digits)),
    isDotAllowed: !!option.isDotAllowed,
    isMinusAllowed: !!option.isMinusAllowed
  }
  return newOption
}
function createCtx(val, option){
  const newOption = genOption(option)
  // 操作: 删除 保留 删除前一个字符
  const ctx = {
    source: val,
    option: newOption,
    pointer: 0,
    dotIndex: -1,
    delete(targetIndex){ // 删除指定位置的单个字符
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
