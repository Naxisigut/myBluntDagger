const hexPattern = /^(#?[0-9a-fA-F]{3}|#?[0-9a-fA-F]{6}|#?[0-9a-fA-F]{8})$/
const rgbaPattern = /(rgb|rgba)\(([^)]+)\)/;

/** 将RGB转化为HSL
 * 
 * @param RGB_Obj，其键值R,G,B分别为0~255的整数
 * @returns HSL_Obj，其键值H为0~360的数字，S，L为0~100的数字
 */
export function Rgb2HSL({R, G, B}: Record<'R'|'G'|'B', number>) {
  R /= 255, G /= 255, B /= 255;
  // A /= 100;

  const max = Math.max(R, G, B);
  const min = Math.min(R, G, B);
  let H, S, L = (max + min) / 2;

  if (max === min) {
    H = S = 0; // achromatic
  } else {
    const d = max - min;
    S = L > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case R: H = (G - B) / d + (G < B ? 6 : 0); break;
      case G: H = (B - R) / d + 2; break;
      case B: H = (R - G) / d + 4; break;
    }
    H /= 6;
  }
  
  H = Math.round(H * 360);
  S = Math.round(S * 100) / 100;
  L = Math.round(L * 100) / 100;

  return {H, S, L};
}

/** 将RGB转化为Hex
 * 
 * @param RGB_Obj，其键值R,G,B分别为0~255的整数
 * @returns Hex_String, 十六进制色彩字符串
 */
function Rgb2Hex({R, G, B}: Record<'R'|'G'|'B', number>){
  const r = R.toString(16)
  const g = G.toString(16)
  const b = B.toString(16)
  return `#${r}${g}${b}`
}

/** 格式化十六进制色彩字符串
 * 
 * @param colorStr 
 * @returns colorHex
 */
function formatHex(colorStr: string){
  /* 校验颜色字符串 */
  if(!hexPattern.test(colorStr)){
    throw new Error('Wrong Color String!')
  }
  
  /* 先将#号拿掉 */
  if(/^#/.test(colorStr)){
    colorStr = colorStr.slice(1)
  }

  /* 扩写3位简写  & 删除不透明度 */
  if(colorStr.length === 3){
    colorStr = `${colorStr[0]}${colorStr[0]}${colorStr[1]}${colorStr[1]}${colorStr[2]}${colorStr[2]}`
  }else if(colorStr.length === 8){
    colorStr = colorStr.slice(0, 6)
  }
  // else if(colorStr.length === 6){
  //   colorStr = `${colorStr}FF`
  // }
  
  /* 最后返回的应为一个RGB色彩字符串 */
  return `#${colorStr}`
}

/** 将十六进制字符串解析为RGB对象
 * 
 * @param Hex 
 * @returns RGBA_Obj
 */
function parseHex(Hex: string){
  Hex = Hex.slice(1)
  let R = parseInt(Hex.substring(0,2), 16);
  let G = parseInt(Hex.substring(2,4), 16);
  let B = parseInt(Hex.substring(4,6), 16);

  return { R, G, B }
}

/** 解析rgb & rgba 色彩字符串
 * 
 * @param colorStr 
 * @returns rgba_obj
 */
function parseRgb(colorStr: string){
  const rgbaPattern = /(rgb|rgba)\(([^)]+)\)/;
  const matches = colorStr.match(rgbaPattern)
  if(!matches){
    throw new Error('Wrong Color String!')
  }
  const arr = matches[2].split(',')
  if(arr.length<3 || arr.length>4){
    throw new Error('Wrong Color String!')
  }

  let R = Number(arr[0]),
      G = Number(arr[1]),
      B = Number(arr[2]);
  
  if(isNaN(R) || isNaN(G) || isNaN(B)){
    throw new Error('Wrong Color String!')
  }

  return { R, G, B }
  
}

/** 抽取不透明度
 * 完全不透明为1，完全透明为0
 * @param color 
 * @returns opacity 不透明度 0~1的数字
 */
