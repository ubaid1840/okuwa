'use client'
import { createContext, useEffect, useReducer } from "react";
import Cookies from 'js-cookie';
import { SET_Facility } from '../action/FacilityAction';
import { myFacilityReducer } from '../reducer/FacilityReducer';

export const FacilityContext = createContext();

const FacilityContextProvider = (props) => {
  const initialState = { value: { data: JSON.parse(Cookies.get('FacilityData') || '[]') } };
  const [state, dispatch] = useReducer(myFacilityReducer, initialState);

  const setFacility = (data) => {
    dispatch({ type: SET_Facility, payload: { data: data } });
  };

  useEffect(() => {
    Cookies.set('FacilityData', JSON.stringify(state.value.data), { expires: 7 });
  }, [state.value.data]);

  return (
    <FacilityContext.Provider value={{ state, setFacility }}>
      {props.children}
    </FacilityContext.Provider>
  );
};

export default FacilityContextProvider;
