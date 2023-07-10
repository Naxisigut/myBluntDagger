## 组件描述

#### 功能描述

1. 展示性组件，可以在要展示的内容前后增加自定义标签
2. 当前版本：v1.0

#### 组件展示

![image-20230711012311921](C:\Users\mhp3l\AppData\Roaming\Typora\typora-user-images\image-20230711012311921.png)

## 使用说明

#### props

|          | 默认值      | 可选值 | 备注                       |
| -------- | ----------- | ------ | -------------------------- |
| prefix   | -           | string | 前置标签，无slot提供时生效 |
| suffix   | -           | string | 后置标签，无slot提供时生效 |
| content  | -           | string | 中间内容，无slot提供时生效 |
| affixBgc | '#00000005' | string | 标签背景色                 |

#### slot

| name    | 备注         | 作用域 |
| ------- | ------------ | ------ |
| prefix  | 前置标签slot | -      |
| default | 中间内容slot | -      |
| suffix  | 后置标签slot | -      |

