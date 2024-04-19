const keyMatch = {
  up: keyUpMatch,
  down: keyDownMatch
}

function keyDownMatch(e, modifiers){
  let modifiersArr = Object.keys(modifiers)
  const keysArr = modifiersArr.filter(i => /^[a-zA-Z]$/.test(i))
  // console.log(0, keysArr);
  if(!keysArr.length)return false // 若未设置匹配键位，返回false

  const ctrlRequired = modifiersArr.includes('ctrl')
  if(ctrlRequired && !e.ctrlKey )return false // 若要求ctrl, 而未按ctrl, 返回false 
  
  const shiftRequired = modifiersArr.includes('shift')
  if(shiftRequired && !e.shiftKey )return false // 若要求shift, 而未按shift, 返回false 

  let keyName = `Key${keysArr[0].toUpperCase()}`
  // console.log(111, keyName);
  return keyName === e.code
}

function keyUpMatch(e, modifiers){
  let modifiersArr = Object.keys(modifiers)
  const keysArr = modifiersArr.filter(i => /^[a-zA-Z]$/.test(i))
  // console.log(0, keysArr);
  if(!keysArr.length)return false // 若未设置匹配键位，返回false

  let keyName = `Key${keysArr[0].toUpperCase()}`
  // console.log(111, keyName);
  return keyName === e.code
}

function addListener(el, binding){
  const { modifiers, value: loading } = binding
  el.keyDownHandler = (e) => {
    if(keyMatch.down(e, modifiers)){
      e.preventDefault()
      el.keyDownPrepared = true
    }
  }

  let debounceTimer = null // 防抖
  el.keyUpHandler = (e) => {
    if(keyMatch.up(e, modifiers) && el.keyDownPrepared){
      if(debounceTimer)clearTimeout(debounceTimer)
      debounceTimer = setTimeout(() => {
        if(loading === false)el.click()
        el.keyDownPrepared = false
      }, 1000);
    }
  }
  window.addEventListener('keydown', el.keyDownHandler)
  window.addEventListener('keyup', el.keyUpHandler)
}

function removeListener(el){
  if(el.keyDownHandler)window.removeEventListener('keydown', el.keyDownHandler)
  if(el.keyUpHandler)window.removeEventListener('keyup', el.keyUpHandler)
}

const directive = {
  name: 'keycut',
  directive:{
    bind(el, binding){
      addListener(el, binding)
    },
    update(el, binding){
      // 由于loading的值是动态的，所以需要在更新时重新监听
      removeListener(el)
      addListener(el, binding)
    },
    unbind(el){
      removeListener(el)
    }
  }
}

export default {
  install(Vue){
    Vue.directive(directive.name, directive.directive)
  }
}