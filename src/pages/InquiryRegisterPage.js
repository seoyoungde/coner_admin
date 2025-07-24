import React from "react";
import { Box, Typography } from "@mui/material";
import Sidebar from "../layout/Sidebar";
import InquiryRegisterForm from "../components/InquiryRegisterForm";

const InquiryRegisterPage = () => {
  return (
    <Box display="flex" flexDirection="column" height="100vh">
      <Box display="flex" flex={1}>
        <Sidebar />
        <Box flex={1} p={3}>
          <Typography fontWeight="bold" mb={1}>
            [ 의뢰서 등록 -Request ]
          </Typography>
          <InquiryRegisterForm />
        </Box>
      </Box>
    </Box>
  );
};

export default InquiryRegisterPage;
