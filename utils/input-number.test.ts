import { describe, expect, it } from 'vitest';
import { numSanitize, sanitizeFixedDigits, iptNumFilter_1 , iptNumFilter_2 } from './input-number';


describe('输入框过滤数字', () => {
  it('happy path', () => {
    expect(numSanitize('-123abc456-.`*()')).toBe('123456')

    expect(numSanitize('-123abc', { 
      isMinusAllowed: true, 
    })).toBe('-123')

    expect(numSanitize('0.123', { 
      isDotAllowed: true, 
    })).toBe('0.123')

    expect(numSanitize('0.123', { 
      isDotAllowed: true, 
      digits: 2
    })).toBe('0.12')
  })
  
  it('normal edge case', () => {
    expect(numSanitize('0123')).toBe('123')

    expect(numSanitize('000123')).toBe('123')
  })

  it('minus edge case', () => {
    expect(numSanitize('--123', {
      isMinusAllowed: true
    })).toBe('-123')

    expect(numSanitize('--123--', {
      isMinusAllowed: true
    })).toBe('-123')
  })

  it('dot edge case', () => {
    expect(numSanitize('0..123', { 
      isDotAllowed: true, 
    })).toBe('0.123')

    expect(numSanitize('0..123..', { 
      isDotAllowed: true, 
    })).toBe('0.123')

    expect(numSanitize('.12', { 
      isDotAllowed: true, 
    })).toBe('0.12')

    expect(numSanitize('.', { 
      isDotAllowed: true, 
    })).toBe('0.')
  })

  it('digit edge case', () => {
    expect(numSanitize('0.123', { 
      isDotAllowed: true, 
      digits: 0
    })).toBe('0.1')

    expect(numSanitize('0.123', { 
      isDotAllowed: true, 
      digits: -1
    })).toBe('0.1')
  })

  it('compound edge case', () => {
    expect(numSanitize('--00123', {
      isMinusAllowed: true
    })).toBe('-123')

    expect(numSanitize('00..123', { 
      isDotAllowed: true, 
    })).toBe('0.123')

    expect(numSanitize('--00..1..23--', { 
      isMinusAllowed: true,
      isDotAllowed: true, 
      digits: 2
    })).toBe('-0.12')
  })
  
})

describe('保留小数指定位数', () => {
  it('happy path', () => {
    expect(sanitizeFixedDigits('0.1234', 3)).toBe('0.123') 

    expect(sanitizeFixedDigits('123', 3)).toBe('123') 
  })
  it('edge case', () => {
    expect(() => sanitizeFixedDigits('0.1234', 0)).toThrowError('digits should be positive int')
  })
})

describe('输入框过滤数字2', () => {
  it('happy path', () => {
    expect(iptNumFilter_1('-123abc456-.`*()')).toBe('123456')

    expect(iptNumFilter_1('-123abc', { 
      isMinusAllowed: true, 
    })).toBe('-123')

    expect(iptNumFilter_1('0.123', { 
      isDotAllowed: true, 
    })).toBe('0.123')

    expect(iptNumFilter_1('0.123', { 
      isDotAllowed: true, 
      digits: 2
    })).toBe('0.12')
  })
  
  it('normal edge case', () => {
    expect(iptNumFilter_1('0123')).toBe('123')

    expect(iptNumFilter_1('000123')).toBe('123')
  })

  it('minus edge case', () => {
    expect(iptNumFilter_1('--123', {
      isMinusAllowed: true
    })).toBe('-123')

    expect(iptNumFilter_1('--123--', {
      isMinusAllowed: true
    })).toBe('-123')
  })

  it('dot edge case', () => {
    expect(iptNumFilter_1('0..123', { 
      isDotAllowed: true, 
    })).toBe('0.123')

    expect(iptNumFilter_1('0..123..', { 
      isDotAllowed: true, 
    })).toBe('0.123')

    expect(iptNumFilter_1('.12', { 
      isDotAllowed: true, 
    })).toBe('0.12')

    expect(iptNumFilter_1('.', { 
      isDotAllowed: true, 
    })).toBe('0.')
  })

  it('digit edge case', () => {
    expect(iptNumFilter_1('0.123', { 
      isDotAllowed: true, 
      digits: 0
    })).toBe('0.1')

    expect(iptNumFilter_1('0.123', { 
      isDotAllowed: true, 
      digits: -1
    })).toBe('0.1')
  })

  it('compound edge case', () => {
    expect(iptNumFilter_1('--00123', {
      isMinusAllowed: true
    })).toBe('-123')

    expect(iptNumFilter_1('00..123', { 
      isDotAllowed: true, 
    })).toBe('0.123')

    expect(iptNumFilter_1('--00..1..23--', { 
      isMinusAllowed: true,
      isDotAllowed: true, 
      digits: 2
    })).toBe('-0.12')
  })
  
})

