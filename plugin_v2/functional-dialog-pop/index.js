import Vue from 'vue'
import DialogPopOptionObject from './index.vue'
// DialogPopOptionObject: 组件选项对象
// DialogPopConstructor: 组件constructor
// new DialogPopConstructor(): 组件实例对象
const DialogPopConstructor = Vue.extend(DialogPopOptionObject)

let instanceArray = [] // 实例栈

/** 实例销毁方法
 * 1.destroy生命周期
 * 2.移除dom
 * 3.从实例栈中删除
 * 4.在组件关闭时自动调用
 */
function handleDestroy(){
  this.$nextTick(() => {
    this.$destroy()
    document.querySelector('body').removeChild(this.$el)
    const index = instanceArray.indexOf(this)
    if(index !== -1){
      instanceArray.splice(index, 1)
    }
  })
}
/** 新增实例方法
 * 
 * @param {配置对象} data
 *  - dom: 弹窗内容，可以是组件配置对象（引入的vue文件）
 *  - coexist: 是否与上一个弹窗共存；为true则直接打开弹窗，为false则关闭上一个弹窗后再打开
 *  - isShowFootBtn: 是否显示底部按钮
 *  - confirmText: 确认按钮文字内容，默认为"确 认"
 *  - title: 弹窗标题，默认为空字符串
 *  - isShowClose: 是否显示关闭图标，默认显示
 *  - width: 弹窗宽度，默认为550px
 *  - cancelClick: 关闭弹窗时会触发的钩子，必须是函数。传入参数为组件实例对象（包含caller组件实例，wrapper组件实例，内容组件实例。下同）
 *  - saveClick: 点击默认提供的确认按钮后触发的钩子，必须是函数。传入的参数依次为组件实例对象和调用Confirm时传入的参数
 *  - customSave: 弹窗内容组件调用customBtn方法后触发的钩子，必须是函数。传入的参数依次为组件实例对象和调用CustomBtn时传入的参数
 * @returns 
 */
const dialogPopFn = function (data) {
  if (!data.dom) { console.log('弹窗参数缺失！'); return false }
  const prevInstance = instanceArray[instanceArray.length -1]
  if(!data.coexist){
    prevInstance.visible = false
  }
  const mergedData = {
    ...data,
    caller: this // 指向callerComponentInstance
  }
  const instance = new DialogPopConstructor({
    parent: this,
    data: mergedData,
    methods: {
      handleDestroy
    }
  }).$mount()
  document.body.appendChild(instance.$el)
  instanceArray.push(instance)
}

export default {
  install(Vue, option){
    Vue.prototype.$dialogPop = dialogPopFn
  }
}


/* 弹窗内容 */
// 1. 弹窗内容由data的dom决定，需要传入一个组件选项对象（引入的vue文件）
// 2. 弹窗内容组件 接收的props
//    1) option：data内的option属性，可以传入任意在弹窗内容组件中会使用到的数据
//    2) that: 调用$dialogPop方法的组件实例对象
// 3. 弹窗内容组件 注入的方法
//    1) Cancel: 调用后关闭弹窗，触发cancelClick钩子
//    2) Confirm: 调用后触发saveClick钩子
//    3) controlConfirmLoad: 对象，包含start和end两个方法，控制默认确定按钮的loading状态
//    4) CustomBtn: 调用后触发customSave钩子
// 4. 使用注意和建议
//    1) 弹窗内容组件的状态，方法和逻辑尽量在组件内部完成，与外部组件去耦合。不建议在customSave，cancelClick等钩子内直接对组件实例进行过于复杂的操作。
//    2) 建议使用自定义按钮（isShowFootBtn = false），确认并关闭：customBtn + Cancel; 取消: Cancel
//    2) 点击右上方关闭按钮同样会触发cancelClick

