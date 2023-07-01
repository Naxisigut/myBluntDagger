function fixTable(el) {
  const tableArr = el.querySelectorAll('table')
  tableArr.forEach((table) => {
    /* 获取列宽度为一个数组 */
    const ths = table.rows[0].childNodes // 首行/标题行的单元格th
    const widthArr = []
    let finalWidthArr = []
    for (const i of ths) {
      widthArr.push(i.dataset.colwidth)
    }
    widthArr.forEach(i => {
      const res = i.split(',')
      finalWidthArr = [...finalWidthArr, ...res]
    })
    // console.log('finalWidthArr', finalWidthArr);

    /* 根据列宽度数组 创建colgroup标签 */
    const colGroup = document.createElement('colgroup')
    finalWidthArr.forEach(i => {
      const col = document.createElement('col')
      col.style.width = i + 'px'
      colGroup.appendChild(col)
    })
    // console.log('colGroup', colGroup);

    /* 将colgroup标签添加到table内 */
    table.prepend(colGroup)

    /* 获取并设置表格总宽度 */
    const tableWidth = finalWidthArr.reduce((curr, i) => curr + Number(i), 0)
    table.style.width = tableWidth + 'px'
    // console.log('tableWidth', tableWidth);
  })
}

export default {
  name: 'tiptapTableFix',
  directives: {
    bind: fixTable,
    inserted: () => {},
    update: fixTable,
    componentUpdated: () => {},
    unbind: () => {}
  }
}
