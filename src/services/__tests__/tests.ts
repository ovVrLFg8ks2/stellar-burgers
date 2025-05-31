import { combineSlices } from '@reduxjs/toolkit';
import { describe, it, expect } from '@jest/globals';
import burgerSlice from '../slices/burgerSlice';
import orderSlice from '../slices/orderSlice';
import userSlice from '../slices/userSlice';
import { initialState as burgerSliceInitialState } from '../slices/burgerSlice';
import { initialState as orderSliceInitialState } from '../slices/orderSlice';
import { initialState as userSliceInitialState } from '../slices/userSlice';
import { addBun, addIngredient, deleteIngredient } from '../slices/burgerSlice';
import { fetchIngredients } from '../slices/burgerSlice';
import { TIngredient } from '@utils-types';

const initialState = {
  burger: burgerSliceInitialState,
  orderReducer: orderSliceInitialState,
  userReducer: userSliceInitialState
};

describe('правильную настройка и работа rootReducer', () => {
  const rootReducer = combineSlices(burgerSlice, orderSlice, userSlice);

  it('должен возвращать начальное состояние при вызове с состоянием undefined и UNKNOWN_ACTION', () => {
    const result = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(result).toEqual(initialState);
  });
});

describe('работа редьюсера конструктора бургера', () => {
  const mockIngredient: TIngredient = {
    _id: '1',
    name: 'Test Ingredient',
    type: 'main',
    proteins: 10,
    fat: 5,
    carbohydrates: 15,
    calories: 100,
    price: 50,
    image: 'test-image.jpg',
    image_mobile: 'test-image-mobile.jpg',
    image_large: 'test-image-large.jpg'
  };

  const mockBun: TIngredient = {
    ...mockIngredient,
    type: 'bun'
  };

  it('обработке экшенов добавления булки', () => {
    const result = burgerSlice.reducer(
      burgerSliceInitialState,
      addBun(mockBun)
    );
    expect(result.constructorItems.bun).toEqual(mockBun);
  });

  it('обработка экшенов добавления начинки', () => {
    const result = burgerSlice.reducer(
      burgerSliceInitialState,
      addIngredient(mockIngredient)
    );
    expect(result.constructorItems.ingredients).toHaveLength(1);
    expect(result.constructorItems.ingredients[0]).toEqual({
      ...mockIngredient,
      uuid: expect.any(String)
    });
  });

  it('обработка экшенов удаления ингредиента', () => {
    const stateWithIngredient = burgerSlice.reducer(
      burgerSliceInitialState,
      addIngredient(mockIngredient)
    );
    
    const result = burgerSlice.reducer(
      stateWithIngredient,
      deleteIngredient(0)
    );
    expect(result.constructorItems.ingredients).toHaveLength(0);
  });

  describe('обработка экшенов при асинхронных запросах', () => {
    it('должен установить isLoading в значение true для fetchIngredients.pending', () => {
      const action = { type: fetchIngredients.pending.type };
      const result = burgerSlice.reducer(burgerSliceInitialState, action);
      expect(result.isLoading).toBe(true);
      expect(result.isError).toBe(false);
    });
	
    it('должен установить isLoading в значение false и обновить allIngredients на fetchIngredients.fulfilled', () => {
      const mockIngredients = [mockIngredient, mockBun];
      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredients
      };
      const result = burgerSlice.reducer(burgerSliceInitialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.isError).toBe(false);
      expect(result.allIngredients).toEqual(mockIngredients);
    });
	
	it('должен установить isLoading в значение false и isError в значение true при fetchIngredients.rejected', () => {
      const action = { type: fetchIngredients.rejected.type };
      const result = burgerSlice.reducer(burgerSliceInitialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.isError).toBe(true);
    });
  });
});