import { describe, expect, it } from 'vitest';
import { add, multiply, subtract, divide } from './number';


describe('浮点基础运算-不丢失精度', () => {
  it('加法', () => {
    expect(add(1, 2)).toBe(3)
    expect(add(1.1, 2.2)).toBe(3.3)
    expect(add(-1, 2)).toBe(1)
    expect(add(-1.1, -2.2)).toBe(-3.3)
  })
  
  it('减法', () => {
    expect(subtract(3, 2)).toBe(1)
    expect(subtract(3.3, 2.2)).toBe(1.1)
    expect(subtract(-3, -2)).toBe(-1)
    expect(subtract(-3.3, -2.2)).toBe(-1.1)
  })
  
  it('乘法', () => {
    expect(multiply(3, 2)).toBe(6)
    expect(multiply(3.3, 2.2)).toBe(7.26)
    expect(multiply(-3, 2)).toBe(-6)
    expect(multiply(-3, -2)).toBe(6)
    expect(multiply(-3.3, 2.2)).toBe(-7.26)
    expect(multiply(-3.3, -2.2)).toBe(7.26)
  })
  
  it('除法', () => {
    expect(divide(6, 2)).toBe(3)
    expect(divide(3.3, 1.1)).toBe(3)
    expect(divide(3, 2)).toBe(1.5)
    expect(divide(-6, -2)).toBe(3)
    expect(divide(-3.3, -1.1)).toBe(3)
    expect(divide(-3, -2)).toBe(1.5)
  })
})