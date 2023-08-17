// v1.0
<template>
  <div class="zoom-drag-wrap">
    <!-- <img src="./1.png" v-drag style="transform: scale(1) translateX(0px) translateY(0px); " @dragstart.prevent="" alt="" > -->
    <img :src="src" v-drag style="transform: scale(1) translateX(0px) translateY(0px)" @dragstart.prevent="" alt="" >
  </div>
</template>

<script>
export default {
  directives:{
    drag:{
      bind(el, binding){
        // 解析获取当前transform
        function parseTransform(currStyle) {
          const pattern1 = /scale\((.*?)\)/;
          const pattern2 = /translateX\((.*?)px\)/;
          const pattern3 = /translateY\((.*?)px\)/;
          const currScale = Number(currStyle.match(pattern1)[1]);
          const currX = Number(currStyle.match(pattern2)[1]);
          const currY = Number(currStyle.match(pattern3)[1]);
          return { currScale, currX, currY }
        }

        // 设置transform
        function setNewTransform(scale, translateX, translateY) {
          let newTransform = `scale(${scale}) translateX(${translateX}px) translateY(${translateY}px)`
          el.style.transform = newTransform
        }

        // 移动元素
        let timer = null
        let isThrottle = binding.modifiers.throttle
        function move(e, startStyle, startX, startY) {
          // 节流
          if(isThrottle){
            if (timer) return
            timer = setTimeout(() => { timer = null }, 10)
          }
          // console.log('move');
          // 拖拽公式：endTranslateX - startTranslateX = (currMouseX - startMouseX) * moveRatio
          const { currScale, currX, currY } = parseTransform(startStyle)
          const moveRatio = 1 / currScale // 缩小时拖拽的移动速度应加快
          const endTranslateX = (e.clientX - startX) * moveRatio + currX
          const endTranslateY = (e.clientY - startY) * moveRatio + currY
          setNewTransform(currScale, endTranslateX, endTranslateY)
        }

        el.addEventListener('mousedown', (e) => {
          // 鼠标在元素内按下，意味着拖拽开始
          // console.log('down');
          let startX = e.clientX
          let startY = e.clientY
          let startStyle = el.style.transform

          // 包裹器，用于传递每次鼠标按下时元素的初始状态和鼠标的起始点
          function moveWrapper(moveEvent) {
            move(moveEvent, startStyle, startX, startY)
          }
          // 清除mousemove，mouseup，mouseleave的监听器
          function clear() {
            // console.log('up');
            el.removeEventListener('mousemove', moveWrapper)
            el.removeEventListener('mouseup', clear) // 一次性监听
            el.removeEventListener('mouseleave', clear) // 一次性监听
          }
          el.addEventListener('mousemove', moveWrapper)
          el.addEventListener('mouseup', clear)
          el.addEventListener('mouseleave', clear)
        })


        el.addEventListener('wheel', (e) => {
          e.preventDefault()
          let currStyle = el.style.transform
          const { currScale, currX, currY } = parseTransform(currStyle)
          const { deltaY } = e
          let newScale = currScale + deltaY * -0.002
          newScale = Math.min(4, Math.max(0.25, newScale))
          setNewTransform(newScale, currX, currY)
        })
      }
    }
  },
  props:{
    src:{
      type: String,
      required: true
    }
  },
  data(){
    return {
    }
  },
  computed:{
  },
  methods:{
  },
}
</script>

<style lang="scss" scoped>
.zoom-drag-wrap{
  overflow: hidden;
  aspect-ratio: 4/3;
  // position: relative;

  img{
    width: 100%;
    height: 100%;
    object-fit: contain;
    // position: absolute;
  }
}

</style>