<script>
export default {
  name: 'CustomPanel',
  functional: true,
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  render(h, context) {
    const { title } = context.props
    const children = []
    const titleNode = <div class='panel-title'>{title}</div>
    children.push(titleNode)
    const contentNode = <div class='panel-content'></div>
    contentNode.children = context.slots().default
    children.push(contentNode)

    const panel = <div class='custom-panel'></div>
    panel.children = children
    return panel
  }
}
</script>

<style lang="scss" scoped>
.custom-panel {
  background: #fff;
  margin-bottom: 10px;
  .panel-title {
    font-size: 14px;
    color: #555;
    line-height: 40px;
    padding: 0 10px;
    font-weight: 650;
    border-bottom: 1px solid #f2f2f2;
  }
  .panel-content {
    padding: 10px;
  }
}
</style>
