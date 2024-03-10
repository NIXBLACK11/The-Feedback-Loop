import {
    Flex,
    Grid,
    GridItem,
    Text,
    Image,
    Button,
    ButtonGroup,
    Box,
    Spacer
} from "@chakra-ui/react";

import ColorModeToggle from '../components/ColorModeToggle';

import { navigateToSignin, navigateToHome, navigateToSignup } from "../components/LinksUrl";

function Home() {
    return <div>
        <Flex minWidth='max-content' paddingX='2' alignItems='center' gap='2'>
            <Box p='2' onClick={navigateToHome}>
                <Image src="/src/assets/logo.png" alt="VideoAnalyser" />
            </Box>
            <Spacer />
            <ButtonGroup gap='2'>
                <Button colorScheme='cyan' onClick={navigateToSignin}>Sign In</Button>
                <Button colorScheme='cyan' onClick={navigateToSignup}>Sign Up</Button>
                <ColorModeToggle/>
            </ButtonGroup>
        </Flex>
        <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4} alignItems="center">
            {/* Image Grid Item */}
            <GridItem margin="5">
                <Image src="/src/assets/first.png" alt="Image" borderRadius="xl"/>
            </GridItem>

            {/* Text Grid Item */}
            <GridItem margin="3">
                <Text >
                🚀 Unlock the hidden insights within your videos like never before! Our cutting-edge video analysis platform is here to revolutionize the way you perceive and understand your video content. Whether you're a content creator, marketer, or just curious about the magic happening in your favorite videos, we've got you covered.
                </Text>
            </GridItem>
        </Grid>
    </div>
}

export default Home;