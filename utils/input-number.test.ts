import { describe, expect, it } from 'vitest';
import { numSanitize, sanitizeFixedDigits } from './input-number';


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