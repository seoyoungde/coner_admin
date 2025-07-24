import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AppBar, Toolbar, Typography, Box, IconButton } from "@mui/material";
import { useAppContext } from "../context/AppContext";
import RefreshIcon from "@mui/icons-material/Refresh";

const Topbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );
  const { refreshAll } = useAppContext();
  const handleRefresh = () => {
    refreshAll();
  };
  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
  }, [location]);

  const handleAuthClick = () => {
    if (isLoggedIn) {
      localStorage.removeItem("isLoggedIn");
      setIsLoggedIn(false);
      navigate("/login");
    } else {
      navigate("/login");
    }
  };

  const handleTabClick = (path) => {
    if (!isLoggedIn) {
      alert("로그인이 필요한 메뉴입니다.");
      return;
    }
    navigate(path);
  };

  const tabs = [
    { label: "메인화면", path: "/" },
    { label: "등록/목록관리", path: "/inquiry" },
    { label: "지도", path: "/map" },
  ];

  return (
    <AppBar
      position="static"
      elevation={1}
      sx={{ bgcolor: "#ffffff", color: "#000000" }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Box display="flex" alignItems="center">
          <Typography fontWeight="bold" sx={{ mr: 4, fontSize: 16 }}>
            코너
          </Typography>
          {tabs.map((tab, i) => (
            <Typography
              key={i}
              sx={{ cursor: "pointer", fontSize: 14, mr: 3 }}
              onClick={() => handleTabClick(tab.path)}
            >
              {tab.label}
            </Typography>
          ))}
          <Box>
            <IconButton onClick={handleRefresh} title="데이터 새로고침">
              <RefreshIcon />
            </IconButton>
          </Box>
        </Box>

        <Typography
          sx={{ fontSize: 14, cursor: "pointer" }}
          onClick={handleAuthClick}
        >
          {isLoggedIn ? "로그아웃" : "로그인"}
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
