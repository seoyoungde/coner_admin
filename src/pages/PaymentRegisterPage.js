import React from "react";
import Sidebar from "../layout/Sidebar";
import PaymentRegisterForm from "../components/PaymentRegisterForm";
import { Box, Typography } from "@mui/material";

const PaymentRegisterPage = () => {
  return (
    <>
      <Box display="flex">
        <Sidebar />
        <Box p={4} flexGrow={1}>
          <Typography fontWeight="bold" mb={1}>
            [ 결제 등록 -payment ]
          </Typography>
          <PaymentRegisterForm />
        </Box>
      </Box>
    </>
  );
};

export default PaymentRegisterPage;
