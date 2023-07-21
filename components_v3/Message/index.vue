<script lang="ts">
export default {
  name: 'CMessage'
}
</script>

<template>
  <transition name="slide-fade">
    <div v-if="alive" class="c-msg-wrap">
      <img v-if="props.type === 'success'" src="./icons/success.svg" alt="SVG Image">
      <img v-else-if="props.type === 'info'" src="./icons/info.svg" alt="SVG Image">
      <img v-else-if="props.type === 'error'" src="./icons/error.svg" alt="SVG Image">
      <img v-else-if="props.type === 'warning'" src="./icons/warning.svg" alt="SVG Image">
      <div class="msg-content">{{ props.content }}</div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { nextTick, ref, onMounted, computed, PropType } from 'vue';

const props = defineProps({
  content: {
    type: String,
    default: ''
  },
  duration:{
    type: Number,
    default: 1000
  },
  destroy: {
    type: Function,
    required: true
  },
  type: {
    type: String as PropType<'plain' | 'success' | 'error' | 'info' | 'warning'>,
    default: 'plain',
    // validator: (val: string) => {
    //   return ['plain', 'success', 'error', 'info', 'warning'].includes(val)
    // }
  }
})

const alive = ref<boolean>(false)

onMounted(() => {
  nextTick(()=>{
    alive.value = true
    setTimeout(()=>{
      alive.value = false
      destroy()
    }, props.duration)
  })
})

// 退出动画结束后销毁组件及应用
const destroy = () => {
  setTimeout(() => props.destroy(), 200)
}

const borderColor = computed(() => {
  switch (props.type) {
    case 'success':
      return '#67c23a';
    case 'plain':
      return '#999999';
    case 'error':
      return '#fde2e2';
    case 'info':
      return '#ebeef5';
    case 'warning':
      return '#faecd8';
    default:
      break;
  }
})
const bgColor = computed(() => {
  switch (props.type) {
    case 'success':
      return '#f0f9eb';
    case 'plain':
      return '#fff';
    case 'error':
      return '#fef0f0';
    case 'info':
      return '#edf2fc';
    case 'warning':
      return '#fdf6ec';
    default:
      break;
  }
})

</script>


<style scoped>
.c-msg-wrap{
  --border-color: v-bind(borderColor);
  --bg-color: v-bind(bgColor);

  padding: 0.4em 0.8em;
  position: absolute;
  margin: auto;
  inset: 0;
  min-width: 200px;
  width: fit-content;
  height: fit-content;
  /* text-align: center; */
  color: #666;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  background: var(--bg-color);

  display: flex;
  align-items: center;
}
.msg-content{
  padding-left: 5px;
}
img{
  width: 20px;
}

.slide-fade-enter-active {
  transition: all .2s ease-out;
}
.slide-fade-leave-active {
  transition: all .2s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}

</style>
