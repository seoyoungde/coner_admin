import React from "react";
import { Box, Typography, Divider } from "@mui/material";
import Sidebar from "../layout/Sidebar";

import PaymentList from "../components/PaymentList";

const PaymentListPage = () => {
  return (
    <Box display="flex" flexDirection="column" height="100vh">
      <Box display="flex" flex={1}>
        <Sidebar />
        <Box flex={1} p={3}>
          <Typography fontWeight="bold" mb={1}>
            [ 결제목록 -Payment ]
          </Typography>

          <Divider sx={{ my: 3 }} />
          <PaymentList />
        </Box>
      </Box>
    </Box>
  );
};

export default PaymentListPage;
