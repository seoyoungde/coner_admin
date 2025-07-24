import React from "react";
import { Box, Typography } from "@mui/material";
import Sidebar from "../layout/Sidebar";
import PartnerRegisterForm from "../components/PartnerRegisterForm";

const PartnerRegisterPage = () => {
  return (
    <Box display="flex" flexDirection="column" height="100vh">
      <Box display="flex" flex={1}>
        <Sidebar />
        <Box flex={1} p={3}>
          <Typography fontWeight="bold" mb={1}>
            [ 업체 등록 - Partner ]
          </Typography>
          <PartnerRegisterForm />
        </Box>
      </Box>
    </Box>
  );
};

export default PartnerRegisterPage;
