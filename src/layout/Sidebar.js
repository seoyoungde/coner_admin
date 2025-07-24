// src/components/Sidebar.jsx
import React from "react";
import { Box, Typography } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: "의뢰서 목록", path: "/inquiry" },
    { label: "의뢰서 등록", path: "/inquiry-register" },
    { label: "결제 목록", path: "/payment-list" },
    { label: "결제 등록", path: "/payment-register" },
    { label: "기사님/업체 목록", path: "/partners" },
    { label: "신규 기사님 등록", path: "/partner-engineer-register" },
    { label: "신규 업체 등록", path: "/partner-company-register" },
    { label: "회원 목록", path: "/member-list" },
    { label: "회원 등록", path: "/member-register" },
  ];

  return (
    <Box
      width="150px"
      borderRight="1px solid #ccc"
      p={2}
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      height="130vh"
    >
      <Box>
        <Typography fontWeight="bold" mb={2}>
          등록목록 관리
        </Typography>
        {menuItems.map((item, i) => (
          <Typography
            key={i}
            sx={{
              fontSize: 14,
              mb: 1,
              cursor: "pointer",
              fontWeight: location.pathname === item.path ? "bold" : "normal",
              color: location.pathname === item.path ? "#1976d2" : "inherit",
            }}
            onClick={() => navigate(item.path)}
          >
            {item.label}
          </Typography>
        ))}
      </Box>
    </Box>
  );
};

export default Sidebar;
