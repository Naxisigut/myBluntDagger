<template>

    <div class="flex justify-center">
      <button class="flex items-center px-3 w-1/2 max-w-xs h-10 text-stone-400 rounded-full min-w-max ring-1 ring-slate-200 hover:ring-slate-300" @click="clickSearch">
        <svg width="24" height="24" fill="none" aria-hidden="true" class="mr-3 flex-none">
          <path d="m19 19-3.5-3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          </path>
          <circle cx="11" cy="11" r="6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          </circle>
        </svg>
        <p class="flex-1 text-left">请输入...</p>
        <p class="hidden sm:block">Ctrl+K</p>
      </button>
    </div>

    <dialog v-modal-close v-k-open v-key-select class="p-0 rounded-lg " ref="searchPop" id="dialog">
      <div class="flex flex-col w-[80vw] max-w-lg h-[70vh]">
        <div class="flex items-center leading-8 text-slate-400 p-4 border-b-2 border-slate-300">
          <svg width="24" height="24" fill="none" aria-hidden="true" class="mr-3 flex-none">
            <path d="m19 19-3.5-3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            </path>
            <circle cx="11" cy="11" r="6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            </circle>
          </svg>
          <input type="text" v-model="keyWord" class=" flex-1 outline-none" placeholder="请输入...">
        </div>
        <div v-if="!searchRes.length" class="p-4 leading-8 text-center">暂无搜索结果</div>
        <ul v-else id="searchResults" class="flex-1 h-0 overflow-auto scrollbar" >
          <li v-for="(item, index) in searchRes" @click="trigger(item)" :key="index" class="key-selectable px-8 py-4 leading-8 border-b-2 border-slate-100 hover:bg-slate-100">
            {{item.name}}
          </li>
        </ul>
      </div>
    </dialog>

</template>

<script setup lang="ts">
import {ref, computed} from 'vue';

const props = defineProps({
  /* 数据源 */
  source: {
    type: Array<searchDataItem>,
    required: true,
  },
})

/* 搜索功能 */
const keyWord = ref('')
const searchRes = computed(()=>{
  if(!keyWord.value)return []
  return props.source.filter(i => i.name.includes(keyWord.value))
});


/* 点击搜索栏 */
const searchPop = ref()
const clickSearch = ()=>{
  searchPop.value.showModal()
}


/* 点击搜索结果项 */
const emit = defineEmits(['trigger'])
const trigger = (item: searchDataItem)=>{
  searchPop.value.close()
  emit('trigger', item)
}

/* 指令：按键K开启弹窗 */
const vKOpen = {
  mounted: (el:HTMLDialogElement) => {
    // console.log('mounted');
    // 禁止ctrl+k默认行为
    const keyDownHandler = (e: KeyboardEvent) => {
      if(e.code === 'KeyK' && e.ctrlKey) e.preventDefault()
    }
    el.keyDownHandler = keyDownHandler
    window.addEventListener('keydown', keyDownHandler)

    // ctrl + k 打开dialog
    const keyUpHandler = (e:KeyboardEvent) => {
      if(e.ctrlKey && e.code === 'KeyK' && el.getAttribute('open') === null)el.showModal()
    }
    el.keyUpHandler = keyUpHandler
    window.addEventListener('keyup', keyUpHandler)
  },
  beforeUnmount: (el: HTMLDialogElement) => {
    // console.log('beforeUnmount');
    // 元素销毁前移除全局监听
    window.removeEventListener('keydown', el.keyDownHandler)
    window.removeEventListener('keyup', el.keyUpHandler)
  },
}

/* 指令：点击modal关闭弹窗 */
const vModalClose = {
  mounted: (el:HTMLDialogElement) => {
    el.setAttribute('modal', '')
    el.addEventListener('click', (e)=>{
      if(!e.target)return
      const modalClicked = e.target.hasAttribute('modal')
      if(modalClicked)el.close()
    })
  },
}

</script>

<style scoped>
dialog{
  animation: slideDown .5s ease;
}
dialog::backdrop{
  backdrop-filter: blur(1px);
  animation: slowIn .5s ease;
}
ul>li{
  animation: slowIn .5s ease;
}
.key-selectable[selected]{
  background: #f1f5f9;
}
@keyframes slideDown {
  from {
    transform: translateY(100vh);
  }
  to {
    transform: translateY(0);
  }
}
@keyframes slowIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.scrollbar::-webkit-scrollbar {
  width: 10px;
  height: 20px;
}

.scrollbar::-webkit-scrollbar-track {
  border-radius: 100vh;
  background: #f1f5f9;
}

.scrollbar::-webkit-scrollbar-thumb {
  background: #cad4e1;  
  border-radius: 100vh;
  border: 2px solid #f1f5f9;
}

.scrollbar::-webkit-scrollbar-thumb:hover {
  background: #c0a0b9;
}
</style>
