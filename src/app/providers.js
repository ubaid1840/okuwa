'use client'

import AppointmentContextProvider from '@/store/context/AppointmentContext';
import FacilityContextProvider from '@/store/context/FacilityContext';
import HospitalContextProvider from '@/store/context/HospitalContext';
import PatientContextProvider from '@/store/context/PatientContext';
import SampleContextProvider from '@/store/context/SampleContext';
import { ChakraProvider, extendTheme, useColorMode } from '@chakra-ui/react'
import { useEffect } from 'react';
import UserContextProvider from '@/store/context/UserContext';
import ColorContextProvider from '@/store/context/ColorContext';
import { PrimeReactProvider } from 'primereact/api';
import { theme } from '@/data/data';

// Component to sync Chakra color mode with Tailwind dark class
function ColorModeSync({ children }) {
  const { colorMode } = useColorMode();
  
  useEffect(() => {
    const root = document.documentElement;
    if (colorMode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [colorMode]);
  
  return children;
}



export function Providers({ children }) {

  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  const InputStyles = {
    variants: {
      outline: (props) => ({
        field: {
          borderColor: props.colorMode === 'light' ? theme.color.primaryBorderColor : 'gray.600',
          _focus: {
            boxShadow: "0px 0px 2px 2px #b2d8d8",
            borderColor: props.colorMode === 'light' ? theme.color.primaryBorderColor : 'gray.600'
          },
          _hover: {
            borderColor: props.colorMode === 'light' ? theme.color.primaryBorderColor : 'gray.600'
          },
          _disabled: {
            borderColor: props.colorMode === 'light' ? theme.color.primaryBorderColor : 'gray.600',
            color: props.colorMode === 'light' ? '#667085' : "#797979FF",
            boxShadow: "0px 0px 1px 1px #1018280D",
            opacity: 1,
            fontSize: '14px'
          }
        },
      }),
    },
  };

  const SelectStyles = {
    variants: {
      outline: (props) => ({
        field: {
          borderColor: props.colorMode === 'light' ? theme.color.primaryBorderColor : 'gray.600',
          _focus: {
            boxShadow: "0px 0px 2px 2px #b2d8d8",
            borderColor: props.colorMode === 'light' ? theme.color.primaryBorderColor : 'gray.600'
          },
          _hover: {
            bborderColor: props.colorMode === 'light' ? theme.color.primaryBorderColor : 'gray.600'
          },
        },
      }),
    },
  };

  const TextareaStyles = {
    variants: {
      outline: (props) => ({
        borderColor: props.colorMode === 'light' ? theme.color.primaryBorderColor : 'gray.600',
        _focus: {
          boxShadow: "0px 0px 2px 2px #b2d8d8",
          borderColor: props.colorMode === 'light' ? theme.color.primaryBorderColor : 'gray.600',
        },
        _hover: {
          borderColor: props.colorMode === 'light' ? theme.color.primaryBorderColor : 'gray.600',
        },
        _disabled: {
          borderColor: props.colorMode === 'light' ? theme.color.primaryBorderColor : 'gray.600',
          color: props.colorMode === 'light' ? '#667085' : "#797979FF",
          boxShadow: "0px 0px 1px 1px #1018280D",
          opacity: 1,
          fontSize: '14px'
        }
      }),
    },
  };

  const TextStyle = {
    variants: {
      'heading': {
        fontWeight: "600",
        fontSize: '30px',
        color: '#000000',
        width: 'inherit'
      },
      'description': {
        color: '#667085',
        fontWeight: '400',
        fontSize: '16px',
        width: 'inherit'

      },
      'subheading': {
        fontSize: "14px",
        fontWeight: "500 ",
        color: '#344054',
        width: 'inherit'

      },
      'link': {
        color: '#66b2b2',
        fontWeight: '400',
        fontSize: '16px',
        width: 'inherit',
        _hover : {textDecoration : "underline"}
      },
    },
  };

  const customTheme = extendTheme({
    initialColorMode: 'light',
    useSystemColorMode: false,
    components: {
      Input: InputStyles,
      Select: SelectStyles,
      Textarea: TextareaStyles,
      Text: TextStyle
    },
  });

  return (

    <PrimeReactProvider>

      <ChakraProvider theme={customTheme}>
        <ColorModeSync>
          <ColorContextProvider>
            <UserContextProvider>
              <HospitalContextProvider>
                <PatientContextProvider>
                  <AppointmentContextProvider>
                    <FacilityContextProvider>
                      <SampleContextProvider>
                        {children}
                      </SampleContextProvider>
                    </FacilityContextProvider>
                  </AppointmentContextProvider>
                </PatientContextProvider>
              </HospitalContextProvider>
            </UserContextProvider>
          </ColorContextProvider>
        </ColorModeSync>
      </ChakraProvider>

    </PrimeReactProvider>

  )
}
