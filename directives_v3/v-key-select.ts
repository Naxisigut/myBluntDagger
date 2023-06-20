/** 指令：监听上下键和enter键，对列表项进行选择
 * 用法：
 * 1.该指令应绑定在欲选择项列表的祖先元素上；
 * 2.页面中处于聚焦状态(参见activeElement)的元素为指令绑定元素的子孙元素时，
 *   上下键选择和enter键确认的功能才会生效
 * 3.欲选择项的类名须包含key-selectable
 * 4.选中项的样式通过.key-selectable[selected]选择器来定制
 * 5.enter键功能通过对欲选择项的click事件进行监听来完成
 */
const keySelect:DirectiveObj = {
  name: 'key-select',
  directive:{
    mounted: (el:HTMLInputElement) => {
      /* 页面聚焦元素为el的子孙元素时，监听才会被触发，功能生效 */
      el.addEventListener('keydown', (e) => {
        // console.log(e);
        let actType = ''
        if(e.code === 'ArrowUp' || e.code === 'ArrowDown') {
          actType = "select"
        }else if(e.code === 'Enter' || e.code === 'NumpadEnter'){
          actType = 'confirm'
        }
        if(!actType)return
        e.preventDefault() // 阻止默认行为

        /* 获取所有可选项 */
        const list = el.querySelectorAll('.key-selectable')
        if(!list.length)return
        
        /* 获取当前选中项的下标，若当前无选中项，selectedIdx为-1 */
        let selectedIdx = -1
        for(let i = 0; i<list.length; i++){
          if(list[i].hasAttribute('selected')){
            selectedIdx = i
            break
          }
        }

        if(actType === 'select'){
          /* 移除当前选中项上的selected属性 */
          if(selectedIdx !== -1)list[selectedIdx].removeAttribute('selected')
  
          /* 获取新选中项的下标 */
          let newSelectedIdx = e.code === 'ArrowUp' ? selectedIdx -1 : selectedIdx +1
          if(newSelectedIdx < 0)newSelectedIdx = list.length -1
          if(newSelectedIdx >= list.length)newSelectedIdx = 0
  
          /* 为新选中项设置selected属性，并移动视图至该项 */
          list[newSelectedIdx].setAttribute('selected', '')
          list[newSelectedIdx].scrollIntoView({
            behavior: 'smooth',
            block: 'end',
            inline: 'nearest'
          })
          return
        }

        if(actType === 'confirm'){
          list[selectedIdx].click()
          return
        }
      })
    },
  }
}


export default {
  install(app){
    app.directive(keySelect.name, keySelect.directive)
  }
}
