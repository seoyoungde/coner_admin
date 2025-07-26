import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  RadioGroup,
  FormControlLabel,
  Radio,
  MenuItem,
  Select,
  FormGroup,
  Checkbox,
} from "@mui/material";
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import dayjs from "dayjs";
import AddressSearchModal from "../components/AddressSearchModal";
import { useNavigate } from "react-router-dom";

const MemberRegisterForm = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [addressDetail, setAddressDetail] = useState("");
  const [birthAt, setBirthAt] = useState("");
  const [Phone, setPhone] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customerType, setCustomerType] = useState("");
  const [status, setStatus] = useState("");
  const [withdrawDetail, setWithdrawDetail] = useState("");
  const [withdrawReasons, setWithdrawReasons] = useState([]);

  const handleSubmit = async () => {
    try {
      const docRef = doc(collection(db, "Customer"));
      const memberId = docRef.id;

      const payload = {
        member_id: memberId,
        name,
        address,
        address_detail: addressDetail,
        birth_date: birthAt ? dayjs(birthAt).format("YYYY년 MM월 DD일") : "",
        phone: Phone,
        email: email,
        status: parseInt(status) || 0,
        job: customerType || "",
        isDeleted: false,
      };

      await setDoc(docRef, payload);
      alert("저장되었습니다!");
      navigate("/member-list");
    } catch (error) {
      console.error("❌ 저장 실패:", error);
      alert("저장 실패: " + error.message);
    }
  };

  return (
    <Box px={4} pt={4} maxWidth={600} ml={4}>
      <Grid container spacing={2} direction="column">
        <FormRow label="이름" required>
          <TextField
            fullWidth
            size="small"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름"
          />
        </FormRow>

        <FormRow label="이메일주소" required>
          <TextField
            fullWidth
            size="small"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일주소"
            style={{ width: "400px" }}
          />
        </FormRow>

        <FormRow label="고객주소" required>
          <Box display="flex" gap={1} flexDirection="column">
            <TextField
              size="small"
              placeholder="주소검색"
              fullWidth
              value={address}
              onClick={() => setIsModalOpen(true)}
              InputProps={{ readOnly: true }}
              style={{ width: "400px" }}
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

        <FormRow label="생년월일" required>
          <TextField
            size="small"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={birthAt}
            onChange={(e) => setBirthAt(e.target.value)}
          />
        </FormRow>

        <FormRow label="전화번호" required>
          <TextField
            size="small"
            fullWidth
            placeholder="전화번호"
            value={Phone}
            onChange={(e) => setPhone(e.target.value)}
            style={{ width: "300px" }}
          />
        </FormRow>

        <FormRow label="고객유형" required>
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
        </FormRow>

        <FormRow label="회원상태" required>
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            sx={{ width: 150, height: "45px" }}
          >
            <MenuItem value="0">탈퇴회원</MenuItem>
            <MenuItem value="1">일반회원</MenuItem>
          </Select>
          {status === "0" && (
            <>
              <FormRow label="탈퇴 상세 사유" required>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="예: 그냥요"
                  value={withdrawDetail}
                  onChange={(e) => setWithdrawDetail(e.target.value)}
                />
              </FormRow>

              <FormRow label="탈퇴 사유 선택" required>
                <FormGroup row>
                  {[
                    "콘텐츠 등 정보 부족",
                    "고객대응 불친절",
                    "이용빈도 낮음",
                    "재가입",
                    "제휴서비스 불만",
                    "기타",
                  ].map((reason) => (
                    <FormControlLabel
                      key={reason}
                      control={
                        <Checkbox
                          checked={withdrawReasons.includes(reason)}
                          onChange={(e) => {
                            const updated = e.target.checked
                              ? [...withdrawReasons, reason]
                              : withdrawReasons.filter((r) => r !== reason);
                            setWithdrawReasons(updated);
                          }}
                        />
                      }
                      label={reason}
                    />
                  ))}
                </FormGroup>
              </FormRow>
            </>
          )}
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

export default MemberRegisterForm;
