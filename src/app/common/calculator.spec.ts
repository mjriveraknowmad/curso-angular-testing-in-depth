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

  it('shows how spies work', () => {
    // Creamos un spy para la funcion add del objeto calculator.
    const addSpy = vi.spyOn(calculator, 'add');
    const result = calculator.add(2, 3);
    expect(addSpy).toHaveBeenCalled();
    expect(addSpy).toHaveBeenCalledOnce();
    expect(addSpy).toHaveBeenCalledWith(2, 3);
    expect(result).toBe(5);
  });

  it('shows how to mock a function works', () => {
    // Creamos un mock para la funcion add del objeto calculator. Que devuelva siempre 5, sin importar los parametros que reciba.
    const addMock = vi.spyOn(calculator, 'add').mockReturnValue(5);
    // const addMock = vi.spyOn(calculator, 'add').mockImplementation((a, b) => a * b);
    const result = calculator.add(2, 3);
    expect(addMock).toHaveBeenCalled();
    expect(addMock).toHaveBeenCalledOnce();
    expect(addMock).toHaveBeenCalledWith(2, 3);
    expect(result).toBe(5);
  });

  it('shows how a pure mock works', () => {
    // Creamos un mock puro, sin poder espiar las llamadas. Que devuelva siempre 55, sin importar los parametros que reciba.
    // inicialmente no estamos espiando la funcion add del objeto calculator, sino que estamos creando un mock independiente.
    const addMock = vi.fn().mockReturnValue(55);
    const result = addMock(2, 3);
    expect(result).toBe(55);

    // Moqueamos la funcion add del objeto calculator con nuestro mock, para que cuando se llame a calculator.add, se ejecute nuestro mock.
    vi.spyOn(calculator, 'add').mockImplementation(addMock);
    const result2 = calculator.add(2, 3);
    expect(result2).toBe(55);
  });

  it('shows how mock clearing works', () => {
    // Creamos un spy para la funcion add del objeto calculator.
    const spy = vi.spyOn(calculator, 'add');
    const result = calculator.add(2, 3);
    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith(2, 3);
    expect(result).toBe(5);

    spy.mockClear(); // sin esto, el contador de llamadas se acumula, por lo que si llamamos a calculator.add otra vez, el contador de llamadas sera 2. Ver más abajo.

    const result2 = calculator.add(5, 5);
    expect(spy).toHaveBeenCalledOnce(); // Gracias al mockClear, el contador de llamadas se resetea, por lo que ahora solo se ha llamado una vez.
    expect(spy).toHaveBeenCalledWith(5, 5);
    expect(result2).toBe(10);

  });

  it('shows how mockReset works for pure mocks', () => {
    // Creamos un mock puro, sin poder espiar las llamadas. Que devuelva siempre 10, sin importar los parametros que reciba.
    // inicialmente no estamos espiando la funcion add del objeto calculator, sino que estamos creando un mock independiente.
    const addMock = vi.fn().mockReturnValue(10);
    const result = addMock(5, 5);
    expect(result).toBe(10);
    expect(addMock).toHaveBeenCalledOnce();
    expect(addMock).toHaveBeenCalledWith(5, 5);

    addMock.mockReset(); // sin esto, el contador de llamadas se acumula, por lo que si llamamos a calculator.add otra vez, el contador de llamadas sera 2. Ver más abajo.

    const result2 = addMock(5, 5);
    expect(result2).toBe(undefined); // debido al mockReset, además de hacer lo mismo que el clear, el contador de llamadas se resetea, hace que el mock ya no tenga un valor de retorno definido, por lo que devuelve undefined (ya que elimina el comportamiento de mockReturnValue(10) ).
    expect(addMock).toHaveBeenCalledOnce();
    expect(addMock).toHaveBeenCalledWith(5, 5);
  });

  it('shows how mockRestore() works', () => {
    // Creamos un spy para la funcion add del objeto calculator.
    const spy = vi.spyOn(calculator, 'add');
    const result = calculator.add(2, 3);
    expect(spy).toHaveBeenCalledOnce();
    expect(result).toBe(5);

    spy.mockRestore();// esto hace que el spy deje de espiar la funcion add del objeto calculator, por lo que ahora calculator.add vuelve a su implementacion original. Es decir es como eliminar el vi.spyOn(calculator, 'add');

    const result2 = calculator.add(5, 5);
    expect(spy).toHaveBeenCalledTimes(0); // Gracias al mockRestore, el contador de llamadas se resetea, porque elimina el spyOn... por lo que ahora se llama 0 veces.
    expect(result2).toBe(10);

  });


});
