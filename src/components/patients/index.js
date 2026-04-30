"use client";
import Button, { GhostButton } from "@/components/ui/Button";
import Sidebar from "@/components/sidebar";
import { theme } from "@/data/data";
import GetLinkItems from "@/utils/SidebarItems";
import { PatientContext } from "@/store/context/PatientContext";
import { UserContext } from "@/store/context/UserContext";
import { AddIcon, CloseIcon, DeleteIcon } from "@chakra-ui/icons";
import {
    Box,
    Flex,
    HStack,
    Image,
    Text,
    useToast,
    VStack,
    Icon,
    InputGroup,
    InputLeftElement,
    Input,
    Menu,
    MenuButton,
    TableContainer,
    Table,
    Thead,
    Tr,
    Th,
    Tbody,
    Td,
    useColorMode,
    useColorModeValue
} from "@chakra-ui/react";
import axios from '@/lib/axiosInstance';
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useContext, useRef, useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import moment from "moment";
import { showToastSuccess } from "@/utils/toastUtils";

export default function PatientsPage({ page }) {
    const {colorMode} = useColorMode()
    const t = useTranslations("Dictionary")
    const pathname = usePathname();
    const [data, setData] = useState([]);
    const { state: UserState } = useContext(UserContext);
    const [search, setSearch] = useState("")
    const bgcolor = ""
    const bdColor = useColorModeValue(theme.color.primaryBorderColor, 'gray.700')
    const txtColor1 = useColorModeValue("#475467", 'gray.300')
    const txtColor2 = useColorModeValue("#101828", "gray.300")


    useEffect(() => {
        if (UserState.value.data?.centerid) {
            fetchData(UserState.value.data?.centerid);
        }
    }, [UserState.value.data]);

    async function fetchData(id) {
        axios
            .get(`/api/newroutes/healthcare/${id}/patient`, {
                centerid: id,
            })
            .then((response) => {
                setData(response.data);
            });
    }

    const toastIdRef = useRef(null);
    const toast = useToast();
    const id = "test-toast";

    const params = useSearchParams();



    useEffect(() => {
        const search = new URLSearchParams(window.location.search).get(
            "patientadded"
        );
        if (search === "true" && !toast.isActive(toastIdRef.current)) {
            showToastSuccess(toast, toastIdRef, t('newPatientAdded'), t('newPatientAddedSubheading'))
        }
    }, []);

    const RenderEachRow = ({ item, index }) => {

        return (
             <Tr backgroundColor={index % 2 == 0 ? colorMode == 'light' ? "#F9FAFB" : 'gray.700' : colorMode == 'light' ? "white" : 'transparent'}>
                <Td fontSize={"14px"} fontWeight={"500"} color={txtColor2}>
                    {item?.firstname + " " + item?.lastname}
                    <div
                        style={{
                            fontSize: "14px",
                            fontWeight: "400",
                            color: "#667085",
                        }}
                    >
                        PT{item?.id}
                    </div>
                </Td>

               <Td fontSize={"14px"} fontWeight={"400"} color={txtColor1}>
                    {item?.gender ? t(item?.gender) : item.gender}
                </Td>
               <Td fontSize={"14px"} fontWeight={"400"} color={txtColor1}>
                    {item?.dob ? moment(new Date(Number(item?.dob))).format("DD/MM/YYYY") : ""}
                </Td>
               <Td fontSize={"14px"} fontWeight={"400"} color={txtColor1}>
                    {item?.email}
                </Td>
               <Td fontSize={"14px"} fontWeight={"400"} color={txtColor1}>
                    {item?.number}
                </Td>
                <Td fontSize={"14px"} fontWeight={"500"} color={txtColor2}>
                    {item.insurances.length > 0 &&
                    <>
                     {JSON.parse(item?.insurances[0]).insuranceprovider}
                    <div
                        style={{
                            fontSize: "14px",
                            fontWeight: "400",
                            color: "#667085",
                        }}
                    >
                        {JSON.parse(item?.insurances[0]).insurancenumber}
                    </div>
                    </>}
                   
                </Td>
                <Td
                    fontSize="14px"
                    fontWeight="500"
                    color={theme.color.link}
                    _hover={{ cursor: "pointer" }}
                >
                    {/* <Link href={`${pathname}/patientdetails/?id=${index}`}>
            <DeleteIcon
              _hover={{ opacity: 0.7 }}
              height={"20px"}
              width={"18px"}
              color={"red"}
            />
          </Link> */}
                    <Link
                        href={`${pathname}/${item.id}`}
                        _hover={{ textDecorationLine: "none" }}
                    >
                        {t('seeDetails')}
                    </Link>
                </Td>
            </Tr>
        );
    };
    const sideLinks = GetLinkItems(page);
    return (
        <Sidebar LinkItems={sideLinks} settingsLink={page == 'admin' ?  "/admin/settings" : null}>
            <Flex flex={1} gap={"50px"} p={"32px"} flexDir="column" overflowX={"auto"}>
                <Text color={colorMode === 'dark' && 'gray.300'}variant="heading"> {t('patients')}</Text>
                {data.length == 0 ? (
                    <VStack spacing={5}>
                        <Image
                            width={"315px"}
                            height={"210px"}
                            src="/assets/No-data-pana-1.png"
                        />
                        <Text color={colorMode === 'dark' && 'gray.300'}fontWeight={"600"} fontSize={"30px"}>
                            {t('noPatientFound')}
                        </Text>
                        <div style={{ width: "70%" }}>
                            <Text
                                fontSize={"16px"}
                                fontWeight={"400"}
                                color={theme.text.secondary}
                                textAlign={"center"}
                            >
                                {t('noPatientFoundSubheading')}
                            </Text>
                        </div>
                        {page === 'admin' || page === 'frontdesk' ? <Link href={`${pathname}/addpatient`} style={{ minWidth: "350px" }}>
                            <Button leftIcon={<AddIcon marginTop={"-2px"} />} width={'100%'}>
                                {t('newPatient')}
                            </Button>
                        </Link> : null}
                    </VStack>
                ) : (
                    <Box
                        width={"100%"}
                        border={"1px solid"}
                        borderColor={bdColor}
                        borderRadius={5}
                    >
                        <HStack justify={"space-between"} width={"100%"} p={5}>
                            <div style={{ display: "flex", width: '100%' }}>
                                <InputGroup w={'100%'} maxW={'400px'}>
                                    <InputLeftElement pointerEvents="none">
                                        <Icon as={CiSearch} boxSize={5} color="#667085" />
                                    </InputLeftElement>
                                   <Input  placeholder={t("search")} value={search} onChange={(e) => setSearch(e.target.value)} />
                                </InputGroup>
                                {/* <Menu>
                  <MenuButton
                    border={"0px solid"}
                    borderColor={bdColor}
                    borderRightWidth={0}
                    borderTopLeftRadius={"8px"}
                    borderBottomLeftRadius={"8px"}
                    paddingInline={"1rem"}
                  >
                    <Box
                      display="flex"
                      height="40px"
                      border={"1px solid"}
                      borderRadius={"5px"}
                      borderColor={bdColor}
                      px={"10px"}
                      alignItems={"center"}
                    >
                      <Icon as={IoFilterSharp} boxSize={4} color="#344054" />
                      <Text color={colorMode === 'dark' && 'gray.300'}ml={2} variant="subheading">
                      {t('filter')}
                      </Text>
                    </Box>
                  </MenuButton>
                </Menu> */}
                            </div>
                            {page === 'admin' || page === 'frontdesk' ? <div>
                                <Link href={`${pathname}/addpatient`}>
                                    <Button leftIcon={<AddIcon marginTop={"-2px"} />}>
                                        {t('newPatient')}
                                    </Button>
                                </Link>
                            </div> : null}
                        </HStack>
                        <Box width={"100%"}>
                            <TableContainer>
                                <Table variant="simple">
                                    <Thead>
                                        <Tr>
                                            {[
                                                t('patientName'),
                                                t('gender'),
                                                t('dob'),
                                                t('emailAddress'),
                                                t('phoneNumber'),
                                                t('insurance'),
                                            ].map((item, index) => (
                                                <Th
                                                    key={index}
                                                    fontSize={"12px"}
                                                    fontWeight={"500"}
                                                    color="#667085"
                                                >
                                                    {item}
                                                </Th>
                                            ))}
                                            <Th></Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {data.length > 0 &&
                                            data.filter((item) => {
                                                if (item.firstname.toLocaleLowerCase().includes(search)) {
                                                    return item
                                                } else if (item.lastname.toLocaleLowerCase().includes(search)) {
                                                    return item
                                                }
                                            }).map((item, index) => (
                                                <RenderEachRow key={index} item={item} index={index} />
                                            ))}
                                    </Tbody>
                                </Table>
                            </TableContainer>
                            <HStack justifyContent={"space-between"} p={5}>
                                <div>
                                    <GhostButton
                                       
                                    >
                                        {t('previous')}
                                    </GhostButton>
                                </div>
                                <div>
                                    <Text color={colorMode === 'dark' && 'gray.300'}variant="subheading"> {t('page')} 1  {t('of')} 1</Text>
                                </div>
                                <div>
                                    <GhostButton
                                        
                                    >
                                        {t('next')}
                                    </GhostButton>
                                </div>
                            </HStack>
                        </Box>
                    </Box>
                )}
            </Flex>
        </Sidebar>
    );
}
