## 组件描述

#### 功能描述

1. 消息提示组件

## 使用说明

通过函数调用

```
import Msg from '@/components/Message';

// 可以直接传入要显示的字符串
const confirm = (val: string)=>{
	Msg(val);
}

// 也可以传入具体的配置
const confirm2 = ()=>{
	Msg({
		content: '要显示的信息', // 内容
		duration: 3000, // 显示时长， 可选，默认2000ms
		type: 'plain', // 消息类型，可选，默认plain。可以为success/info/warning/error/plain
	})
}

// 可以通过API直接调用特定类型
const confirm3 = ()=>{
	Msg.error('错误信息')
	Msg.success('成功信息')
	Msg.info('普通信息')
	Msg.warning('警告信息')
}

```

