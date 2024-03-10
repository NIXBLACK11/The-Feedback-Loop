import React, { useEffect, useRef, useState } from "react";
import {
  AspectRatio,
  Box,
  Container,
  Heading,
  Input,
  Stack,
  Text,
  chakra,
  FormControl,
  InputGroup,
  InputLeftElement,
  Button,
  Select
} from "@chakra-ui/react";
import { motion, useAnimation } from "framer-motion";
import axios from "axios";
import { MdTitle, MdOutlineDescription } from "react-icons/md";

const CMdTitle = chakra(MdTitle);
const CMdDescription = chakra(MdOutlineDescription);

const FileUpload = ({ userName, setVideoResultLoading, setVideoResult }) => {
  const [videoDetails, setVideoDetails] = useState({
    videoTitle: "title",
    videoDescription: "description",
    videoGenre: "MrBeastType"
  });

  const [videoEvent, setVideoEvent] = useState();
  const [clicked, setClicked] = useState(false);
  const controls = useAnimation();
  const startAnimation = () => controls.start("hover");
  const stopAnimation = () => controls.stop();
  const fileInputRef = useRef();
  const getTokenFromLocalStorage = () => {
    return localStorage.getItem("token");
  };

  useEffect(() => {
    const handleFileChange = async () => {
      setVideoResultLoading(true);
      try {
        const file = videoEvent.target.files[0];
    
        if (file) {
          const token = getTokenFromLocalStorage();
    
          if (!token) {
            console.error("Token is missing");
            return;
          }
          console.log("request sent");
          const response1 = await axios.post(`http://localhost:3000/user/${userName}/videoData`, videoDetails, {
            headers: {
              Authorization: `${token}`
            }
          });

          const videoId = response1.data.videoId;

          const formData = new FormData();
          formData.append("video", file, `${videoId}.mp4`);

          const response2 = await axios.post(`http://localhost:3000/user/${userName}/video`, formData, {
            headers: {
              Authorization: `${token}`
            }
          });
    
          if (response2.status === 200) {
            console.log("Video uploaded successfully");
          } else {
            console.error("Error uploading video");
          }

          if(response2) {
            setVideoResult(response2.data.data);
          }
        }
      } catch (error) {
        console.error("Error:", error.message);
      }
      setVideoResultLoading(false);
    };
    if (clicked) {
      // Call the handleFileChange function if the button is clicked
      handleFileChange();
    }
  }, [clicked]);

  return (
    <Container my="12">
      <AspectRatio width="120" height="80" ratio={1}>
        <Box
          borderColor="cyan.500"
          borderStyle="dashed"
          borderWidth="2px"
          rounded="md"
          shadow="sm"
          role="group"
          transition="all 150ms ease-in-out"
          _hover={{
            shadow: "md"
          }}
          as={motion.div}
          initial="rest"
          animate="rest"
          whileHover="hover"
        >
          <Box position="relative" height="100%" width="100%">
            <Box
              position="absolute"
              top="0"
              left="0"
              height="100%"
              width="100%"
              display="flex"
              flexDirection="column"
            >
              <Stack
                height="100%"
                width="100%"
                display="flex"
                alignItems="center"
                justify="center"
                spacing="4"
              >
                <Stack p="8" textAlign="center" spacing="1">
                  <Heading color="cyan.500" fontSize="lg" fontWeight="bold">
                    Drop videos here
                  </Heading>
                  <Text color="cyan.500" fontWeight="light">
                    or click to upload
                  </Text>
                </Stack>
              </Stack>
            </Box>
            <Input
              type="file"
              height="100%"
              width="100%"
              position="absolute"
              top="0"
              left="0"
              opacity="0"
              aria-hidden="true"
              accept="video/*"
              onChange={(e) => {
                setVideoEvent(e);
              }}
              ref={fileInputRef}
              onDragEnter={startAnimation}
              onDragLeave={stopAnimation}
            />
          </Box>
        </Box>
      </AspectRatio>
            <Stack
              spacing={4}
              p="1rem"
              boxShadow="md"
            >
              <FormControl>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<CMdTitle color="cyan.300"/>}
                  />
                  <Input 
                    type="string" 
                    placeholder="title"
                    onChange={(e) => {
                      e.preventDefault();
                      setVideoDetails({
                        ...videoDetails,
                        videoTitle: e.target.value 
                      })
                    }}
                  />
                </InputGroup>
              </FormControl>
              <FormControl>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<CMdDescription color="cyan.300"/>}
                  />
                  <Input 
                    type="string" 
                    placeholder="description"
                    onChange={(e) => {
                      e.preventDefault();
                      setVideoDetails({
                        ...videoDetails,
                        videoDescription: e.target.value 
                      })
                    }}
                  />
                </InputGroup>
              </FormControl>
              <FormControl>
              <Select 
                placeholder='Select genre'
                onChange={(e) => {
                  e.preventDefault();
                  setVideoDetails({
                    ...videoDetails,
                    videoGenre: e.target.value
                  });
                }}
              >
                <option value='MrBeastType'>Mr.Beast Type</option>
                <option value='VlogType'>Vlog Type</option>
                <option value='TechReviewType'>Tech Review Type</option>
                <option value='GamingType'>Gaming Type</option>
                <option value='MinimalistType'>Minimalist Type</option>
              </Select>
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
                Upload
              </Button>
            </Stack>
    </Container>
  );
}

export default FileUpload;