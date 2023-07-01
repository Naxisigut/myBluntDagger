<template>
  <el-dialog :visible.sync="dialVisible" v-bind="dialConfig" :before-close="cancel">
    <!-- 弹窗内渲染表单 -->
    <el-form
      v-if="contentConfig.type === 'form'"
      v-bind="contentConfig.formConfigs"
      :model="formData"
    >
      <el-form-item v-for="item in contentConfig.formItems" :key="item.prop" :label="item.label" :prop="item.prop" :rules="item.rules || []">
        <template>
          <!-- 文本输入框 -->
          <el-input
            v-if="item.type === 'input'"
            v-model="formData[item.prop]"
            class="form-item-input"
            :placeholder="item.placeHolder || '请输入'"
          />
          <!-- 下拉选择框 -->
          <el-select
            v-if="item.type === 'select'"
            v-model="formData[item.prop]"
            class="form-item-select"
          >
            <el-option
              v-for="item in (item.options || []) "
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <!-- 文本域 -->
          <el-input
            v-if="item.type === 'textarea'"
            v-model="formData[item.prop]"
            type="textarea"
            class="form-item-textarea"
            :placeholder="item.placeHolder || '请输入'"
          />
          <!-- 树形下拉 -->
          <tree-select
            v-if="item.type === 'tree-select'"
            v-model="formData[item.prop]"
            class="form-item-tree-select"
            :options="item.options"
            :normalizer="item.normalizer"
            :placeholder="item.placeHolder || '请输入'"
          />
          <!-- 上传组件 -->
          <CustomUploader 
            v-if="item.type === 'upload'"
            v-model="formData[item.prop]"
          >
            <template #custom-tip>{{ item.uploadTip || '' }}</template>
          </CustomUploader>
        </template>
      </el-form-item>
    </el-form>

    <!-- 弹窗内渲染表格 -->
    <el-table
      v-if="contentConfig.type === 'table'"
      v-bind="contentConfig.tableConfigs || {}"
      :data="tableData"
    />

    <!-- 预留插槽 -->
    <slot name="extra-slot" />

    <!-- 底部 -->
    <span slot="footer" class="dialog-footer">
      <el-button class="cancelBtn" @click="cancel">取 消</el-button>
      <el-button type="primary" class="confirmBtn" @click="confirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import TreeSelect from '@riophae/vue-treeselect'
import CustomUploader from '@/components/CustomUploader';
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  name: 'CustomDialog',
  components: { TreeSelect, CustomUploader },
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    // 弹窗配置
    dialConfig: {
      type: Object,
      default: () => ({
        title: '默认标题',
        width: '360px',
        customClass: 'custom-dialog'
      })
    },
    // 内容区配置
    contentConfig: {
      type: Object,
      default: () => ({
        type: 'form',
        // 表单配置
        formConfigs: {
          labelWidth: '80px',
          labelPosition: 'left'
        },
        // 表单项配置
        formItems: [{
          type: 'input',
          label: '姓名',
          prop: 'name',
          placeHolder: '请输入姓名',
          rules: [{ required: true, trigger: 'blur' }]
        }]
      })
    },
    // 表单项数据
    formData: {
      type: Object,
      default: () => ({
        name: ''
      })
    },
    // 表格数据
    tableData: {
      type: Array,
      default: () => ([])
    }
  },
  data() {
    return {

    }
  },
  computed: {
    dialVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    }
  },
  methods: {
    cancel() {
      this.$emit('custom-close', false)
    },
    confirm() {
      this.$emit('custom-close', true)
    },
    handleNodeClick(node, data) {
      console.log('node =', node)
      console.log('data =', data)
    }
  }
}
</script>

<style>
</style>
