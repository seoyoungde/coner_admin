import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  FormControl,
  RadioGroup,
  Radio,
  FormControlLabel,
  Select,
  MenuItem,
  Button,
  Grid,
} from "@mui/material";
import styled from "@emotion/styled";
import { useAppContext } from "../context/AppContext";
import AddressSearchModal from "../components/AddressSearchModal";
import { collection, setDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

const InquiryRegisterForm = () => {
  const navigate = useNavigate();
  const [imageUrls, setImageUrls] = useState(["", ""]);
  const [selectedPartnerId, setSelectedPartnerId] = useState("");
  const { engineer, partner, customer, payment } = useAppContext();
  const [address, setAddress] = useState("");
  const [addressDetail, setAddressDetail] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [serviceType, setServiceType] = useState("");
  const [airconType, setAirconType] = useState("");
  const [brand, setBrand] = useState("");
  const [serviceDate, setServiceDate] = useState(null);
  const [acceptedAt, setAcceptedAt] = useState(null);
  const [completedAt, setCompletedAt] = useState(null);
  const [createdAt, setCreatedAt] = useState(null);
  const [paymentRequestedAt, setPaymentRequestedAt] = useState(null);
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerType, setCustomerType] = useState("");
  const [customerUid, setCustomerUid] = useState("");
  const [detailInfo, setDetailInfo] = useState("");
  const [memo, setMemo] = useState("");
  const [status, setStatus] = useState("");
  const [sprint, setSprint] = useState("");
  const [selectedEngineerId, setSelectedEngineerId] = useState("");

  const activeCustomers = customer.filter((c) => c.isDeleted === false);
  const filteredEngineers = engineer.filter(
    (e) => e.partner_id === selectedPartnerId
  );
  const paymentList = [...new Set(payment.map((p) => p.payment_id))];

  const addImageField = () => {
    setImageUrls([...imageUrls, ""]);
  };

  const handleImageChange = (index, value) => {
    const updated = [...imageUrls];
    updated[index] = value;
    setImageUrls(updated);
  };

  const handleSubmit = async () => {
    try {
      const selectedEngineer = engineer.find(
        (e) => e.engineer_id === selectedEngineerId
      );
      const selectedPartner = partner.find(
        (p) => p.partner_id === selectedPartnerId
      );

      const newDocRef = doc(collection(db, "Request"));

      const docData = {
        request_id: newDocRef.id,
        service_type: serviceType || "",
        aircon_type: airconType || "",
        brand: brand || "",
        accepted_at: acceptedAt
          ? dayjs(acceptedAt).format("YYYY년 MM월 DD일")
          : "",
        completed_at: completedAt
          ? dayjs(completedAt).format("YYYY년 MM월 DD일")
          : "",
        created_at: createdAt
          ? dayjs(createdAt).format("YYYY년 MM월 DD일")
          : "",
        payment_requested_at: paymentRequestedAt
          ? dayjs(paymentRequestedAt).format("YYYY년 MM월 DD일")
          : "",
        service_date: serviceDate
          ? dayjs(serviceDate).format("YYYY년 MM월 DD일")
          : "",
        service_time: "",
        customer_address: address || "",
        customer_address_detail: addressDetail || "",
        customer_phone: customerPhone || "",
        customer_type: customerType || "",
        customer_uid: customerUid || "",
        detailInfo: detailInfo || "",
        memo: memo || "",
        status: parseInt(status) || 0,
        sprint: sprint ? [sprint] : [],
        service_images: imageUrls.filter((url) => url.trim() !== ""),
        engineer_uid: selectedEngineer?.engineer_id || "",
        engineer_name: selectedEngineer?.name || "",
        engineer_phone: selectedEngineer?.phone || "",
        engineer_profile_image: selectedEngineer?.profile_image_url || "",
        partner_uid: selectedPartner?.partner_id || "",
        partner_name: selectedPartner?.name || "",
        partner_address: selectedPartner?.address || "",
        partner_address_detail: selectedPartner?.address_detail || "",
      };

      console.log("🔥 저장할 데이터", docData);

      await setDoc(newDocRef, docData);

      alert("저장 완료!");
      navigate("/inquiry");
    } catch (error) {
      console.error("❌ 저장 실패", error);
      alert("저장 중 오류 발생: " + error.message);
    }
  };

  return (
    <Box maxWidth={1200} mx="auto">
      {/* 서비스타입 */}
      <Section>
        <Label>서비스타입</Label>
        <RadioGroup
          row
          value={serviceType}
          onChange={(e) => setServiceType(e.target.value)}
        >
          {["설치", "점검", "청소", "수리", "이전", "철거", "냉매충전"].map(
            (type) => (
              <FormControlLabel
                key={type}
                value={type}
                control={<Radio size="small" />}
                label={type}
              />
            )
          )}
        </RadioGroup>
      </Section>

      {/* 에어컨종류 */}
      <Section>
        <Label>에어컨종류</Label>
        <RadioGroup
          row
          value={airconType}
          onChange={(e) => setAirconType(e.target.value)}
        >
          {["벽걸이형", "스탠드형", "천장형", "창문형", "항온항습기"].map(
            (type) => (
              <FormControlLabel
                key={type}
                value={type}
                control={<Radio size="small" />}
                label={type}
              />
            )
          )}
        </RadioGroup>
      </Section>

      {/* 브랜드 */}
      <Section>
        <Label>브랜드</Label>
        <RadioGroup
          row
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
        >
          {[
            "삼성전자",
            "LG전자",
            "캐리어",
            "센추리",
            "귀뚜라미",
            "SK매직",
            "기타 또는 모름",
          ].map((type) => (
            <FormControlLabel
              key={type}
              value={type}
              control={<Radio size="small" />}
              label={type}
            />
          ))}
        </RadioGroup>
      </Section>

      {/* 기사님/제휴업체 */}
      <Grid container spacing={2} mb={2} alignItems="center">
        <Grid item xs={2}>
          <Label>기사님</Label>
        </Grid>
        <Grid item xs={4}>
          <FormControl fullWidth size="small">
            <Select
              defaultValue=""
              disabled={!selectedPartnerId}
              onChange={(e) => setSelectedEngineerId(e.target.value)}
              sx={{ width: 150 }}
              value={selectedEngineerId}
            >
              <MenuItem value="" disabled>
                선택하기
              </MenuItem>
              {filteredEngineers.map((e) => (
                <MenuItem key={e.engineer_id} value={e.engineer_id}>
                  {e.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={2}>
          <Label style={{ marginLeft: "50px" }}>제휴업체</Label>
          <Typography component="span" variant="caption" color="gray" ml={1}>
            (선택 후 기사님 선택 가능)
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <FormControl fullWidth size="small">
            <Select
              value={selectedPartnerId}
              onChange={(e) => setSelectedPartnerId(e.target.value)}
              sx={{ width: 150 }}
              displayEmpty
            >
              <MenuItem value="" disabled>
                선택하기
              </MenuItem>
              {partner.map((p) => (
                <MenuItem key={p.partner_id} value={p.partner_id}>
                  {p.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* 고객 주소 + 상세주소 */}
      <Grid container spacing={2} mb={2} alignItems="center">
        <Grid item xs={2}>
          <Label>고객 주소</Label>
        </Grid>
        <Grid item xs={10}>
          <TextField
            fullWidth
            size="small"
            sx={{ width: "300px" }}
            value={address}
            placeholder="주소 검색"
            onClick={() => setIsModalOpen(true)}
            InputProps={{
              readOnly: true,
            }}
          />
        </Grid>
        <Grid item xs={2}></Grid>
        <Grid item xs={10}>
          <TextField
            value={addressDetail}
            onChange={(e) => setAddressDetail(e.target.value)}
            size="small"
            placeholder="상세주소입력"
            sx={{ width: "250px" }}
          />
        </Grid>
      </Grid>

      {/* 고객 전화번호/UID */}
      <Grid container spacing={2} mb={2} alignItems="center">
        <Grid item xs={2}>
          <Label>전화번호</Label>
        </Grid>
        <Grid item xs={4}>
          <TextField
            fullWidth
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            size="small"
          />
        </Grid>
        <Grid item xs={2}>
          <Label>고객 UID</Label>
        </Grid>
        <Grid item xs={4}>
          <FormControl fullWidth size="small">
            <Select
              value={customerUid}
              onChange={(e) => setCustomerUid(e.target.value)}
              sx={{ width: 200 }}
            >
              <MenuItem value="" disabled>
                선택하기
              </MenuItem>
              {activeCustomers.map((c) => (
                <MenuItem key={c.member_id} value={c.member_id}>
                  {c.name} ({c.member_id})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* 날짜/스프린트/상태 등록 */}
      <Grid container spacing={2} mb={2} alignItems="center">
        <Grid item xs={2}>
          <Label>의뢰 수락일</Label>
        </Grid>
        <Grid item xs={4}>
          <TextField
            type="date"
            fullWidth
            size="small"
            value={acceptedAt}
            InputLabelProps={{ shrink: true }}
            onChange={(e) => setAcceptedAt(e.target.value)}
          />
        </Grid>
        <Grid item xs={2}>
          <Label style={{ marginLeft: "25px" }}>스프린트</Label>
        </Grid>
        <Grid item xs={4}>
          <TextField
            value={sprint}
            onChange={(e) => setSprint(e.target.value)}
            size="small"
          />
        </Grid>
      </Grid>

      {/* 의뢰 완료일 & 상태 */}
      <Grid container spacing={2} mb={2} alignItems="center">
        <Grid item xs={2}>
          <Label>의뢰 완료일</Label>
        </Grid>
        <Grid item xs={4}>
          <TextField
            type="date"
            fullWidth
            size="small"
            InputLabelProps={{ shrink: true }}
            value={completedAt}
            onChange={(e) => setCompletedAt(e.target.value)}
          />
        </Grid>
        <Grid item xs={2}>
          <Label style={{ marginLeft: "25px" }}>status</Label>
        </Grid>
        <Grid item xs={4}>
          <FormControl fullWidth size="small">
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              sx={{ width: 150 }}
            >
              <MenuItem value="0">취소</MenuItem>
              <MenuItem value="1">접수</MenuItem>
              <MenuItem value="2">기사님배정완료</MenuItem>
              <MenuItem value="3">진행 중</MenuItem>
              <MenuItem value="4">서비스완료</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* 의뢰 작성일 & 결제선택 */}
      <Grid container spacing={2} mb={2} alignItems="center">
        <Grid item xs={2}>
          <Label>의뢰 작성일</Label>
        </Grid>
        <Grid item xs={4}>
          <TextField
            type="date"
            fullWidth
            size="small"
            InputLabelProps={{ shrink: true }}
            value={createdAt}
            onChange={(e) => setCreatedAt(e.target.value)}
          />
        </Grid>
      </Grid>

      {/* 고객 요청날짜 */}
      <Grid container spacing={2} mb={2} alignItems="center">
        <Grid item xs={2}>
          <Label>고객 요청날짜</Label>
        </Grid>
        <Grid item xs={10}>
          <TextField
            type="date"
            fullWidth
            size="small"
            InputLabelProps={{ shrink: true }}
            value={serviceDate}
            onChange={(e) => setServiceDate(e.target.value)}
          />
        </Grid>
        <Grid item xs={2}>
          <Label style={{ marginLeft: "25px" }}>결제요청일</Label>
        </Grid>
        <Grid item xs={4}>
          <TextField
            type="date"
            fullWidth
            size="small"
            InputLabelProps={{ shrink: true }}
            value={paymentRequestedAt || ""}
            onChange={(e) => setPaymentRequestedAt(e.target.value)}
          />
        </Grid>
      </Grid>

      {/* 서비스 이미지 URL */}
      <Grid container spacing={2} mb={2} alignItems="flex-start">
        <Grid item xs={2}>
          <Label>서비스 이미지 URL</Label>
        </Grid>
        <Grid item xs={10}>
          <Box display="flex" flexDirection="column" gap={1}>
            {imageUrls.map((url, idx) => (
              <TextField
                key={idx}
                fullWidth
                size="small"
                placeholder={`이미지 URL ${idx + 1}`}
                value={url}
                onChange={(e) => handleImageChange(idx, e.target.value)}
              />
            ))}
            <Button variant="outlined" size="small" onClick={addImageField}>
              + 이미지 추가
            </Button>
          </Box>
        </Grid>
      </Grid>

      {/* 고객타입 */}
      <Section>
        <Label>고객타입</Label>
        <RadioGroup
          row
          value={customerType}
          onChange={(e) => setCustomerType(e.target.value)}
        >
          {["개인", "사업장"].map((type) => (
            <FormControlLabel
              key={type}
              value={type}
              control={<Radio size="small" />}
              label={type}
            />
          ))}
        </RadioGroup>
      </Section>

      {/* 추가요청사항 */}
      <Grid container spacing={2} mb={3} alignItems="flex-start">
        <Grid item xs={2}>
          <Label>추가요청사항</Label>
        </Grid>
        <Grid item xs={10}>
          <TextField
            fullWidth
            multiline
            minRows={5}
            placeholder="추가 요청 내용을 입력해주세요."
            size="small"
            sx={{ width: "650px" }}
            value={detailInfo}
            onChange={(e) => setDetailInfo(e.target.value)}
          />
        </Grid>
      </Grid>
      {/* 기사님메모 */}
      <Grid container spacing={2} mb={3} alignItems="flex-start">
        <Grid item xs={2}>
          <Label>기사님메모</Label>
        </Grid>
        <Grid item xs={10}>
          <TextField
            fullWidth
            multiline
            minRows={5}
            placeholder="기사님메모를 입력해주세요"
            size="small"
            sx={{ width: "650px" }}
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
          />
        </Grid>
      </Grid>

      <Box textAlign="center">
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          저장
        </Button>
      </Box>
      <AddressSearchModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onComplete={(selectedAddress) => setAddress(selectedAddress)}
      />
    </Box>
  );
};

export default InquiryRegisterForm;

const Section = styled(Box)({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  marginBottom: "16px",
});

const Label = styled(Typography)({
  minWidth: "120px",
  fontWeight: 500,
});
