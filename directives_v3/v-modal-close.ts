/** dialog标签 点击modal关闭
 *  该指令应绑定在dialog标签上
 */
const dialogModalClose:DirectiveObj = {
  name: 'modal-close',
  directive:{
    mounted: (el:HTMLDialogElement) => {
      el.setAttribute('modal', '')
      el.addEventListener('click', (e)=>{
        if(!e.target)return
        const modalClicked = e.target.hasAttribute('modal')
        if(modalClicked)el.close()
      })
    },
  }
}

export default {
  install(app){
    app.directive(dialogModalClose.name, dialogModalClose.directive)
  }
}