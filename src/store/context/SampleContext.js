'use client'
import { createContext, useEffect, useReducer } from "react";
import Cookies from 'js-cookie';
import { SET_Sample } from '../action/SampleAction';
import { mySampleReducer } from '../reducer/SampleReducer';

export const SampleContext = createContext();

const SampleContextProvider = (props) => {
  const initialState = { value: { data: JSON.parse(Cookies.get('SampleData') || '[]') } };
  const [state, dispatch] = useReducer(mySampleReducer, initialState);

  const setSample = (data) => {
    dispatch({ type: SET_Sample, payload: { data: data } });
  };

  useEffect(() => {
    Cookies.set('SampleData', JSON.stringify(state.value.data), { expires: 7 });
  }, [state.value.data]);

  return (
    <SampleContext.Provider value={{ state, setSample }}>
      {props.children}
    </SampleContext.Provider>
  );
};

export default SampleContextProvider;
