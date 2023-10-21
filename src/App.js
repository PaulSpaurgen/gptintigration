import { useState } from "react";
import {
  chakra,
  Flex,
  Box,
  Heading,
  Input,
  FormControl,
  FormLabel,
  Select,
  Button,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";

function App() {
  const [formData, setFormData] = useState({
    userName: "",
    recName: "",
    description: "",
    wordLimit: "200",
    typeofEmail: "",
    website: "",
    companyName: "",
  });

  const toast = useToast();

  const [isLoading, setIsloading] = useState(false);

  const [generatedEmail, setGeneratedEmail] = useState("");

  const apiKey = "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";

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [`${name}`]: value,
    }));
  };

  const handleSubmit = async () => {
    console.log({ formData });

    const gptQuery = `write a 
      ${formData.typeofEmail} email with the following 
      description "${formData.description}" ,
      my name is ${formData.userName} and I work for ${formData.companyName} and the 
      receipient's name is ${formData.recName} . 
      include my ${formData.website} as a clickable link and my 
      website name is  ${formData.website}
      note: include <b></b> tag for subject & for every new line include <p></p> tags in the response
      
      `;
    try {
      setIsloading(true);
      const data = {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: gptQuery,
          },
        ],
        temperature: 0.7,
      };

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      };

      axios
        .post("https://api.openai.com/v1/chat/completions", data, {
          headers,
        })
        .then((response) => {
          console.log("Response:", response.data);
          const responseInit = response?.data?.choices[0]?.message?.content;

          setGeneratedEmail(responseInit);
          toast({
            title: "Success",
            description: "Successfully generated an email",
            status: "success",
            duration: 9000,
            isClosable: true,
          });
          setIsloading(false);
        })
        .catch((error) => {
          console.error("Error:", error);
          toast({
            title: "Error",
            description: "Something went wrong please try after sometime.",
            status: "success",
            duration: 9000,
            isClosable: true,
          });
          setIsloading(false);
        });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <chakra.div>
      <Flex
        w="100%"
        h="100vh"
        alignItems="center"
        justifyContent="center"
        bg="lightgray"
      >
        <Box
          w="30%"
          bg="white"
          borderRadius="xl"
          boxShadow="md"
          h="80vh"
          p="10"
          position="relative"
        >
          <Heading
            fontSize="lg"
            pb="4"
            borderBottom="1px"
            borderBottomColor="gray.200"
          >
            Email Generator - Chat GPT{" "}
          </Heading>

          <Box mt="5" maxH="50vh" pr="5" pb="10" overflowY="auto">
            <FormControl>
              <FormLabel fontSize="sm">Your Name</FormLabel>
              <Input
                size="sm"
                name="userName"
                onChange={handleChange}
                type="text"
                value={formData.userName}
              />
            </FormControl>

            <FormControl mt="4">
              <FormLabel fontSize="sm">Reciever's Name</FormLabel>
              <Input
                size="sm"
                type="text"
                name="recName"
                value={formData.recName}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl mt="4">
              <FormLabel fontSize="sm">Total Email Words</FormLabel>
              <Input
                size="sm"
                type="text"
                name="wordLimit"
                value={formData.wordLimit}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl mt="4">
              <FormLabel fontSize="sm">Email Description</FormLabel>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                h="30px"
              />
            </FormControl>

            <FormControl mt="4">
              <FormLabel fontSize="sm">Type Of email</FormLabel>
              <Select
                placeholder="Select type of email"
                name="typeofEmail"
                value={formData.typeofEmail}
                onChange={handleChange}
                size="sm"
              >
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="Introduction">Introduction</option>
                <option value="Feed Back">Feed Back request</option>
                <option value="News Letter">News Letter</option>
                <option value="News Letter">News Letter</option>
              </Select>
            </FormControl>
            {/* companyName */}
            <FormControl mt="4">
              <FormLabel fontSize="sm">Company Name</FormLabel>
              <Input
                size="sm"
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl mt="4">
              <FormLabel fontSize="sm">Company Website</FormLabel>
              <Input
                size="sm"
                type="text"
                name="website"
                value={formData.website}
                onChange={handleChange}
              />
            </FormControl>
          </Box>

          <Button
            colorScheme="facebook"
            position="absolute"
            bottom="2"
            right="10"
            size="sm"
            onClick={handleSubmit}
            isLoading={isLoading}
          >
            {" "}
            Generate Email
          </Button>
        </Box>

        <Box
          w="40%"
          bg="white"
          borderRadius="xl"
          boxShadow="md"
          h="80vh"
          p="10"
          ml="10"
        >
          <Heading
            fontSize="lg"
            pb="4"
            borderBottom="1px"
            borderBottomColor="gray.200"
          >
            Output - Chat GPT{" "}
          </Heading>
          {!generatedEmail.length ? (
            <Flex w="100%" h="80%" alignItems="center" justifyContent="center">
              <Box fontSize="sm" color="gray.400">
                Please fill the form on left and generate an email to view the
                email.
              </Box>
            </Flex>
          ) : (
            <Flex w="100%" h="90%" alignItems="center" justifyContent="center">
              <Box
                dangerouslySetInnerHTML={{
                  __html: generatedEmail,
                }}
                maxH="60vh"
                overflowY="auto"
              ></Box>
            </Flex>
          )}
        </Box>
      </Flex>
    </chakra.div>
  );
}

export default App;
