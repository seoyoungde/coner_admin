import React from "react";
import { Box, Typography, Divider } from "@mui/material";
import Sidebar from "../layout/Sidebar";
import InquiryDetails from "../components/InquiryDetails";

const InquiryPage = () => {
  return (
    <Box display="flex" flexDirection="column" height="100vh">
      <Box display="flex" flex={1}>
        <Sidebar />

        <Box flex={1} p={3}>
          <Typography fontWeight="bold" mb={1}>
            [ 의뢰서 목록 -Request ]
          </Typography>

          <Divider sx={{ my: 3 }} />
          <InquiryDetails />
        </Box>
      </Box>
    </Box>
  );
};

export default InquiryPage;
