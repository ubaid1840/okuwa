import { theme } from "@/data/data"
import { Button as ChakraButton, useColorModeValue } from "@chakra-ui/react"

const Button = ({ children, ...props }) => {
  return (
    <ChakraButton
    height={'40px'}
      backgroundColor={theme.color.primary}
      fontSize="14px"
      color="white"
      fontWeight="400"
      variant="solid"
      _hover={{ opacity: 0.7 }}
      {...props}
    >
      {children}
    </ChakraButton>
  )
}

export const GhostButton = ({ children, ...props }) => {
  return <ChakraButton
    boxShadow={"0px 0px 1px 1px #1018280D"}
    fontSize="14px"
    fontWeight="500"
    variant="outline"
    backgroundColor={"transparent"}
    color={useColorModeValue( "black", 'gray.400')}
    border={"1px solid"}
    borderColor={useColorModeValue(theme.color.primaryBorderColor, 'gray.600')}
    _hover={{ opacity: 0.7 }}
    {...props}
  >
    {children}
  </ChakraButton>
}

export const DangerButton = ({ children, ...props }) => {
  return <ChakraButton

    boxShadow={"0px 0px 1px 1px #1018280D"}
    border="1px solid"
    borderColor="#FDA29B"
    backgroundColor="#FFFFFF"
    fontSize="14px"
    color="#B42318"
    fontWeight="500"
    variant="solid"
    _hover={{ opacity: 0.7 }}
    {...props}
  >
    {children}
  </ChakraButton>
}

export default Button