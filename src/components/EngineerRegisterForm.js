import React, { useState } from "react";
import { Box, Typography, TextField, Button, Grid } from "@mui/material";
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import dayjs from "dayjs";
import AddressSearchModal from "../components/AddressSearchModal";
import { useNavigate } from "react-router-dom";

const EngineerRegisterForm = () => {
  const navigate = useNavigate();
  const [logoUrl, setLogoUrl] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [addressDetail, setAddressDetail] = useState("");
  const [registeredAt, setRegisteredAt] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [completedCount, setCompletedCount] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = async () => {
    try {
      const docRef = doc(collection(db, "Partner"));
      const partnerId = docRef.id;

      const payload = {
        partner_id: partnerId,
        name,
        address,
        address_detail: addressDetail,
        registered_at: registeredAt
          ? dayjs(registeredAt).format("YYYY년 MM월 DD일")
          : "",
        owner_name: ownerName,
        owner_phone: ownerPhone,
        completed_request_count: parseInt(completedCount) || 0,
        logo_image_url: logoUrl,
      };

      await setDoc(docRef, payload);
      alert("저장되었습니다!");
      navigate("/partners");
    } catch (error) {
      console.error("❌ 저장 실패:", error);
      alert("저장 실패: " + error.message);
    }
  };

  return (
    <Box px={4} pt={4} maxWidth={600} ml={4}>
      <Grid container spacing={2} direction="column">
        <FormRow label="업체명" required>
          <TextField
            fullWidth
            size="small"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="업체명"
          />
        </FormRow>

        <FormRow label="업체주소" required>
          <Box display="flex" gap={1} flexDirection="column">
            <TextField
              size="small"
              placeholder="주소검색"
              fullWidth
              value={address}
              onClick={() => setIsModalOpen(true)}
              InputProps={{ readOnly: true }}
            />
            <TextField
              size="small"
              placeholder="상세주소"
              fullWidth
              value={addressDetail}
              onChange={(e) => setAddressDetail(e.target.value)}
            />
          </Box>
        </FormRow>

        <FormRow label="등록일" required>
          <TextField
            size="small"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={registeredAt}
            onChange={(e) => setRegisteredAt(e.target.value)}
          />
        </FormRow>

        <FormRow label="대표님 성함" required>
          <TextField
            size="small"
            fullWidth
            placeholder="대표님 성함"
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
          />
        </FormRow>

        <FormRow label="대표님 연락처" required>
          <TextField
            size="small"
            fullWidth
            placeholder="대표님 연락처"
            value={ownerPhone}
            onChange={(e) => setOwnerPhone(e.target.value)}
          />
        </FormRow>

        <FormRow label="의뢰완료건수" required>
          <TextField
            type="number"
            size="small"
            fullWidth
            placeholder="숫자만 입력"
            inputProps={{ min: 0 }}
            value={completedCount}
            onChange={(e) => setCompletedCount(e.target.value)}
          />
        </FormRow>

        <FormRow label="로고이미지" required>
          <Box width="100%">
            <TextField
              size="small"
              placeholder="로고 이미지 URL 입력"
              fullWidth
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
            />
          </Box>
        </FormRow>

        <Grid item>
          <Box mt={3} textAlign="left">
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              저장
            </Button>
          </Box>
        </Grid>
      </Grid>

      <AddressSearchModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onComplete={(selectedAddress) => setAddress(selectedAddress)}
      />
    </Box>
  );
};

const RedStar = ({ children = "*" }) => (
  <Box component="span" sx={{ color: "red", mr: 0.5 }}>
    {children}
  </Box>
);

const FormRow = ({ label, required, children }) => (
  <Grid container spacing={2} alignItems="center">
    <Grid item xs={3}>
      <Typography fontWeight={500} sx={{ minWidth: "100px" }}>
        {required && <RedStar />} {label}
      </Typography>
    </Grid>
    <Grid item xs={9}>
      {children}
    </Grid>
  </Grid>
);

export default EngineerRegisterForm;
