import { describe, it, expect, vi } from 'vitest';
import { calculator } from './calculator';

describe('Calculator', () => {
  it('should add two numbers correctly', () => {
    const result = calculator.add(2, 3);
    expect(result).toBe(5);
  });

  // Este test se ejecuta solo, ignorando los demas tests del mismo describe, por usar only.
  // Esto es util para depurar un test en particular.
  // it.only('should add two numbers, with negative number, correctly', () => {
  //   const result = calculator.add(-2, 3);
  //   expect(result).toBe(1);
  // });

  // Este test se salta con el uso de it.skip, por lo que no se ejecuta.
  // Tambien se puede usar it.skipIf(condicion)('',()=>{}) para saltar un test si se cumple una condicion.
  it.skip('should add two numbers correctly skipped', () => {
    const result = calculator.add(1, 1);
    expect(result).toBe(5);
  });

});
