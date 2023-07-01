<template>
  <div class="custom-tree-node">
    <div class="node-label">{{ nodeData[label] }}</div>
    <div class="node-suffix">
      <svg-icon icon-class="vertical-more" @click.stop="emitMore" />
      <!-- <div v-if="showMenu" class="node-context-menu">
        <div class="node-context-menu-item">编辑部门</div>
        <div class="node-context-menu-item primary-color">添加部门</div>
        <div class="node-context-menu-item alert-color">删除部门</div>
      </div> -->
    </div>
  </div>
</template>

<script>
import SvgIcon from '@/components/SvgIcon'
export default {
  name: 'CustomTreeNode',
  components: { SvgIcon },
  props: {
    node: {
      type: Object,
      required: true
    },
    nodeData: {
      type: Object,
      required: true
    },
    showMenu: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: 'label'
    }
  },
  data() {
    return {
    }
  },
  mounted() {
    // console.log('this.node =', this.node)
    // console.log('this.nodeData =', this.nodeData)
  },
  methods: {
    emitMore(e) {
      this.$emit('more', e, this.nodeData)
    }
  }
}
</script>

<style lang="scss" scoped>
.custom-tree-node {
  width: 100%;
  height: 36px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .node {
    &-label {
    }
    &-suffix {
      width: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      svg {
        width: 18px;
        height: 30px;
      }
      // .node-context-menu {
      //   position: absolute;
      //   left: 0;
      //   // right: -100%;
      //   // top: 100%;
      //   top: 0;
      //   width: 100px;
      //   padding: 10px 0;
      //   background-color: #fff;
      //   transform: translateX(-100%);
      //   box-shadow: 0px 0px 5px rgb(0 0 0 / 35%);
      //   z-index: 999;
      //   &-item {
      //     height: 30px;
      //     line-height: 30px;
      //     text-align: center;
      //     &:hover {
      //       background-color: rgba(210, 239, 253, 1);
      //     }
      //   }
      // }
    }
  }
}
</style>
