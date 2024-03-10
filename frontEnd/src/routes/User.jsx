import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useParams, useNavigate } from "react-router-dom";

import {
    useToast,
    Flex,
    Image,
    Button,
    ButtonGroup,
    Box,
    Spacer,
    Avatar,
    Grid,
    GridItem,
    Text,
    Spinner,
    Center,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    ListItem,
    UnorderedList,
    createToastFn
} from "@chakra-ui/react";

import ColorModeToggle from '../components/ColorModeToggle';
import { navigateToSignin, navigateToHome } from "../components/LinksUrl";
import FileUpload from "../components/FileUpload";
import BasicPie from "../components/BasicPie";

function User() {
    const [ videoResult, setVideoResult ] = useState({});
    const [ videoResultLoading, setVideoResultLoading ] = useState();
    
    const { userName } = useParams();
    const navigate = useNavigate();
    const getTokenFromLocalStorage = () => {
        return localStorage.getItem("token");
    };

    const toast = useToast();

    useEffect(() => {
        const safetyCheck = async () => {
            if (!userName) {
                navigate("/home");
            }
            const token = getTokenFromLocalStorage();
            if(!token) {
                navigate("/home");
            }
            try {
                const response = await axios.get(`http://localhost:3000/user/check/${userName}`, {
                    headers: {
                        Authorization: `${token}`
                    }
                });
                if(!response.data.valid) {
                    navigate("/home");
                }
            } catch(error) {
                toast({
                    title: "Invalid Username",
                    description: "Use proper username",
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
                navigate("/home");
            }
        }
        safetyCheck();
    }, [userName, navigate]);

    return (
        <div>
            <Flex minWidth='max-content' paddingX='2' alignItems='center' gap='2'>
                <Box p='2' onClick={navigateToHome}>
                    <Image src="/src/assets/logo.png" alt="VideoAnalyser" />
                </Box>
                <Spacer />
                <ButtonGroup gap='2'>
                    <Button colorScheme='cyan' onClick={navigateToHome}>Home</Button>
                    <Avatar marginTop={1} size="sm" name={userName} src='--' />
                    <ColorModeToggle/>
                </ButtonGroup>
            </Flex>
            <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={2} alignItems="center">
                <GridItem marginY={1} marginX={1}>
                <FileUpload
                    userName={userName}
                    setVideoResultLoading={setVideoResultLoading}
                    setVideoResult={setVideoResult}
                />
                </GridItem>
                <GridItem marginY={1} marginX={1}>
                    <Text color="cyan.500">
                        Upload your video along with its genre, and I'll analyze it using insights from top YouTube videos. I'll provide feedback on what aspects make your video great and suggest areas for improvement.
                    </Text>
                </GridItem>
            </Grid>
            <div>
                {videoResultLoading === true && (
                    <Center height="100vh">
                        <Spinner />
                    </Center>
                )}
                {videoResultLoading === false && (
                    <div>
                        {videoResultLoading === false && (
                            <div>
                                <Flex paddingX='2' alignItems='center' gap='2'>
                                    <BasicPie videoResult = {videoResult.visual} title={"Video analysis chart"}/>
                                    <BasicPie videoResult = {videoResult.audio} title={"Audio analysis chart"}/>
                                </Flex>
                                <Accordion defaultIndex={[0]} allowMultiple>
                                    <AccordionItem>
                                        <h2>
                                        <AccordionButton>
                                            <Box as="span" flex='1' textAlign='left'>
                                                <Text color="cyan.500">
                                                    Visual analysis of your video
                                                </Text>
                                            </Box>
                                            <AccordionIcon />
                                        </AccordionButton>
                                        </h2>
                                        <AccordionPanel pb={4}>
                                            {Object.keys(videoResult.visual).map((key) => {
                                            const genre = videoResult.visual[key];
                                            return loadResult(genre);
                                            })}
                                        </AccordionPanel>
                                    </AccordionItem>

                                    <AccordionItem>
                                        <h2>
                                        <AccordionButton>
                                            <Box as="span" flex='1' textAlign='left'>
                                                <Text color="cyan.500">
                                                    Audio analysis of your video
                                                </Text>
                                            </Box>
                                            <AccordionIcon />
                                        </AccordionButton>
                                        </h2>
                                        <AccordionPanel pb={4}>
                                            {Object.keys(videoResult.audio).map((key) => {
                                            const genre = videoResult.audio[key];
                                            return loadResult(genre);
                                            })}
                                        </AccordionPanel>
                                    </AccordionItem>

                                    <AccordionItem>
                                        <h2>
                                        <AccordionButton>
                                            <Box as="span" flex='1' textAlign='left'>
                                                <Text color="cyan.500">
                                                    What your video should represent
                                                </Text>
                                            </Box>
                                            <AccordionIcon />
                                        </AccordionButton>
                                        </h2>
                                        <AccordionPanel pb={4}>
                                            {Object.keys(videoResult.details).map((key) => {
                                            const genre = videoResult.details[key];
                                            return loadVideoType(genre);
                                            })}
                                        </AccordionPanel>
                                    </AccordionItem>
                                </Accordion>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

function loadResult(genre) {
    return (
        <div key={genre.details}>
            <UnorderedList>
                <ListItem>{genre.details} -- {genre.percentage.toFixed(2)}</ListItem>
            </UnorderedList>
        </div>
    );
}

function loadVideoType(genre) {
    return (
        <div key={genre.whatShouldBe}>
            <UnorderedList>
                <ListItem>{genre.whatShouldBe}</ListItem>
            </UnorderedList>
        </div>
    );
}

export default User;

