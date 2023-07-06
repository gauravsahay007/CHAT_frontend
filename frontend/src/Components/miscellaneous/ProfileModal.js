import {
  Avatar,
  Button,
  IconButton,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { useDisclosure } from "@chakra-ui/hooks";

const ProfileModal = ({ user, children, size }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton
          display={{ base: "flex" }}
          icon={
            <Avatar
              size={size}
              cursor={"pointer"}
              name={user.name}
              src={user.pic}
            />
          }
          onClick={onOpen}
          background="#9A139A"
          borderRadius={"100%"}
          mt={"10px"}
        />
      )}

      <Modal size={"lg"} isOpen={isOpen} onClose={onClose} isCentered  background={"#9A139A"}  >
        <ModalOverlay />
        <ModalContent  style={{fontFamily:"Pacifico", fontSize:"20px"}}  >
          <ModalHeader
            fontSize={"40"}
            display={"flex"}
            justifyContent="center"
          >
            {user.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display={"flex"}
            flexDir="column"
            alignItems={"center"}
            justifyContent="space-between"
          >
            <Image
              borderRadius={"full"}
              boxSize="150px"
              src={user.pic}
              alt={user.name}
              margin={5}
            />
            <Text
              fontSize={{ base: "28px", md: "30px" }}
             
            >
              Email: {user.email}
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button bgColor={"#3E103F"} color={"white"} _hover={{color:"black", bgColor:"white", border:"1px solid black"}} mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
