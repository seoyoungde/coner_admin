import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  CircularProgress,
} from "@mui/material";
import { useAppContext } from "../context/AppContext";
import DeleteIcon from "@mui/icons-material/Delete";

const PartnerEngineerListPage = () => {
  const { partner, engineer } = useAppContext();
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [engineers, setEngineers] = useState([]);
  const [selectedEngineer, setSelectedEngineer] = useState(null);
  const [searchText, setSearchText] = useState("");

  const loading = partner.length === 0 || engineer.length === 0;

  useEffect(() => {
    if (!selectedPartner) return;
    const filtered = engineer.filter(
      (e) => e.partner_id === selectedPartner.partner_id
    );
    setEngineers(filtered);
    setSelectedEngineer(null);
  }, [selectedPartner, engineer]);

  const renderInfoRow = (label, value) => (
    <Box display="flex" justifyContent="space-between" py={0.5}>
      <Typography fontSize={13} color="textSecondary" width="40%">
        {label}
      </Typography>
      <Typography fontSize={13} textAlign="right" width="60%">
        {value || "-"}
      </Typography>
    </Box>
  );

  const matchedEngineer = engineer.find((e) =>
    e.name?.toLowerCase().includes(searchText.toLowerCase())
  );
  const matchedPartner = partner.find((p) =>
    p.name?.toLowerCase().includes(searchText.toLowerCase())
  );

  useEffect(() => {
    if (searchText === "") return;

    if (matchedPartner) {
      setSelectedPartner(matchedPartner);
    } else if (matchedEngineer) {
      const partnerMatch = partner.find(
        (p) => p.partner_id === matchedEngineer.partner_id
      );
      if (partnerMatch) setSelectedPartner(partnerMatch);
      setSelectedEngineer(matchedEngineer);
    }
  }, [searchText]);

  return (
    <Box display="flex" height="100vh">
      <Box width={250} borderRight="1px solid #ddd" p={2} overflow="auto">
        <TextField
          fullWidth
          size="small"
          placeholder="업체명 또는 기사명 검색"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Typography fontWeight="bold" fontSize={14} mb={2}>
          업체 목록
        </Typography>
        {loading ? (
          <CircularProgress size={24} />
        ) : (
          <Box display="flex" flexDirection="column" gap={1}>
            {partner.map((p) => (
              <Paper
                key={p.id}
                sx={{
                  p: 1,
                  cursor: "pointer",
                  bgcolor: selectedPartner?.id === p.id ? "#eee" : "white",
                }}
                onClick={() => setSelectedPartner(p)}
              >
                <Typography fontSize={13}>{p.name || p.id}</Typography>
              </Paper>
            ))}
          </Box>
        )}
      </Box>

      <Box flex={1} p={2} overflow="auto">
        {!selectedPartner ? (
          <Typography fontSize={14} color="gray">
            왼쪽에서 업체를 선택해주세요.
          </Typography>
        ) : (
          <Box display="flex" gap={2}>
            <Box flex={1} maxWidth="300px">
              <Paper sx={{ p: 2, height: "100%" }}>
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
                  업체 정보
                </Typography>
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  mb={2}
                >
                  {selectedPartner.logo_image_url ? (
                    <Box
                      component="img"
                      src={selectedPartner.logo_image_url}
                      alt="logo"
                      sx={{
                        width: 100,
                        height: 100,
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "1px solid #ccc",
                      }}
                    />
                  ) : (
                    <Typography fontSize={12} color="gray">
                      이미지 없음
                    </Typography>
                  )}
                </Box>
                <Box>
                  {renderInfoRow("업체ID", selectedPartner.partner_id)}
                  {renderInfoRow("업체이름", selectedPartner.name)}
                  {renderInfoRow("주소", selectedPartner.address)}
                  {renderInfoRow("상세주소", selectedPartner.address_detail)}
                  {renderInfoRow("경력", selectedPartner.career)}
                  {renderInfoRow("대표자명", selectedPartner.owner_name)}
                  {renderInfoRow("연락처", selectedPartner.owner_phone)}
                  {renderInfoRow("등록일", selectedPartner.registered_at)}
                  {renderInfoRow(
                    "의뢰완료건수",
                    selectedPartner.completed_request_count
                  )}
                </Box>
              </Paper>
            </Box>

            <Box flex={1} maxWidth="200px">
              <Paper sx={{ p: 2, height: "100%", overflowY: "auto" }}>
                <Typography fontWeight="bold" fontSize={14} mb={1}>
                  소속 기사님 목록
                </Typography>
                <Box display="flex" flexDirection="column" gap={1}>
                  {engineers.map((eng) => (
                    <Paper
                      key={eng.id}
                      sx={{
                        p: 1,
                        cursor: "pointer",
                        bgcolor:
                          selectedEngineer?.id === eng.id ? "#eee" : "white",
                      }}
                      onClick={() => setSelectedEngineer(eng)}
                    >
                      <Typography fontSize={13}>
                        {eng.name || eng.id}
                      </Typography>
                    </Paper>
                  ))}
                </Box>
              </Paper>
            </Box>

            <Box flex={2}>
              {selectedEngineer ? (
                <Paper sx={{ p: 2 }}>
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
                    기사님 정보
                  </Typography>
                  {selectedEngineer.profile_image_url && (
                    <Box display="flex" justifyContent="center" mb={2}>
                      <Box
                        component="img"
                        src={selectedEngineer.profile_image_url}
                        alt="기사님 프로필"
                        sx={{
                          width: 80,
                          height: 80,
                          borderRadius: "50%",
                          objectFit: "cover",
                          border: "1px solid #ccc",
                        }}
                      />
                    </Box>
                  )}
                  <Box>
                    {renderInfoRow("기사님 이름", selectedEngineer.name)}
                    {renderInfoRow("기사님 연락처", selectedEngineer.phone)}
                    {renderInfoRow("기사님 UID", selectedEngineer.engineer_id)}
                    {renderInfoRow(
                      "자격증",
                      selectedEngineer.certificate_file_url
                    )}
                    {renderInfoRow("경력", selectedEngineer.experience)}
                    {renderInfoRow(
                      "의뢰완료건수",
                      selectedEngineer.completed_request_count
                    )}
                    {renderInfoRow(
                      "기사님등록일",
                      selectedEngineer.registered_at
                    )}
                    {renderInfoRow(
                      "기사님등록번호",
                      selectedEngineer.resident_registration_number
                    )}
                    {renderInfoRow("업체 UID", selectedEngineer.partner_id)}
                    {/* {renderInfoRow("메모", selectedEngineer.memo)} */}
                  </Box>
                </Paper>
              ) : (
                <Typography fontSize={13} color="gray">
                  오른쪽에서 기사님을 선택해주세요.
                </Typography>
              )}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default PartnerEngineerListPage;
