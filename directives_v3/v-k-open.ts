
/** dialog标签 Ctrl+K 快捷键打开
 *  该指令应绑定在dialog标签
 */
const dialogKeyOpen: DirectiveObj = {
  name: 'k-open',
  directive:{
    mounted: (el:HTMLDialogElement) => {
      // console.log('mounted');
      // 禁止ctrl+k默认行为
      const keyDownHandler = (e: KeyboardEvent) => {
        if(e.code === 'KeyK' && e.ctrlKey) e.preventDefault()
      }
      el.keyDownHandler = keyDownHandler
      window.addEventListener('keydown', keyDownHandler)

      // ctrl + k 打开dialog
      const keyUpHandler = (e:KeyboardEvent) => {
        if(e.ctrlKey && e.code === 'KeyK' && el.getAttribute('open') === null)el.showModal()
      }
      el.keyUpHandler = keyUpHandler
      window.addEventListener('keyup', keyUpHandler)
    },
    beforeUnmount: (el: HTMLDialogElement) => {
      // 元素销毁时移除全局监听
      window.removeEventListener('keydown', el.keyDownHandler)
      window.removeEventListener('keyup', el.keyUpHandler)
    },
  }
}

export default {
  install(app){
    app.directive(dialogKeyOpen.name, dialogKeyOpen.directive)
  }
}