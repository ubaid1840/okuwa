'use client'
import { createContext, useEffect, useReducer } from "react";
import Cookies from 'js-cookie';
import { SET_HOSPITAL } from '../action/HospitalAction';
import { myHospitalReducer } from '../reducer/HospitalReducer';

export const HospitalContext = createContext();

const HospitalContextProvider = (props) => {
  const initialState = { value: { data: JSON.parse(Cookies.get('hospitalData') || '[]') } };
  const [state, dispatch] = useReducer(myHospitalReducer, initialState);

  const setHospital = (data) => {
    dispatch({ type: SET_HOSPITAL, payload: { data: data } });
  };

  useEffect(() => {
    Cookies.set('hospitalData', JSON.stringify(state.value.data), { expires: 7 });
  }, [state.value.data]);

  return (
    <HospitalContext.Provider value={{ state, setHospital }}>
      {props.children}
    </HospitalContext.Provider>
  );
};

export default HospitalContextProvider;