describe('输入框过滤数字3', () => {
  it('happy path', () => {
    expect(iptNumFilter_2('-123abc456-.`*()')).toBe('123456')

    expect(iptNumFilter_2('-123abc', { 
      isMinusAllowed: true, 
    })).toBe('-123')

    expect(iptNumFilter_2('0.123', { 
      isDotAllowed: true, 
    })).toBe('0.123')

    expect(iptNumFilter_2('0.123', { 
      isDotAllowed: true, 
      digits: 2
    })).toBe('0.12')
  })
  
  it('normal edge case', () => {
    expect(iptNumFilter_2('0123')).toBe('123')

    expect(iptNumFilter_2('000123')).toBe('123')
  })

  it('minus edge case', () => {
    expect(iptNumFilter_2('--123', {
      isMinusAllowed: true
    })).toBe('-123')

    expect(iptNumFilter_2('--123--', {
      isMinusAllowed: true
    })).toBe('-123')
  })

  it('dot edge case', () => {
    expect(iptNumFilter_2('0..123', { 
      isDotAllowed: true, 
    })).toBe('0.123')

    expect(iptNumFilter_2('0..123..', { 
      isDotAllowed: true, 
    })).toBe('0.123')

    expect(iptNumFilter_2('.12', { 
      isDotAllowed: true, 
    })).toBe('12') // 不允许首位直接输入小数点

    expect(iptNumFilter_2('.', { 
      isDotAllowed: true, 
    })).toBe('')
  })

  it('digit edge case', () => {
    expect(iptNumFilter_2('0.123', { 
      isDotAllowed: true, 
      digits: 0
    })).toBe('0.1')

    expect(iptNumFilter_2('0.123', { 
      isDotAllowed: true, 
      digits: -1
    })).toBe('0.1')
  })

  it('compound edge case', () => {
    expect(iptNumFilter_2('--00123', {
      isMinusAllowed: true
    })).toBe('-123')

    expect(iptNumFilter_2('00..123', { 
      isDotAllowed: true, 
    })).toBe('0.123')

    expect(iptNumFilter_2('--00..1..23--', { 
      isMinusAllowed: true,
      isDotAllowed: true, 
      digits: 2
    })).toBe('-0.12')

    expect(iptNumFilter_2('000.23', { 
      isMinusAllowed: true,
      isDotAllowed: true, 
      digits: 2
    })).toBe('0.23')

    expect(iptNumFilter_2('01.23', { 
      isMinusAllowed: true,
      isDotAllowed: true, 
      digits: 2
    })).toBe('1.23')

    expect(iptNumFilter_2('-001.23', { 
      isMinusAllowed: true,
      isDotAllowed: true, 
      digits: 2
    })).toBe('-1.23')
  })
  
})

describe.only('性能测试', ()=>{
  const testStr = '--0012..0023afggb^&*(*()^*)--000'
  const times = 100000
  it('numSanitize', ()=>{
    for (let index = 0; index < times; index++) {
      const a = numSanitize(testStr, {
        isDotAllowed: true,
        isMinusAllowed: true,
        digits: 3
      })
      // expect(a).toBe('-12.002')
    }
  })
  it('iptNumFilter_1', ()=>{
    for (let index = 0; index < times; index++) {
      const a = iptNumFilter_1(testStr, {
        isDotAllowed: true,
        isMinusAllowed: true,
        digits: 3
      })
      // expect(a).toBe('-12.002')
    }
  })
  it('filter', ()=>{
    for (let index = 0; index < times; index++) {
      const a = iptNumFilter_2(testStr, {
        isDotAllowed: true,
        isMinusAllowed: true,
        digits: 3
      })  
      // expect(a).toBe('-12.002')
    }
  })
})


