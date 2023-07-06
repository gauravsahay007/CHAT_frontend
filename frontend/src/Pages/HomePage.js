import React, { useEffect } from "react";
import {
  Container,
  Box,
  Text,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  Tab,
} from "@chakra-ui/react";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";
import { useNavigate } from "react-router-dom";

const Homepage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user) {
      navigate("/chats");
    }
  }, [navigate]);

  return (
    <Container maxW="xl" centerContent paddingTop={"20px"}>
      <Box
        bg="#3E103F"
        w="100%"
        p={4}
        color={"white"}
        borderRadius="lg"
        m={"auto"}
        // borderWidth="1px"
      >
        <Tabs variant="soft-rounded">
          <TabList>
            <Tab width="50%" color={"white"}>Log In</Tab>
            <Tab width="50%" color={"white"} >Sign up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default Homepage;
