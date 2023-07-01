## Props
| 属性名 | 说明 | 备注 | 默认值 |
| --- | --- | --- | --- |
| src  | v-model绑定值 | 一般直接使用v-model，不单独使用 | - |
| limit | 上传文件数量限制， Number | 仅在v-model绑定值为数组时生效 | `0` |
| disabled | 是否禁用，Bool |  | false |
| displayMode | 是否浏览模式， Bool | 浏览模式下无法上传，无法删除，只能预览已有图片 | false |

## Slot
| 插槽名 | 说明 |
| --- | --- |
| custom-tip | upload提示文本，在`displayMode`为true时不生效 |

## Demo
```html
<template>
  <custom-uploader v-model="goodsFormData.mainPicUrl">
    <template #custom-tip>建议上传尺寸：800*800px，支持格式：jpg、jpeg、png，单个文件不超过5MB，最多可上传1张
    </template>
  </custom-uploader>
</template>

<script>
  export default{
    data(){
      return{
        goodsFormData: {
          mainPicUrl:''
        }
      }
    }
  }

</script>

```
```html
<template>
  <custom-uploader v-model="goodsFormData.pictureUrl" :limit="10">
    <template #custom-tip>建议上传图片比例：16:9，支持格式：jpg、jpeg、png，单个文件不能超过5MB，最多可上传10张
    </template>
  </custom-uploader>
</template>

<script>
  export default{
    data(){
      return{
        goodsFormData: {
          pictureUrl:[]
        }
      }
    }
  }

</script>

```

## 注意

- 上传函数固定在组件`upload`方法内，不支持外部定义
