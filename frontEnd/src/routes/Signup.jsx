import { useState } from "react";
import axios from 'axios';
import { useEffect } from "react";
import {
    useToast,
    Flex,
    Heading,
    Input,
    Image,
    Button,
    ButtonGroup,
    InputGroup,
    Stack,
    InputLeftElement,
    chakra,
    Box,
    Link,
    Avatar,
    FormControl,
    FormHelperText,
    InputRightElement,
    Spacer
} from "@chakra-ui/react";

import { FaUserAlt, FaLock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { useNavigate } from "react-router-dom"; 
import ColorModeToggle from '../components/ColorModeToggle';

import { navigateToSignin, navigateToHome } from "../components/LinksUrl";

const CFaLock = chakra(FaLock);
const CFaUserAlt = chakra(FaUserAlt);
const CMdEmail = chakra(MdEmail);

function Signin() {

    const toast = useToast();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [clicked, setClicked] = useState(false);
    const [details, setDetails] = useState({userName: "username", userPassword: "password"});
    const handleShowClick = () => setShowPassword(!showPassword);

    useEffect(() => {
      const fetchData = async () => {
        if (clicked) {
          console.log(details);
          try {
            const response = await axios.post("http://localhost:3000/user/signup", details);
            console.log(response.data);
            localStorage.setItem("token", "Bearer "+response.data.token);
            navigate(`/user/${details.userName}`);
          } catch (error) {
            toast({
              title: "User already exists or invalid Email",
              status: "error",
              duration: 9000,
              isClosable: true,
            })
            if (error.response) {
              console.error('Error Status:', error.response.status);
              console.error('Error Data:', error.response.data);
            } else if (error.request) {
              console.error('No response received:', error.request);
            } else {
              console.error('Error Message:', error.message);
            }
          }
        }
        setClicked(false);
      };
    
      fetchData();
    }, [clicked]);

    return <div>
        <Flex minWidth='max-content' paddingX='2' alignItems='center' gap='2'>
            <Box p='2' onClick={navigateToHome}>
                <Image src="/src/assets/logo.png" alt="VideoAnalyser" />
            </Box>
            <Spacer />
            <ButtonGroup gap='2'>
                <Button colorScheme='cyan' onClick={navigateToHome}>Home</Button>
                <ColorModeToggle/>
            </ButtonGroup>
        </Flex>

        <Flex
      flexDirection="column"
      width="100wh"
      height="100vh"
      justifyContent="center"
      alignItems="center"
    >
      <Stack
        flexDir="column"
        mb="2"
        justifyContent="center"
        alignItems="center"
      >
        <Avatar bg="cyan.500" />
        <Heading colorScheme='cyan'>Welcome</Heading>
        <Box minW={{ base: "90%", md: "468px" }}>
          <form>
            <Stack
              spacing={4}
              p="1rem"
              boxShadow="md"
            >
              <FormControl>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<CFaUserAlt color="cyan.300"/>}
                  />
                  <Input 
                    type="string" 
                    placeholder="username"
                    onChange={(e) => {
                      e.preventDefault();
                      setDetails({
                        ...details,
                        userName: e.target.value 
                      })
                    }}
                  />
                </InputGroup>
              </FormControl>
              <FormControl>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<CMdEmail color="cyan.300"/>}
                  />
                  <Input 
                    type="email" 
                    placeholder="email"
                    onChange={(e) => {
                      e.preventDefault();
                      setDetails({
                        ...details,
                        userEmail: e.target.value 
                      })
                    }}
                  />
                </InputGroup>
              </FormControl>
              <FormControl>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<CFaLock color="cyan.300"/>}
                  />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    onChange={(e) => {
                      e.preventDefault();
                      setDetails({
                        ...details,
                        userPassword: e.target.value 
                      })
                    }}
                  />
                  <InputRightElement width="4.5rem">
                    <Button colorScheme='cyan' h="1.75rem" size="sm" onClick={handleShowClick}>
                      {showPassword ? "Hide" : "Show"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <Button
                borderRadius={0}
                type="submit"
                variant="solid"
                colorScheme="cyan"
                width="full"
                onClick={(e) => {
                  e.preventDefault();
                  setClicked(true);
                }}
              >
                Create User
              </Button>
            </Stack>
          </form>
        </Box>
      </Stack>
      <Box>
        Already a User?{" "}
        <Link color="cyan.500" href="/">
          Sign In
        </Link>
      </Box>
    </Flex>
    </div>
}

export default Signin;