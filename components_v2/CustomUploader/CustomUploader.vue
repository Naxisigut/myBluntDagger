<template>
  <div class="custom-uploader">
    <div class="uploader-wrapper">
      <!-- UPLOADER -->
      <el-upload
        v-if="trigVisible"
        action="#"
        class="uploader"
        :http-request="upload"
        :show-file-list="false"
        :disabled="disabled || disabledByNum"
      >
        <template>
          <div class="uploader-trigger item" @click="handleClick">
            <i v-if="!uploading" class="el-icon-plus" />
            <div v-if="!uploading">上传图片</div>
            <div v-if="uploading">上传中...</div>
          </div>
        </template>
      </el-upload>

      <!-- FILE LIST -->
      <div v-for="(path, index) in filePaths" :key="index" class="file-thumb item">
        <img :src="path" alt="" @click.stop="handlePreview(path)">
        <div v-if="!displayMode" class="icon-wrapper">
          <i class="el-icon-close" @click.stop="handleRemove(path)" />
        </div>
      </div>

    </div>

    <!-- UPLOAD TIP -->
    <div v-if="!displayMode" class="custom-tip">
      <slot name="custom-tip" class="tip" />
    </div>

    <!-- IMG PREVIEW POP -->
    <el-dialog :visible.sync="previewDialog.dialogVisible">
      <img width="100%" :src="previewDialog.dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import { get_AliOSS_policy, file_upload } from '@/api/API_other'
export default {
  model: {
    prop: 'src',
    event: 'modelUpdate'
  },
  props: {
    /* 数量限制 */
    // 多文件模式下生效
    limit: {
      type: Number,
      default: 0
    },

    /* vmodel双向绑定值 */
    // Array类型为多文件模式
    // 其余为单文件模式
    src: {
      type: [String, Array],
      required: true
    },

    /* 主动禁用 */
    // 父组件主动的禁用，区别于内部维护的数量上限禁用
    disabled: {
      type: Boolean,
      default: false
    },

    /* 显示模式 */
    // 显示模式不显示trigger，只显示图片列表
    // 图片可预览，不可删除
    // 不显示tip
    displayMode: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      previewDialog: {
        dialogVisible: false,
        dialogImageUrl: ''
      },
      uploading: false
    }
  },
  computed: {
    /* 单/多文件模式 */
    // 绑定的src为数组类型时为多文件模式，其它类型均为单文件模式
    monoMode() {
      return !Array.isArray(this.src)
    },

    /* 当前文件列表是否为空 */
    // 根据绑定的src判断，不根据当前upload的file数量判断
    isEmpty() {
      if (this.monoMode && !this.src) return true
      if (!this.monoMode && !this.src.length) return true
      return false
    },

    /* 渲染到页面上的图片列表 */
    filePaths() {
      if (this.isEmpty) return []
      if (this.monoMode) return [this.src]
      return this.src
    },

    /* 数量达上限禁用 */
    // 单文件模式下，默认数量上限为1，limit无效
    // 多文件模式下，默认不限制数量，limit生效
    disabledByNum() {
      if (this.monoMode && !this.isEmpty) return true
      if (!this.monoMode && this.limit && this.filePaths.length >= this.limit) return true
      return false
    },

    /* trigger是否隐藏 */
    // 展览模式下隐藏
    // 单文件模式下若已有图片，隐藏
    trigVisible() {
      if (this.displayMode || (this.monoMode && !this.isEmpty)) return false
      return true
    }
  },
  methods: {
    /* 触发trigger前，判断是否达到数量上限 */
    handleClick() {
      if (this.disabledByNum) {
        this.$message.error(`最多选择${this.limit ? this.limit : 1}张图片`)
      }
    },
    /* 上传接口 */
    upload({ file }) {
      this.uploading = true
      const formData = new FormData()
      // 获取Policy
      get_AliOSS_policy().then(res => {
        const ossPolicy = res.data
        const fileSuffix = file.name.split('.').pop() // 文件格式后缀
        const timeFlag = Date.now()
        const key = ossPolicy.dir + '/' + timeFlag + '.' + fileSuffix // 文件名
        formData.append('OSSAccessKeyId', ossPolicy.accessId)
        formData.append('signature', ossPolicy.signature)
        formData.append('policy', ossPolicy.policy)
        formData.append('key', key)// 注意顺序，file要在key的后面。不然会返回找不到key 的错误
        formData.append('file', file)
        formData.append('success_action_status', 200)
        // 上传图片
        return file_upload(ossPolicy.host, formData)
      }).then(res => {
        if (res.status === 200) {
          // 拼接地址并更新数据
          const retUrl = 'https://ruijun.oss-cn-hangzhou.aliyuncs.com/' + formData.get('key')
          this.$emit('modelUpdate', this.monoMode ? retUrl : [...this.src, retUrl])
        }
      }).finally(() => {
        this.uploading = false
      })
    },

    /* 预览图片 */
    handlePreview(path) {
      this.previewDialog.dialogImageUrl = path
      this.previewDialog.dialogVisible = true
    },
    /* 删除图片 */
    handleRemove(path) {
      // 注意：不直接操作src
      if (this.monoMode) this.$emit('modelUpdate', '')
      else {
        const tempList = [...this.src]
        const idx = this.src.findIndex(i => i === path)
        tempList.splice(idx, 1)
        this.$emit('modelUpdate', tempList)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.uploader-wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fill, 80px);
  grid-gap: 10px;
  .item {
    width: 80px;
    height: 80px;
    border: 1px dashed #c0ccda;
    background-color: #f2f2f2;
    border-radius: 6px;
  }
}

.uploader-trigger {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  line-height: 1;
  .el-icon-plus {
    font-size: 22px;
    color: #8c939d;
  }
  div {
    margin-top: 5px;
    font-size: 12px;
    color: #7f7f7f;
  }
}

.file-thumb {
  position: relative;
  overflow: hidden;
  &:hover {
    .icon-wrapper {
      display: block;
    }
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: fill;
    cursor: pointer;
  }
  .icon-wrapper {
    display: none;
    position: absolute;
    top: 0;
    right: 0;
    border-radius: 50%;
    transform: translate(50%, -50%);
    background: #fff;
    border: 1px solid #8c939d;
    transition: all ease-in-out 0.3s;
    width: 40px;
    height: 40px;
    cursor: pointer;
    .el-icon-close {
      position: absolute;
      bottom: 30%;
      left: 30%;
      transform: translate(-50%, 50%);
      color: #8c939d;
    }
  }
}

.custom-tip {
  font-size: 12px;
  line-height: 20px;
  color: #7f7f7f;
}
</style>
