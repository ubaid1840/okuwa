import { theme } from "@/data/data";
import { AddIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Box, HStack, Icon, Input, Menu, MenuButton, MenuItem, MenuList, useColorMode, useColorModeValue } from "@chakra-ui/react";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaWhatsapp } from "react-icons/fa";


const SocialMediaSelection = ({data, onSMMSelection, onChangeInput}) => {
    const {colorMode} = useColorMode()
    const bdColor = useColorModeValue(theme.color.primaryBorderColor, 'gray.700')

    return (
        
            <Box
                style={{ display: "flex", width: "100%" }}
                border={"1px solid"}
                borderColor={bdColor}
                borderRadius={"8px"}
                _hover={{ borderColor: bdColor}}
                _focusWithin={{
                    boxShadow: `0px 0px 3px 3px ${bdColor}`,
                    borderColor:bdColor,
                }}
            >
                <Menu>
                    <MenuButton
                        border={"0px solid"}
                        borderColor={bdColor}
                        borderRightWidth={0}
                        borderTopLeftRadius={"8px"}
                        borderBottomLeftRadius={"8px"}
                        paddingInline={"1rem"}
                    >
                        <div style={{ display: "flex", alignItems: "center" }}>
                            {data.selection == "Facebook" ? (
                                <Icon as={FaFacebook} boxSize={5} color={"blue"} />
                            ) : data.selection == "Twitter" ? (
                                <Icon as={FaTwitter} boxSize={5} color={"blue"} />
                            ) : data.selection == "Instagram" ? (
                                <Icon as={FaInstagram} boxSize={5} color={"pink"} />
                            ) : data.selection == "LinkedIn" ? (
                                <Icon as={FaLinkedin} boxSize={5} color={"blue"} />
                            ) : data.selection == "WhatsApp" ? (
                                <Icon as={FaWhatsapp} boxSize={5} color={"green"} />
                            ) : null}
                            <ChevronDownIcon marginLeft={"5px"} />
                        </div>
                    </MenuButton>
                    <MenuList borderColor={"blue.500"}>
                        <MenuItem
                            onClick={()=> onSMMSelection("Facebook")}
                        >
                            Facebook
                        </MenuItem>
                        <MenuItem
                              onClick={()=> onSMMSelection("Twitter")}
                        >
                            Twitter
                        </MenuItem>
                        <MenuItem
                            onClick={()=> onSMMSelection("LinkedIn")}
                        >
                            LinkedIn
                        </MenuItem>
                        <MenuItem
                             onClick={()=> onSMMSelection("Instagram")}
                        >
                            Instagram
                        </MenuItem>
                        <MenuItem
                              onClick={()=> onSMMSelection("WhatsApp")}
                        >
                            WhatsApp
                        </MenuItem>
                    </MenuList>
                </Menu>
                <Input
                    borderTopLeftRadius={"0px"}
                    borderBottomLeftRadius={"0px"}
                    borderLeftWidth={"0px"}
                    border={"0px"}
                    placeholder="input your social media handle"
                    value={data.input}
                    _focus={{ boxShadow: "none", border: "0px" }}
                    onChange={onChangeInput}
                />
            </Box>
          
      
    )
}

export default SocialMediaSelection