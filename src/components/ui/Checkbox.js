import { theme } from "@/data/data";
import { forwardRef, useCheckbox, Box, chakra, Text, Icon, Input, useColorModeValue, useColorMode } from "@chakra-ui/react";
import { FaCheck } from "react-icons/fa";

const Checkbox = forwardRef((props, ref) => {
  const { getInputProps, getCheckboxProps, getLabelProps, state } = useCheckbox(props);
  const { colorMode } = useColorMode()
  const bdColor = useColorModeValue(theme.color.primaryBorderColor, 'gray.700')

  return (
    <chakra.label display="flex" alignItems="center" {...getLabelProps()}>
      <Input  {...getInputProps()} hidden ref={ref} />
      <Box
        {...getCheckboxProps()}
        display="flex"
        alignItems="center"
        justifyContent="center"
        border="1px"
        borderRadius="4px"
        borderColor={state.isChecked ? theme.color.primary : bdColor}
        bg={"#EFF4FF"}
        w="16px"
        h="16px"
        color={state.isChecked ? theme.color.primary : "white"}
        {...props}
      >
        {state.isChecked && <FaCheck size={9} />}
      </Box>
      <Box ml={2}>
        <Text color={colorMode === 'dark' && 'gray.300'} variant='subheading'>{props.children}</Text></Box>
    </chakra.label>
  );
});

export default Checkbox;
