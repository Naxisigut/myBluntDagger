<script>
import { typeStyleDict, sizeOpts, typeOpts } from './dict'
export default {
  name: 'CustomTag',
  functional: true,
  props: {
    /* border-color，只在customize为true时生效 */
    borderColor: {
      type: String,
      default: ''
    },
    /* background-color，只在customize为true时生效 */
    backgroundColor: {
      type: String,
      default: ''
    },
    /* color，tag 内容颜色，默认为白色 */
    color: {
      type: String,
      default: '#fff'
    },
    /* 标签文本，仅在默认插槽没有使用时生效 */
    text: {
      type: String,
      default: ''
    },
    /* 大小，决定padding和行高，默认为normal */
    size: {
      validator: (value) => {
        return sizeOpts.includes(value)
      },
      default: 'normal'
    },
    /* 类型，预置了五种类型，各有对应的样式 */
    type: {
      validator: (value) => {
        return typeOpts.includes(value)
      },
      default: 'primary'
    },
    /* 是否开启定制 */
    customize: {
      type: Boolean,
      default: false
    }
  },
  render(h, context) {
    const { type, customize, borderColor, backgroundColor, size, text } = context.props
    /* style */
    const styleObj = {
      borderColor: customize ? borderColor : typeStyleDict[type].borderColor,
      backgroundColor: customize ? backgroundColor : typeStyleDict[type].backgroundColor,
      color: context.props.color
    }
    const styleStr = `border-color: ${styleObj.borderColor};background: ${styleObj.backgroundColor};color: ${styleObj.color}`

    /* class */
    const classStr = `custom-tag ${size}`

    /* slot&文本节点 */
    const children = context.slots().default || [{ text }]

    /* 生成虚拟节点 */
    const node = <div class={classStr} style={styleStr}></div>
    node.children = children

    return node
  }
}
</script>

<style lang="scss" scoped>
.custom-tag {
  display: inline-block;
  border: 1px solid;
  border-radius: 2px;
  &.mini {
    line-height: 24px;
    padding: 0 7px;
  }
  &.normal {
    line-height: 28px;
    padding: 0 20px;
  }
  & + .custom-tag {
    margin-left: 10px;
  }
}
</style>
