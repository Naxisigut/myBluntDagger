/* v1.1 */
import { createMsgApp } from "./instance";
type MsgType = 'success' | 'error' | 'info' | 'warning'
type MsgFuncType = {
  (config: MsgConfig | string): void
  success: (config: MsgConfig | string) => void
  error: (config: MsgConfig | string) => void
  info: (config: MsgConfig | string) => void
  warning: (config: MsgConfig | string) => void
} 
type MsgConfig = {
  content: string,
  duration?: number,
  type?: 'plain' | MsgType
}

const Msg = ((config: MsgConfig | string) => {
  if(typeof config === 'string')config = {
    content: config,
    type: 'plain',
    duration: 2000
  }
  createMsgApp(config)
}) as MsgFuncType

const typeApiFactory = (type: MsgType) => {
  const typeApi = (config: MsgConfig | string) => {
    const _config: MsgConfig = {
      content: '',
      type,
    }
    if(typeof config === 'string'){
      _config.content = config
    }else{
      _config.duration = config.duration
      _config.content = config.content
    }
    return Msg(_config)
  }

  return typeApi 
}

const types = ['success', 'error', 'info', 'warning'] as const
for(const type of types){
  Msg[type] = typeApiFactory(type)
}

export default Msg