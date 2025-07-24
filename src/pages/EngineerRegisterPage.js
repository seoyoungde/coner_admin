import React from "react";
import { Box, Typography } from "@mui/material";
import Sidebar from "../layout/Sidebar";
import EngineerRegisterForm from "../components/EngineerRegisterForm";

const EngineerRegisterPage = () => {
  return (
    <Box display="flex" flexDirection="column" height="100vh">
      <Box display="flex" flex={1}>
        <Sidebar />
        <Box flex={1} p={3}>
          <Typography fontWeight="bold" mb={1}>
            [ 기사님 등록 - Engineer ]
          </Typography>
          <EngineerRegisterForm />
        </Box>
      </Box>
    </Box>
  );
};

export default EngineerRegisterPage;
