'use client'
import { createContext, useEffect, useReducer } from "react";
import Cookies from 'js-cookie';
import { SET_Color } from '../action/ColorAction';
import { myColorReducer } from '../reducer/ColorReducer';

export const ColorContext = createContext();

const ColorContextProvider = (props) => {
  const initialState = { value: { data: JSON.parse(Cookies.get('ColorData') || '[]') } };
  const [state, dispatch] = useReducer(myColorReducer, initialState);

  const setColor = (data) => {
    dispatch({ type: SET_Color, payload: { data: data } });
  };

  useEffect(() => {
    Cookies.set('ColorData', JSON.stringify(state.value.data), { expires: 7 });
  }, [state.value.data]);

  return (
    <ColorContext.Provider value={{ state, setColor }}>
      {props.children}
    </ColorContext.Provider>
  );
};

export default ColorContextProvider;
