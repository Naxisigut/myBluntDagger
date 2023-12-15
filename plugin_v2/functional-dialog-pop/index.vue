<template>
  <!-- 封装弹框 -->
  <div class="FunctionalDialogPop">
      <!-- custom-class="FunctionalDialogPop"  -->
    <el-dialog 
      top="1vh" 
      v-dialogDrag
      :title="title" 
      :visible.sync="visible" 
      :width="width"
      :show-close="showClose" 
      :before-close="onBeforeClose"
      :center="false" 
      :isShowFootBtn="isShowFootBtn" 
      :close-on-click-modal="false" 
      @closed="handleClose"
    >
      <keep-alive>
        <component ref="contentInstance" :is="dom" :option.sync="option" :caller="caller" />
      </keep-alive>
      <span slot="footer" class="dialog-footer" v-if="isShowFootBtn">
        <el-button type="primary" @click="Confirm" size="small">{{ confirmText }}</el-button>
        <el-button @click="Cancel" size="small">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
/* eslint-disable */
  export default {
    name: 'dialog-pop',
    provide(){
      return {
        Cancel: this.Cancel,
        CustomBtn: this.CustomBtn,
        Confirm: this.Confirm,
      }
    },
    data() {
      return {
        confirmText: '确 定',
        title: '', // 窗体标题
        visible: false, // 窗体显示控制
        width: '550px',
        showClose: true,
      }
    },
    mounted(){
      this.visible = true
    },
    methods: {
      // 获取组件实例
      getDialogInstace(){
        return {
          callerInstace: this.caller,
          wrapperInstance: this,
          contentInstance: this.$refs.contentInstance
        }
      },
      // 销毁组件实例并移除dom
      // handleDestroy(){
      //   this.$nextTick(() => {
      //     this.$destroy()
      //     document.querySelector('body').removeChild(this.$el)
      //   })
      // },
      Cancel() {
        this.visible = false
      },
      Confirm(...args) {
        const instances = this.getDialogInstace()
        this.saveClick(instances, ...args)
      },
      CustomBtn(...args) {
        const instances = this.getDialogInstace()
        this.customSave(instances, ...args)
      },
      handleClose(){
        const instances = this.getDialogInstace()
        this.cancelClick(instances)
        this.handleDestroy()
      },
      onBeforeClose(done) {
        done()
      },
    }
  }
</script>

<style lang="scss">
  .FunctionalDialogPop {
    .el-dialog {
      z-index: 99;
      background-color: #ffffff;
    }

    .el-dialog__header {
      width: 100%;
      height: 40px;
      line-height: 5px;
      box-sizing: border-box;
      padding: 15px 20px;
      font-size: 14px;
      text-align: left;
      background-color: #f2f2f2;
    }

    .el-dialog__close.el-icon.el-icon-close {
      font-size: 18px;
      width: 17px;
      height: 17px;
      top: -10px;
      position: relative;
      right: -5px;
      color: #000;
    }

    .el-dialog__close.el-icon.el-icon-close:hover {
      color: #66b1ff;
    }

    .el-dialog__body {
      // padding: 30px 32px;
      box-sizing: border-box;
      padding-bottom: 10px;
      padding-top: 10px;
    }

    .el-dialog__title {
      color: #000;
      font-size: 15px;
      line-height: 10px;
    }

    .el-dialog__footer {
      text-align: center;
      height: 50px;
      box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.4);

      .el-button {
        height: 32px;
        padding: 6px 20px;
      }
    }

    .el-form-item__label {
      font-size: 12px;
      color: #333333;
      font-weight: 600;
      line-height: 39px;
    }
  }
</style>
