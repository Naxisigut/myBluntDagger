<template>
  <span v-if="props.type === 'text'" class="c-button">
    <slot name="default"></slot>
  </span>
  <button ref="c-btn" v-else :disabled="props.disabled" class="c-button">
    <slot name="default"></slot>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { CColor } from '../class/color';

const props = defineProps({
  disabled: Boolean, // 禁用按钮
  round: Boolean, // 胶囊按钮
  type: { // 按钮类型
    type: String,
    validator: (val: string) => ['primary', 'plain', 'text'].includes(val),
  },
  size: { // 按钮尺寸
    type: String,
    validator: (val: string) => ['mini', 'small', 'normal'].includes(val),
    default: () => 'normal'
  },
})

const textColor = computed(() => {
  if(props.type === 'primary')return '#fff'
  return 'inherit'
})

const mainColor = computed(() => {
  if(props.type === 'primary' || props.type === 'text')return '#0e7490'
  if(props.type === 'plain')return '#fff'
  return '#f2f2f2'
})

const borderColor = computed(() => {
  if(props.type === 'plain')return '#ccc'
  return 'transparent'
})

const clickingMainColor = computed(() => {
  return CColor.lighten(mainColor.value, 0.05)
})

const fontSize = computed(() => {
  switch (props.size) {
    case 'mini':
      return '12px'
    case 'small':
      return '14px'
    case 'normal':
      return '16px'
    default:
      return '16px'
  }
})

const borderRadius = computed(() => {
  if(props.round)return '999px'
  return '8px'
})

</script>

<style scoped>
span{
  color: v-bind(mainColor);
  cursor: pointer;
}
span:hover{
  color: v-bind(clickingMainColor)
}

button{
  border: 1px solid v-bind(borderColor);
  background-color: v-bind(mainColor);
  border-radius: v-bind(borderRadius);
  padding: 0.6em 1.2em;
  /* font-size: 1em; */
  font-size: v-bind(fontSize);
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  outline: 2px solid transparent;
  transition: outline-color .25s;
  line-height: normal;
  color: v-bind(textColor);
}

/* 按钮禁用 */
button:disabled{
  cursor: not-allowed;
}

/* 鼠标悬浮 */
button:hover:not(:disabled){
  outline: 2px solid -webkit-focus-ring-color;
}

/* 鼠标点击后 */
button:focus:not(:focus-visible){
}

/* 键盘选中 */
button:focus-visible {
  outline: 2px solid -webkit-focus-ring-color;
}

/* 鼠标点击中：由于优先级，须放在最后 */
button:active:focus{
  background-color: v-bind(clickingMainColor);
}

:global(.c-button + .c-button){
  margin-left: 10px;
}

</style>