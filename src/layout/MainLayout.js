// src/components/Layout/MainLayout.jsx
import React from "react";
import { Box } from "@mui/material";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const MainLayout = ({ children }) => {
  return (
    <Box display="flex" height="100vh">
      <Sidebar />
      <Box flex={1} display="flex" flexDirection="column">
        <Topbar />
        <Box flex={1} p={3} overflow="auto">
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
