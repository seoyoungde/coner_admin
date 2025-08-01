import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  CircularProgress,
  Button,
} from "@mui/material";
import { useAppContext } from "../context/AppContext";
import DeleteIcon from "@mui/icons-material/Delete";

const MemberList = () => {
  const { customer } = useAppContext();
  const [filtered, setFiltered] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    let temp = [...customer];

    if (filterType === "active") {
      temp = temp.filter((m) => m.isDeleted === false);
    } else if (filterType === "deleted") {
      temp = temp.filter((m) => m.isDeleted === true && m.state === 0);
    }

    if (searchText.trim()) {
      temp = temp.filter((m) => m.name?.includes(searchText.trim()));
    }

    setFiltered(temp);
    setSelectedMember(null);
  }, [searchText, filterType, customer]);

  const renderRow = (label, value) => (
    <Box display="flex" justifyContent="space-between" py={0.5}>
      <Typography fontSize={13} color="textSecondary" width="40%">
        {label}
      </Typography>
      <Typography fontSize={13} textAlign="right" width="60%">
        {value || "-"}
      </Typography>
    </Box>
  );

  return (
    <Box display="flex" height="100vh">
      <Box width={250} borderRight="1px solid #ddd" p={2} overflow="auto">
        <TextField
          fullWidth
          size="small"
          placeholder="회원 이름 검색"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          sx={{ mb: 2 }}
        />
        <ToggleButtonGroup
          value={filterType}
          exclusive
          onChange={(e, val) => setFilterType(val)}
          size="small"
          fullWidth
          sx={{ mb: 2 }}
        >
          <ToggleButton value="all">전체</ToggleButton>
          <ToggleButton value="active">일반회원</ToggleButton>
          <ToggleButton value="deleted">탈퇴회원</ToggleButton>
        </ToggleButtonGroup>

        {customer.length === 0 ? (
          <Box display="flex" justifyContent="center" mt={2}>
            <CircularProgress size={24} />
          </Box>
        ) : (
          <Box display="flex" flexDirection="column" gap={1}>
            {filtered.map((m) => (
              <Paper
                key={m.id}
                sx={{
                  p: 1,
                  cursor: "pointer",
                  bgcolor: selectedMember?.id === m.id ? "#eee" : "white",
                }}
                onClick={() => setSelectedMember(m)}
              >
                <Typography fontSize={13}>{m.name}</Typography>
              </Paper>
            ))}
          </Box>
        )}
      </Box>

      <Box flex={1} p={2}>
        {!selectedMember ? (
          <Typography fontSize={14} color="gray">
            왼쪽에서 회원을 선택해주세요.
          </Typography>
        ) : (
          <Paper sx={{ p: 2, maxWidth: 600 }}>
            <Box mb={2}>
              <Button
                variant="outlined"
                sx={{ height: "30px" }}
                startIcon={<DeleteIcon />}
              >
                삭제하기
              </Button>
              <Button
                variant="contained"
                sx={{ marginLeft: "8px", height: "30px" }}
              >
                수정하기
              </Button>
            </Box>
            <Typography fontWeight="bold" fontSize={15} mb={2}>
              회원 정보
            </Typography>
            <Box>
              {renderRow("이름", selectedMember.name)}
              {renderRow("회원 UID", selectedMember.member_id)}
              {renderRow("연락처", selectedMember.phone)}
              {renderRow("생년월일", selectedMember.birth_date)}
              {renderRow("이메일", selectedMember.email)}
              {renderRow("주소", selectedMember.address)}
              {renderRow("상세주소", selectedMember.address_detail)}
              {renderRow("고객유형", selectedMember.job)}
              {renderRow(
                "회원상태",
                selectedMember.isDeleted && selectedMember.state === 0
                  ? "탈퇴회원"
                  : "일반회원"
              )}
              {renderRow("탈퇴사유", selectedMember.withdrawDetail)}
              {renderRow("탈퇴사유", selectedMember.withdrawReasons)}
            </Box>
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default MemberList;
