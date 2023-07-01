<template>
  <div class="panel-with-more relative overflow-hidden mb-8">
    <div ref="content">
      <slot></slot>
    </div>
    <div v-if="isFold && overflow" class=" absolute bottom-0 w-full text-center backdrop-blur-sm text-lg leading-10 ">
      <c-button type="text" @click="expand">展开</c-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import CButton from '@/components/CButton.vue';
import { ref, computed, onUpdated, onMounted} from 'vue';

const emits = defineEmits(['update:modelValue'])
const props = defineProps({
  max:{
    type: Number,
    default: 500
  },
  modelValue:{
    type: Boolean,
    required: true
  },
  loading:{
    type: Boolean,
    default: false
  },
})

/* 是否折叠及展开功能 */
const isFold = computed({
  get(){
    return props.modelValue
  },
  set(val){
    emits('update:modelValue', val)
  }
})
const expand = () => {
  isFold.value = false
}

/* 获取内容高度 */
/* 当内容高度大于最大高度时，才设置max-height并显示展开按钮 */
const content = ref<HTMLDivElement | null>(null)
const contentHeight = ref<number>(0)
const overflow = computed(()=>{
  return contentHeight.value > props.max
})
onUpdated(()=>{
  contentHeight.value = content.value?.clientHeight || 0
})
onMounted(()=>{
  contentHeight.value = content.value?.clientHeight || 0
})

/* 最大高度 */
const maxHeight = computed(() => {
  return isFold.value && overflow ? props.max + 'px' : 'initial'
})
</script>

<style scoped>
.panel-with-more{
  max-height: v-bind(maxHeight);
}
</style>