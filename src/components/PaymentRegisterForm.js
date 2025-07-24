import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Button,
  Grid,
} from "@mui/material";
import styled from "@emotion/styled";
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAppContext } from "../context/AppContext";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

const PaymentRegisterForm = () => {
  const { engineer, request } = useAppContext();

  const [paymentId, setPaymentId] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [paidAt, setPaidAt] = useState("");
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      if (!paymentId) {
        alert("의뢰서를 선택해주세요.");
        return;
      }

      const docRef = doc(db, "Payment", paymentId);

      const payload = {
        payment_id: paymentId,
        amount,
        method,
        created_at: createdAt
          ? dayjs(createdAt).format("YYYY년 MM월 DD일")
          : "",
        paid_at: paidAt ? dayjs(paidAt).format("YYYY년 MM월 DD일") : "",
        status: parseInt(status),
      };

      await setDoc(docRef, payload);
      alert("결제 정보가 저장되었습니다.");
      navigate("/payment-list");
    } catch (error) {
      console.error("❌ 저장 실패", error);
      alert("저장 실패: " + error.message);
    }
  };

  return (
    <Box px={4} pt={4}>
      {[
        {
          label: "의뢰서",
          required: true,
          field: (
            <FormControl fullWidth size="small">
              <Select
                value={paymentId}
                onChange={(e) => setPaymentId(e.target.value)}
                displayEmpty
              >
                <MenuItem value="" disabled>
                  의뢰서 선택
                </MenuItem>
                {request.map((r) => (
                  <MenuItem key={r.request_id} value={r.request_id}>
                    {`${r.customer_phone ?? "고객"} - ${
                      r.service_type ?? "서비스"
                    } (${r.created_at ?? "-"})`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ),
        },
        {
          label: "비용",
          required: true,
          field: (
            <TextField
              fullWidth
              placeholder="비용입력"
              size="small"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          ),
        },
        {
          label: "결제방식",
          required: true,
          field: (
            <FormControl fullWidth size="small">
              <Select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                displayEmpty
              >
                <MenuItem value="" disabled>
                  결제방식
                </MenuItem>
                {[
                  "기사님에게 직접 결제",
                  "유선 결제",
                  "계좌이체",
                  "현장 카드결제",
                ].map((m) => (
                  <MenuItem key={m} value={m}>
                    {m}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ),
        },
        {
          label: "생성일",
          required: true,
          field: (
            <TextField
              fullWidth
              type="date"
              size="small"
              value={createdAt}
              onChange={(e) => setCreatedAt(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          ),
        },
        {
          label: "결제일",
          required: true,
          field: (
            <TextField
              fullWidth
              type="date"
              size="small"
              value={paidAt}
              onChange={(e) => setPaidAt(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          ),
        },
        {
          label: "status",
          required: true,
          field: (
            <FormControl fullWidth size="small">
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                displayEmpty
              >
                <MenuItem value="" disabled>
                  상태등록
                </MenuItem>
                <MenuItem value="0">0 : 취소</MenuItem>
                <MenuItem value="1">1 : 접수</MenuItem>
                <MenuItem value="2">2 : 기사배정완료</MenuItem>
                <MenuItem value="3">3 : 진행 중</MenuItem>
                <MenuItem value="4">4 : 서비스완료</MenuItem>
              </Select>
            </FormControl>
          ),
        },
      ].map(({ label, required, field }) => (
        <Grid
          container
          spacing={2}
          alignItems="center"
          sx={{ mb: 1.5 }}
          key={label}
        >
          <Grid item xs={3}>
            <Typography fontWeight={500}>
              {required && <RedStar>*</RedStar>}
              {label}
            </Typography>
          </Grid>
          <Grid item xs={9}>
            {field}
          </Grid>
        </Grid>
      ))}

      {/* 저장 버튼 */}
      <Box mt={4}>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          저장
        </Button>
      </Box>
    </Box>
  );
};

export default PaymentRegisterForm;

const RedStar = styled("span")({
  color: "red",
  marginRight: 4,
});
