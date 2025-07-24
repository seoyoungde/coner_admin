import React from "react";
import { Box, Typography, Divider } from "@mui/material";
import Sidebar from "../layout/Sidebar";
import PartnerEngineerList from "../components/PartnerEngineerList";

const PartnerEngineerListPage = () => {
  return (
    <Box display="flex" flexDirection="column" height="100vh">
      <Box display="flex" flex={1}>
        <Sidebar />
        <Box flex={1} p={3}>
          <Typography fontWeight="bold" mb={1}>
            [ 업체/기사님 목록 - Partner / Engineer ]
          </Typography>

          <Divider sx={{ my: 3 }} />
          <PartnerEngineerList />
        </Box>
      </Box>
    </Box>
  );
};

export default PartnerEngineerListPage;
