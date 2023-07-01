<template>
  <div class="custom-list">
    <!-- list funcs bar -->
    <div v-if="funcs.isRender" class="funcs-bar">
      <!-- funcs bar left -->
      <div class="left">
        <p v-if="cols.first == 'selection'">已选择{{ tableSelects.length }}条记录</p>
        <template v-if="funcs.leftBtns">
          <span
            v-for="btn in funcs.leftBtns"
            v-show="btn.visible !== false"
            :key="btn.ref"
            :ref="btn.ref"
            class="btn func-btn"
            :class="[tableSelects.length ? btn.class : 'disabled']"
            @click="trig(btn.event, tableSelects)"
          >
            {{ btn.text }}
          </span>
        </template>
      </div>
      <!-- funcs bar right -->
      <div v-if="funcs.rightBtns" class="right">
        <span
          v-for="btn in funcs.rightBtns"
          v-show="btn.visible !== false"
          :key="btn.ref"
          :ref="btn.ref"
          class="btn func-btn"
          :class="btn.class"
          @click="trig(btn.event, tableSelects)"
        >
          {{ btn.text }}
        </span>
      </div>
    </div>

    <slot name="above-table" />

    <!-- list table -->
    <el-table :data="listData" @selection-change="handleTableSelect">
      <el-table-column v-if="cols.first" :type="cols.first" />
      <el-table-column v-for="item in cols.rest" :key="item.attrs.prop" v-bind="item.attrs">

        <!-- 过滤器列 -->
        <template v-if="item.type === 'fixer'" v-slot="{row}">
          <div :class="item.fixer(row).class || ''">
            {{ item.fixer(row).fixer }}
          </div>
        </template>

        <!-- Html列 -->
        <template v-else-if="item.type === 'html'" v-slot="{row}">
          <div v-html="item.html(row)" />
        </template>

        <!-- 操作列 -->
        <template v-else-if="item.type === 'acts'" v-slot="{row}">
          <span
            v-for="act, actId in item.acts(row)"
            v-show="act.visible !== false"
            :key="actId"
            :class="`act ${act.class || ''}`"
            @click="trig(act.event, row)"
          >
            {{ act.text }}
          </span>
        </template>

        <!-- 图片列 -->
        <template v-else-if="item.type === 'image'" v-slot="{row}">
          <img :src="item.image(row)" alt="">
        </template>

        <!-- custom-tag列 -->
        <template v-else-if="item.type === 'custom-tag'" v-slot="{row}">
          <custom-tag v-for="(tag, tagId) in item.tags(row)" :key="tagId" v-bind="tag" />
        </template>

        <!-- slot -->
        <template v-else-if="item.type === 'slot'" v-slot="{row}">
          <slot :row="row" :name="item.slot.name" />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'CustomList',
  props: {
    listData: {
      type: Array,
      default: () => ([])
    },
    cols: {
      type: Object,
      required: true
    },
    funcs: {
      type: Object,
      default: () => ({
        isRender: true,
        leftBtns: [],
        rightBtns: []
      })
    }
  },
  data() {
    return {
      tableSelects: []
    }
  },
  methods: {
    isFuncRet(prop, row) {
      // 若prop不为函数，则直接返回config; 否则，将row作为参数传入并返回执行结果，
      // 有时prop不需要row, 并无实质影响
      return prop instanceof Function ? prop(row) : prop
    },
    isShowRet(isShow, row) {
      // 若isShow为undefined(未设置),返回true
      // 若isShow为函数，返回其执行结果
      // 否则直接返回isSHow
      if (isShow === undefined) return true
      return this.isFuncRet(isShow, row)
    },
    handleTableSelect(selects) {
      this.tableSelects = selects
    },
    emitAfterBlur(ref, event, ...rest) {
      console.log('ref =', ref)
    },
    trig(event, ...rest) {
      this.$emit('customEvent', event, ...rest)
    }
  }
}
</script>

<style lang="scss" scoped>
.custom-list {
  padding: 10px;
  background-color: #fff;
  .funcs-bar {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    & > div {
      display: flex;
      align-items: center;
      &.left {
        p {
          margin-right: 10px;
        }
      }
    }
    .func-btn {
      border-radius: 2px;
      padding: 0 14px;
      text-align: center;
      height: 30px;
      line-height: 30px;
      color: #fff;
      cursor: pointer;
      &.disabled {
        background: #d7d7d7;
      }
      &.grayBtn {
        background: #d7d7d7;
      }
      &.blueBtn {
        background: #1890ff;
      }
      &.redBtn {
        background: #d9001b;
      }
      & + .func-btn {
        margin-left: 5px;
      }
    }
  }
  .el-table {
    font-size: 12px;
    color: #333;
    ::v-deep .el-table__header-wrapper {
      thead {
        color: #000;
        th {
          background-color: #f2f2f2;
          padding: 8px 0;
        }
      }
    }
    .act {
      cursor: pointer;
      & + .act {
        margin-left: 3px;
      }
      &.redBtn {
        color: #d9001b;
      }
      &.greenBtn {
        color: #039d12;
      }
    }
    img {
      width: 50px;
    }
  }
}
</style>
