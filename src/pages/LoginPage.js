import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const admins = [
    { id: "seoyoung", pw: "990906" },
    { id: "ceo@coner.kr", pw: "tjwlsgud1!" },
  ];

  const handleLogin = () => {
    const isValid = admins.some(
      (admin) => admin.id === username && admin.pw === password
    );

    if (isValid) {
      setError("");
      localStorage.setItem("isLoggedIn", "true");
      navigate("/");
    } else {
      setError("등록된 계정이 아닙니다.");
    }
  };

  return (
    <Box display="flex" flexDirection="column" height="100vh">
      <Box display="flex" flex={1}>
        <Box
          width="120px"
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          alignItems="center"
          borderRight="1px solid #ccc"
          py={2}
        >
          <Box>
            <Typography sx={{ fontSize: 14, mb: 2 }}>로그인</Typography>
          </Box>
        </Box>

        <Box
          display="flex"
          flex={1}
          justifyContent="center"
          alignItems="center"
        >
          <Paper variant="outlined" sx={{ width: 400, p: 4 }}>
            <Typography align="center" mb={3}>
              통합관리자 로그인
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box display="flex" flexDirection="column" gap={2}>
              <TextField
                label="아이디"
                size="small"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <TextField
                label="비밀번호"
                type="password"
                size="small"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                variant="contained"
                onClick={handleLogin}
                sx={{ bgcolor: "#f44336", "&:hover": { bgcolor: "#d32f2f" } }}
              >
                로그인
              </Button>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;