function extractOpacity(color: string){
  let opacity = 1
  if(color === 'transparent') {
    opacity = 0
  }else if(hexPattern.test(color)){
    if(/^#/.test(color)){
      color = color.slice(1)
    }
    if(color.length === 8){
      opacity = Math.round(parseInt(color.slice(6), 16) * 100 /255) / 100
    }
  } else if(rgbaPattern.test(color)){
    const matches = color.match(rgbaPattern)
    if(!matches){
      throw new Error('Wrong Color String!')
    }
    const arr = matches[2].split(',')
    if(arr.length === 4){
      opacity = Number(arr[3])
    }
  }
  if(isNaN(opacity))throw new Error('Wrong Color String!')
  return opacity
}

/** 增强亮度
 * 
 * @param colorStr string 色彩字符串
 * @param ratio number 亮度增强系数
 * @returns string hsl色彩字符串
 */
function lighten(colorStr: string, ratio: number){
  const color = new CColor(colorStr)
  if(!color.hslObj)return
  let { H, S, L } = color.hslObj
  L = L + ratio
  L = L > 1 ? 1 : L < 0 ? 0 : L
  return `hsla(${H}, ${S * 100}%, ${L * 100}%, ${color.opacity})`
}

/** 降低饱和度
 * 
 * @param colorStr string 色彩字符串
 * @param ratio number 亮度增强系数
 * @returns string hsl色彩字符串
 */
function dim(colorStr: string, ratio: number){
  const color = new CColor(colorStr)
  if(!color.hslObj)return
  let { H, S, L } = color.hslObj
  S = S - ratio
  S = S > 1 ? 1 : S < 0 ? 0 : S
  return `hsl(${H}, ${S * 100}%, ${L * 100}%)`
}

export class CColor{
  hex: string
  rgbObj: Record<'R' | 'G' | 'B', number> | null
  hslObj: Record<'H' | 'S' | 'L', number> | null
  opacity: number
  rgba: `rgba(${number}, ${number}, ${number}, ${number})` | ''
  rgb: `rgb(${number}, ${number}, ${number})` | ''
  hsl: string | ''
  hsla: string | ''
  constructor(color: string){
    try {
      this.init()

      /* 获取opacity */
      this.opacity = CColor.extractOpacity(color)

      /* 获取rgbObj */
      if(hexPattern.test(color)){
        this.rgbObj = parseHex(formatHex(color))
      }else if(rgbaPattern.test(color)){
        this.rgbObj = parseRgb(color)
      }else if(color === 'transparent'){
        this.rgbObj = {R: 255, G: 255, B: 255}
      }
      if(!this.rgbObj) throw new Error('parse fail!')
      this.rgb = `rgb(${this.rgbObj.R}, ${this.rgbObj.G}, ${this.rgbObj.R})`
      this.rgba = `rgba(${this.rgbObj.R}, ${this.rgbObj.G}, ${this.rgbObj.R}, ${this.opacity})`
    
      /* 获取hslObj */
      this.hslObj = Rgb2HSL(this.rgbObj)
      this.hsl = `hsl(${this.hslObj.H}, ${this.hslObj.S * 100}%, ${this.hslObj.L * 100}%)`
      this.hsla = `hsla(${this.hslObj.H}, ${this.hslObj.S * 100}%, ${this.hslObj.L * 100}%, ${this.opacity})`

      /* 获取hex */
      let hexOpacity = Math.round(this.opacity * 255).toString(16)
      if(hexOpacity.length < 0)hexOpacity = '0' + hexOpacity
      this.hex = Rgb2Hex(this.rgbObj) + hexOpacity
    } catch (error) {
      console.error(error)
      this.init()
    }
  }

  init(){
    this.rgbObj = null
    this.hslObj = null
    this.opacity = 1
    this.hex = ''
    this.hsl = ''
    this.hsla = ''
    this.rgb = ''
    this.rgba = ''
  }
}

/* 静态方法 */
CColor.extractOpacity = extractOpacity
CColor.formatHex = formatHex
CColor.parseHex = parseHex
CColor.parseRgb = parseRgb
CColor.Rgb2Hex = Rgb2Hex
CColor.Rgb2HSL = Rgb2HSL

CColor.lighten = lighten
CColor.dim = dim
