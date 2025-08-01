import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  CircularProgress,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import koLocale from "date-fns/locale/ko";
import { useAppContext } from "../context/AppContext";
import DeleteIcon from "@mui/icons-material/Delete";

const getPaymentStatusText = (code) => {
  switch (code) {
    case 0:
      return "결제 취소";
    case 1:
      return "결제 대기";
    case 2:
      return "결제 완료";
    default:
      return "알 수 없음";
  }
};

const PaymentList = () => {
  const { payment } = useAppContext();
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [selected, setSelected] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);

  useEffect(() => {
    setFilteredPayments(payment);
  }, [payment]);

  const parseDate = (str) => {
    const cleaned = str
      ?.replace(/\s/g, "")
      .replace("년", "-")
      .replace("월", "-")
      .replace("일", "");
    return new Date(cleaned);
  };

  const handleSearch = () => {
    const filtered = payment.filter((item) => {
      const paid = parseDate(item.paid_at);
      const start = startDate ? new Date(startDate.setHours(0, 0, 0, 0)) : null;
      const end = endDate ? new Date(endDate.setHours(23, 59, 59, 999)) : null;
      const inDateRange = !start || !end || (paid >= start && paid <= end);
      const inStatus = statusFilter === null || item.status === statusFilter;
      return inDateRange && inStatus;
    });
    setFilteredPayments(filtered);
    setSelected(null);
  };

  const showAll = () => {
    setFilteredPayments(payment);
    setSelected(null);
    setStartDate(null);
    setEndDate(null);
    setStatusFilter(null);
  };

  return (
    <Box display="flex">
      <Box display="flex" flexGrow={1} height="100vh">
        <Paper
          sx={{
            width: 250,
            borderRight: "1px solid #ddd",
            p: 2,
            overflow: "auto",
          }}
        >
          <Typography fontWeight="bold" fontSize={14} mb={2}>
            결제 목록
          </Typography>
          {payment.length === 0 ? (
            <CircularProgress size={24} />
          ) : (
            <Box display="flex" flexDirection="column" gap={1}>
              {filteredPayments.map((item) => (
                <Paper
                  key={item.id}
                  sx={{
                    p: 1,
                    cursor: "pointer",
                    bgcolor: selected?.id === item.id ? "#eee" : "white",
                  }}
                  onClick={() => setSelected(item)}
                >
                  <Typography fontSize={13}>{item.payment_id}</Typography>
                </Paper>
              ))}
            </Box>
          )}
        </Paper>

        <Box flex={1} p={3} overflow="auto">
          <Box display="flex" gap={2} mb={2} alignItems="center">
            <LocalizationProvider
              dateAdapter={AdapterDateFns}
              adapterLocale={koLocale}
            >
              <DatePicker
                label="시작일"
                value={startDate}
                onChange={setStartDate}
              />
              <DatePicker
                label="종료일"
                value={endDate}
                onChange={setEndDate}
              />
            </LocalizationProvider>
            <Button variant="outlined" onClick={handleSearch}>
              검색
            </Button>
            <Button variant="text" onClick={showAll}>
              전체보기
            </Button>
          </Box>

          <Box mb={2}>
            <ToggleButtonGroup
              value={statusFilter}
              exclusive
              onChange={(e, val) => setStatusFilter(val)}
              size="small"
            >
              <ToggleButton value={null}>전체</ToggleButton>
              <ToggleButton value={0}>결제 취소</ToggleButton>
              <ToggleButton value={1}>결제 대기</ToggleButton>
              <ToggleButton value={2}>결제 완료</ToggleButton>
            </ToggleButtonGroup>
            <Typography fontSize={12} color="gray" ml={2}>
              ※ 상태를 선택한 후 검색을 눌러야 적용됩니다.
            </Typography>
          </Box>

          <Paper sx={{ p: 2, border: "1px solid #ccc", minHeight: 500 }}>
            {!selected ? (
              <Typography fontSize={14} color="gray">
                결제 항목을 선택해주세요.
              </Typography>
            ) : (
              <Box display="flex" flexDirection="column" gap={1}>
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
                <Typography fontSize={14}>
                  <strong>결제 ID:</strong> {selected.payment_id}
                </Typography>
                <Typography fontSize={14}>
                  <strong>결제 수단:</strong> {selected.method}
                </Typography>
                <Typography fontSize={14}>
                  <strong>결제 금액:</strong> {selected.amount}원
                </Typography>
                <Typography fontSize={14}>
                  <strong>결제 요청일:</strong> {selected.created_at}
                </Typography>
                <Typography fontSize={14}>
                  <strong>결제 완료일:</strong> {selected.paid_at || "-"}
                </Typography>
                <Typography fontSize={14}>
                  <strong>결제 상태:</strong>{" "}
                  {getPaymentStatusText(selected.status)}
                </Typography>
              </Box>
            )}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default PaymentList;
