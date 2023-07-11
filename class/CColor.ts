/* v1.01 */

import { zeroPadPre } from './index';
const hexPattern = /^#(?:[0-9a-fA-F]{3}){1,2}(?:[0-9a-fA-F]{2})?$/
const rgbaPattern = /(rgb|rgba)\(([^)]+)\)/;




export class CColor{
  initialValue: string
  public get isValid(){
    return !!this.getColorStrType(this.initialValue)
  }
  public get initialType(){
    return this.getColorStrType(this.initialValue)
  }
  public get opacity(){
    if(!this.isValid)return undefined
    return this.extractOpacity(this.initialValue)
  }
  public get rgbObj(){
    if(!this.isValid)return null
    switch (this.initialType) {
      case 'transparent':
        return {R: 255, G: 255, B: 255}
      case 'hex':
        return this.parseHex(this.formatHex(this.initialValue))
      case 'rgba':
        return this.parseRgb(this.initialValue)
      default:
        return null
    }
  }
  public get rgb(){
    if(!this.rgbObj)return ''
    return `rgb(${this.rgbObj.R}, ${this.rgbObj.G}, ${this.rgbObj.R})`
  }
  public get rgba(){
    if(!this.rgbObj)return ''
    return `rgba(${this.rgbObj.R}, ${this.rgbObj.G}, ${this.rgbObj.R}, ${this.opacity})`
  }
  public get hslObj(){
    if(!this.isValid || !this.rgbObj)return null
    return this.Rgb2HSL(this.rgbObj)
  }
  public get hsl(){
    if(!this.hslObj)return ''
    return `hsl(${this.hslObj.H}, ${this.hslObj.S * 100}%, ${this.hslObj.L * 100}%)`
  }
  public get hsla(){
    if(!this.hslObj)return ''
    return `hsla(${this.hslObj.H}, ${this.hslObj.S * 100}%, ${this.hslObj.L * 100}%, ${this.opacity})`
  }
  public get hex(){
    if(!this.isValid || !this.rgbObj || !this.opacity)return ''
    let hexOpacity = Math.round(this.opacity * 255).toString(16)
    if(hexOpacity.length < 2)hexOpacity = '0' + hexOpacity
    return this.Rgb2Hex(this.rgbObj) + hexOpacity
  }
  constructor(color: string = '#000'){
    this.initialValue = color
  }

  /** 判断输入字符串的类型
   * 
   * @param colorStr 
   * @returns 
   */
  private getColorStrType(colorStr: string){
    if(colorStr === 'transparent') return 'transparent'
    if(hexPattern.test(colorStr))return 'hex'
    if(rgbaPattern.test(colorStr))return 'rgba'
    return undefined
  }
  /** 抽取不透明度
  * 完全不透明为1，完全透明为0
  * @param color 
  * @returns opacity 不透明度 0~1的数字
  */
  private extractOpacity(color: string){
    let opacity: number = 1
    try {
      switch (this.initialType) {
        case 'transparent':
          opacity = 0
          break;
        case 'hex':
          if(color.length === 9){ // 长度为9,说明提供了透明度。无透明度时默认为1
            opacity = Math.round(parseInt(color.slice(6), 16) * 100 /255) / 100
          }
          break;
        case 'rgba':
          const matches = color.match(rgbaPattern)
          if(!matches)throw new Error('Wrong Color String!')
          const arr = matches[2].split(',')
          // 如rgba(255, 255, 255, 0.8)
          if(arr.length === 4){ // 长度为4,说明提供了透明度。无透明度时默认为1
            opacity = Number(arr[3])
          }
          break;
        default:
          return undefined
      }
      if(isNaN(opacity))throw new Error('Wrong Color String!')
      return opacity
    } catch (error) {
      console.log(error);
      return undefined
    }
  } 
  /** 将RGB转化为HSL
   * 
   * @param RGB_Obj，其键值R,G,B分别为0~255的整数
   * @returns HSL_Obj，其键值H为0~360的数字，S，L为0~100的数字
   */
  private Rgb2HSL({R, G, B}: Record<'R'|'G'|'B', number>) {
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
  private Rgb2Hex({R, G, B}: Record<'R'|'G'|'B', number>){
   const r = zeroPadPre(R.toString(16), 2)
   const g = zeroPadPre(G.toString(16), 2)
   const b = zeroPadPre(B.toString(16), 2)
   return `#${r}${g}${b}`
  }
  /** 格式化十六进制色彩字符串，返回6位hex
  * 
  * @param colorStr 
  * @returns colorHex
  */
  private formatHex(colorStr: string){
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
  private parseHex(Hex: string){
    let R = parseInt(Hex.substring(1, 3), 16);
    let G = parseInt(Hex.substring(3, 5), 16);
    let B = parseInt(Hex.substring(5, 7), 16);
    return { R, G, B }
  }
  /** 解析rgb & rgba 色彩字符串
  * 
  * @param colorStr 
  * @returns rgba_obj
  */
  private parseRgb(colorStr: string){
    const matches = colorStr.match(rgbaPattern)
    if(!matches)throw new Error('Wrong Color String!')
    
    const arr = matches[2].split(',')
    if(arr.length<3 || arr.length>4)throw new Error('Wrong Color String!')

    let R = Number(arr[0]),
        G = Number(arr[1]),
        B = Number(arr[2]);
    if(isNaN(R) || isNaN(G) || isNaN(B))throw new Error('Wrong Color String!')
    return { R, G, B }
  
}


  /* 静态方法 */

  /** 增强亮度
   * 
   * @param colorStr string 色彩字符串
   * @param ratio number 亮度增强系数
   * @returns string hsl色彩字符串
   */
  static lighten(colorStr: string, ratio: number){
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
  static dim(colorStr: string, ratio: number){
    const color = new CColor(colorStr)
    if(!color.hslObj)return
    let { H, S, L } = color.hslObj
    S = S - ratio
    S = S > 1 ? 1 : S < 0 ? 0 : S
    return `hsl(${H}, ${S * 100}%, ${L * 100}%)`
  }
  
}
