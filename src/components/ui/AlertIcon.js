import { theme } from "@/data/data"
import { Icon, useColorModeValue } from "@chakra-ui/react"



const AlertIcon = ({icon}) => {
  const bgColor = useColorModeValue(theme.color.primaryBorderColor, 'gray.700')
  

    return (
        <div
        style={{
          display: "flex",
          borderRadius: "30px",
          backgroundColor: theme.color.primaryBorderColor,
          border: "6px solid",
          borderColor: theme.color.selection,
          height: "40px",
          width: "40px",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon color={theme.color.primary} as={icon} boxSize={5} />
      </div>
    )
}

export default AlertIcon