import React from "react";
import { Box, Typography } from "@mui/material";
import Sidebar from "../layout/Sidebar";
import MemberRegisterForm from "../components/MemberRegisterForm";

const MemberRegisterPage = () => {
  return (
    <Box display="flex" flexDirection="column" height="100vh">
      <Box display="flex" flex={1}>
        <Sidebar />
        <Box flex={1} p={3}>
          <Typography fontWeight="bold" mb={1} style={{ width: "800px" }}>
            [ 회원 등록 - Customer / 일반회원의 경우 등록하게되면 파이어베이스
            auth등록이 되지않습니다 - 따로 등록이 필요합니다 ]
          </Typography>
          <Typography fontWeight="bold" mb={1}>
            * 탈퇴회원은 해당되지않음
          </Typography>
          <MemberRegisterForm />
        </Box>
      </Box>
    </Box>
  );
};

export default MemberRegisterPage;
