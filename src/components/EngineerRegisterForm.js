import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  FormControl,
  Select,
} from "@mui/material";
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const EngineerRegisterForm = () => {
  const navigate = useNavigate();
  const [certificateUrl, setCertificateUrl] = useState("");
  const [name, setName] = useState("");
  const [registeredAt, setRegisteredAt] = useState("");
  const [engineerPhone, setEngineerPhone] = useState("");
  const [completedCount, setCompletedCount] = useState("");
  const [experience, setExperience] = useState("");
  const [registrationnum, setRegistrationnum] = useState("");
  const [profile, setProfile] = useState("");
  const [selectedPartnerId, setSelectedPartnerId] = useState("");
  const { partner } = useAppContext();

  const handleSubmit = async () => {
    try {
      const selectedPartner = partner.find(
        (p) => p.partner_id === selectedPartnerId
      );
      const docRef = doc(collection(db, "Engineer"));
      const engineerId = docRef.id;

      const payload = {
        engineer_id: engineerId,
        name,
        registered_at: registeredAt
          ? dayjs(registeredAt).format("YYYY년 MM월 DD일")
          : "",
        phone: engineerPhone,
        experience: parseInt(experience) || 0,
        resident_registration_number: registrationnum,
        completed_request_count: parseInt(completedCount) || 0,
        certificate_file_url: certificateUrl,
        profile_image_url: profile,
        partner_id: selectedPartner?.partner_id || "",
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
        <FormRow label="소속된 업체 선택" required>
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
        </FormRow>

        <FormRow label="기사님 이름" required>
          <TextField
            fullWidth
            size="small"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="기사님 이름"
          />
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

        <FormRow label="기사님 연락처" required>
          <TextField
            size="small"
            fullWidth
            placeholder="기사님 연락처"
            value={engineerPhone}
            onChange={(e) => setEngineerPhone(e.target.value)}
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

        <FormRow label="경력(년)" required>
          <TextField
            type="number"
            size="small"
            fullWidth
            placeholder="숫자만 입력"
            inputProps={{ min: 0 }}
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
          />
        </FormRow>

        <FormRow label="기사님 주민등록번호입력" required>
          <TextField
            size="small"
            fullWidth
            placeholder="기사님 주민등록번호입력"
            value={registrationnum}
            onChange={(e) => setRegistrationnum(e.target.value)}
          />
        </FormRow>

        <FormRow label="증명서 파일 url" required>
          <Box width="100%">
            <TextField
              size="small"
              placeholder="증명서 파일 URL 입력"
              fullWidth
              value={certificateUrl}
              onChange={(e) => setCertificateUrl(e.target.value)}
            />
          </Box>
        </FormRow>

        <FormRow label="프로필 파일 url" required>
          <Box width="100%">
            <TextField
              size="small"
              placeholder="프로필 파일 URL 입력"
              fullWidth
              value={profile}
              onChange={(e) => setProfile(e.target.value)}
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
