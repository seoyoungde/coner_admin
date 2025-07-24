import React from "react";
import { Box, Typography, Divider } from "@mui/material";
import Sidebar from "../layout/Sidebar";
import MemberList from "../components/MemberList";

const MemberListPage = () => {
  return (
    <Box display="flex" flexDirection="column" height="100vh">
      <Box display="flex" flex={1}>
        <Sidebar />
        <Box flex={1} p={3}>
          <Typography fontWeight="bold" mb={1}>
            [ 회원 목록 - Customer ]
          </Typography>

          <Divider sx={{ my: 3 }} />
          <MemberList />
        </Box>
      </Box>
    </Box>
  );
};

export default MemberListPage;
