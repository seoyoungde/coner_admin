import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
  MenuItem,
  Select,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import koLocale from "date-fns/locale/ko";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAppContext } from "../context/AppContext";
import DeleteIcon from "@mui/icons-material/Delete";

const InquiryDetails = () => {
  const { request } = useAppContext();
  const [filteredInquiries, setFilteredInquiries] = useState([]);
  const [selected, setSelected] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);

  const [isEditMode, setIsEditMode] = useState(false);
  const [editedData, setEditedData] = useState({});

  useEffect(() => {
    setFilteredInquiries(request);
  }, [request]);

  useEffect(() => {
    const fetchPayment = async () => {
      if (!selected) {
        setPaymentInfo(null);
        return;
      }
      try {
        const docRef = doc(db, "Payment", selected.id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPaymentInfo(docSnap.data());
        } else {
          setPaymentInfo(null);
        }
      } catch (e) {
        console.error("결제 정보 불러오기 실패", e);
        setPaymentInfo(null);
      }
    };
    fetchPayment();
  }, [selected]);

  const parseDate = (str) => {
    const cleaned = str
      ?.replace(/\s/g, "")
      .replace("년", "-")
      .replace("월", "-")
      .replace("일", "");
    return new Date(cleaned);
  };

  const handleSearch = () => {
    const filtered = request.filter((item) => {
      const created = parseDate(item.created_at);
      const start = startDate ? new Date(startDate.setHours(0, 0, 0, 0)) : null;
      const end = endDate ? new Date(endDate.setHours(23, 59, 59, 999)) : null;
      const inDateRange =
        !start || !end || (created >= start && created <= end);
      const inStatus = statusFilter === null || item.status === statusFilter;
      return inDateRange && inStatus;
    });
    setFilteredInquiries(filtered);
    setSelected(null);
  };

  const showAllInquiries = () => {
    setFilteredInquiries(request);
    setSelected(null);
    setStartDate(null);
    setEndDate(null);
    setStatusFilter(null);
  };

  const getStatusText = (code) => {
    switch (code) {
      case 0:
        return "취소완료";
      case 1:
        return "접수 완료";
      case 2:
        return "기사님배정완료";
      case 3:
        return "서비스중";
      case 4:
        return "서비스완료";
      default:
        return "알 수 없음";
    }
  };

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

  const handleSave = async () => {
    try {
      const docRef = doc(db, "Request", selected.id);
      await updateDoc(docRef, editedData);
      alert("수정 완료되었습니다.");
      setIsEditMode(false);
      setSelected((prev) => ({ ...prev, ...editedData }));
      setEditedData({});
    } catch (e) {
      console.error("수정 실패:", e);
      alert("수정 중 오류가 발생했습니다.");
    }
  };

  const renderEditable = (field, type = "text") => {
    const currentValue = editedData[field] ?? selected[field] ?? "";

    if (!isEditMode) {
      if (Array.isArray(currentValue)) return currentValue.join(", ");
      return currentValue;
    }

    if (type === "select") {
      return (
        <Box>
          <Typography fontSize={12} color="textSecondary" mb={0.5}>
            현재: {getStatusText(selected[field])}
          </Typography>
          <Select
            size="small"
            value={currentValue}
            onChange={(e) =>
              setEditedData({ ...editedData, [field]: Number(e.target.value) })
            }
          >
            <MenuItem value={0}>취소완료</MenuItem>
            <MenuItem value={1}>접수 완료</MenuItem>
            <MenuItem value={2}>기사님배정완료</MenuItem>
            <MenuItem value={3}>서비스중</MenuItem>
            <MenuItem value={4}>서비스완료</MenuItem>
          </Select>
        </Box>
      );
    }

    if (field === "brand") {
      const brandOptions = [
        "삼성전자",
        "LG전자",
        "캐리어",
        "센추리",
        "귀뚜라미",
        "SK매직",
        "기타(추천 또는 모름",
      ];
      return (
        <Box>
          <Typography fontSize={12} color="textSecondary" mb={0.5}>
            현재: {selected[field] ?? "-"}
          </Typography>
          <Select
            size="small"
            value={currentValue}
            onChange={(e) =>
              setEditedData({ ...editedData, [field]: e.target.value })
            }
            fullWidth
            sx={{
              height: 36,
              fontSize: 13,
              ".MuiSelect-select": {
                paddingTop: "6px",
                paddingBottom: "6px",
              },
            }}
          >
            {brandOptions.map((label) => (
              <MenuItem key={label} value={label}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </Box>
      );
    }
    if (field === "service_type") {
      const serviceTypeOptions = [
        "설치",
        "설치&에에컨구매",
        "점검",
        "청소",
        "수리",
        "냉매충전",
        "이전",
        "철거",
      ];
      return (
        <Box>
          <Typography fontSize={12} color="textSecondary" mb={0.5}>
            현재: {selected[field] ?? "-"}
          </Typography>
          <Select
            size="small"
            value={currentValue}
            onChange={(e) =>
              setEditedData({ ...editedData, [field]: e.target.value })
            }
            fullWidth
            sx={{
              height: 36,
              fontSize: 13,
              ".MuiSelect-select": {
                paddingTop: "6px",
                paddingBottom: "6px",
              },
            }}
          >
            {serviceTypeOptions.map((label) => (
              <MenuItem key={label} value={label}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </Box>
      );
    }
    if (field === "aircon_type") {
      const airconTypeOptions = [
        "벽걸이형",
        "스탠드형",
        "천장형",
        "창문형",
        "항온항습기",
      ];
      return (
        <Box>
          <Typography fontSize={12} color="textSecondary" mb={0.5}>
            현재: {selected[field] ?? "-"}
          </Typography>
          <Select
            size="small"
            value={currentValue}
            onChange={(e) =>
              setEditedData({ ...editedData, [field]: e.target.value })
            }
            fullWidth
            sx={{
              height: 36,
              fontSize: 13,
              ".MuiSelect-select": {
                paddingTop: "6px",
                paddingBottom: "6px",
              },
            }}
          >
            {airconTypeOptions.map((label) => (
              <MenuItem key={label} value={label}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </Box>
      );
    }
    if (field === "service_time") {
      const timeOptions = [
        "오전9시 ~ 오후12시",
        "오후1시 ~ 오후4시",
        "오후5시 ~ 오후8시",
      ];
      return (
        <Box>
          <Typography fontSize={12} color="textSecondary" mb={0.5}>
            현재: {selected[field] ?? "-"}
          </Typography>
          <Select
            size="small"
            value={currentValue}
            onChange={(e) =>
              setEditedData({ ...editedData, [field]: e.target.value })
            }
            fullWidth
            sx={{
              height: 36,
              fontSize: 13,
              ".MuiSelect-select": {
                paddingTop: "6px",
                paddingBottom: "6px",
              },
            }}
          >
            {timeOptions.map((label) => (
              <MenuItem key={label} value={label}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </Box>
      );
    }
    if (field === "customer_type") {
      return (
        <Box>
          <Typography fontSize={12} color="textSecondary" mb={0.5}>
            현재: {selected[field] ?? "-"}
          </Typography>
          <Select
            size="small"
            value={currentValue}
            onChange={(e) =>
              setEditedData({ ...editedData, [field]: e.target.value })
            }
            fullWidth
            sx={{
              height: 36, // 전체 높이 조절
              fontSize: 13,
              ".MuiSelect-select": {
                paddingTop: "6px",
                paddingBottom: "6px",
              },
            }}
          >
            <MenuItem value="개인(가정)">개인(가정)</MenuItem>
            <MenuItem value="사업장(기업/매장)">사업장(기업/매장)</MenuItem>
          </Select>
        </Box>
      );
    }
    if (type === "date") {
      return (
        <Box>
          <Typography fontSize={12} color="textSecondary" mb={0.5}>
            현재: {selected[field] ?? "-"}
          </Typography>
          <LocalizationProvider
            dateAdapter={AdapterDateFns}
            adapterLocale={koLocale}
          >
            <DatePicker
              format="yyyy-MM-dd"
              value={currentValue ? parseDate(currentValue) : null}
              onChange={(newVal) =>
                setEditedData({
                  ...editedData,
                  [field]: newVal
                    ? `${newVal.getFullYear()}년 ${String(
                        newVal.getMonth() + 1
                      ).padStart(2, "0")}월 ${String(newVal.getDate()).padStart(
                        2,
                        "0"
                      )}일`
                    : "",
                })
              }
              slotProps={{
                textField: {
                  size: "small",
                  InputProps: { sx: { height: 36, fontSize: 13 } }, // 높이와 글자 크기 조절
                },
              }}
            />
          </LocalizationProvider>
        </Box>
      );
    }

    if (Array.isArray(selected[field])) {
      <Box>
        <Typography fontSize={12} color="textSecondary" mb={0.5}>
          현재: {getStatusText(selected[field])}
        </Typography>
        <Select
          size="small"
          value={currentValue}
          onChange={(e) =>
            setEditedData({ ...editedData, [field]: Number(e.target.value) })
          }
        >
          <MenuItem value={0}>취소완료</MenuItem>
          <MenuItem value={1}>접수 완료</MenuItem>
          <MenuItem value={2}>기사님배정완료</MenuItem>
          <MenuItem value={3}>서비스중</MenuItem>
          <MenuItem value={4}>서비스완료</MenuItem>
        </Select>
      </Box>;
    }

    if (Array.isArray(selected[field])) {
      return (
        <Box>
          <Typography fontSize={12} color="textSecondary" mb={0.5}>
            현재: {(selected[field] || []).join(", ") || "-"}
          </Typography>
          <input
            value={(currentValue || []).join(", ")}
            onChange={(e) =>
              setEditedData({
                ...editedData,
                [field]: e.target.value
                  .split(",")
                  .map((v) => v.trim())
                  .filter((v) => v !== ""),
              })
            }
            style={{ width: "100%", fontSize: "13px" }}
          />
        </Box>
      );
    }

    const isMultilineField = ["detailInfo", "memo"].includes(field);

    return (
      <Box>
        <Typography fontSize={12} color="textSecondary" mb={0.5}>
          현재: {selected[field] ?? "-"}
        </Typography>
        {isMultilineField ? (
          <textarea
            value={currentValue}
            onChange={(e) =>
              setEditedData({ ...editedData, [field]: e.target.value })
            }
            style={{
              width: "100%",
              fontSize: "13px",
              minHeight: "80px",
              resize: "vertical",
            }}
          />
        ) : (
          <input
            value={currentValue}
            onChange={(e) =>
              setEditedData({ ...editedData, [field]: e.target.value })
            }
            style={{ width: "100%", fontSize: "13px" }}
          />
        )}
      </Box>
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={koLocale}>
      <Box display="flex" height="100vh">
        <Box width="250px" p={2} borderRight="1px solid #ddd" overflow="auto">
          <Typography fontWeight="bold" fontSize={14} mb={2}>
            의뢰서 목록
          </Typography>
          {request.length === 0 ? (
            <CircularProgress size={24} />
          ) : (
            <Box display="flex" flexDirection="column" gap={1}>
              {filteredInquiries.map((item) => (
                <Paper
                  key={item.id}
                  sx={{
                    p: 1,
                    cursor: "pointer",
                    bgcolor: selected?.id === item.id ? "#eee" : "white",
                  }}
                  onClick={() => {
                    setSelected(item);
                    setIsEditMode(false);
                    setEditedData({});
                  }}
                >
                  <Typography fontSize={13}>{item.request_id}</Typography>
                </Paper>
              ))}
            </Box>
          )}
        </Box>

        <Box flex={1} p={3} overflow="auto">
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <DatePicker
              label="시작일"
              value={startDate}
              onChange={(newVal) => setStartDate(newVal)}
            />
            <DatePicker
              label="종료일"
              value={endDate}
              onChange={(newVal) => setEndDate(newVal)}
            />
            <Button variant="outlined" onClick={handleSearch}>
              검색
            </Button>
            <Button variant="text" onClick={showAllInquiries}>
              모든 의뢰서 보기
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
              <ToggleButton value={0}>취소완료</ToggleButton>
              <ToggleButton value={1}>접수 완료</ToggleButton>
              <ToggleButton value={2}>기사님배정완료</ToggleButton>
              <ToggleButton value={3}>서비스중</ToggleButton>
              <ToggleButton value={4}>서비스완료</ToggleButton>
              <p
                style={{ fontSize: "12px", color: "#555", marginLeft: "10px" }}
              >
                ** 상태필터링도 선택 후 검색을 눌러야 적용됩니다
              </p>
            </ToggleButtonGroup>
          </Box>

          {!selected ? (
            <Typography fontSize={14} color="gray">
              의뢰서를 선택해주세요.
            </Typography>
          ) : (
            <Box display="flex" flexDirection="column" gap={2}>
              <Box mb={2}>
                <Button
                  variant="outlined"
                  sx={{ height: "30px" }}
                  startIcon={<DeleteIcon />}
                >
                  삭제하기
                </Button>
                {isEditMode ? (
                  <>
                    <Button
                      variant="contained"
                      sx={{ marginLeft: "8px", height: "30px" }}
                      onClick={handleSave}
                    >
                      저장하기
                    </Button>
                    <Button
                      variant="text"
                      sx={{ marginLeft: "8px", height: "30px" }}
                      onClick={() => {
                        setIsEditMode(false);
                        setEditedData({});
                      }}
                    >
                      취소하기
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="contained"
                    sx={{ marginLeft: "8px", height: "30px" }}
                    onClick={() => {
                      setIsEditMode(true);
                      setEditedData(selected);
                    }}
                  >
                    수정하기
                  </Button>
                )}
              </Box>
              <Box display="flex" gap={2}>
                <Section
                  title="에어컨 종류"
                  value={renderEditable("aircon_type")}
                />
                <Section
                  title="에어컨 브랜드"
                  value={renderEditable("brand")}
                />
                <Section
                  title="서비스 종류"
                  value={renderEditable("service_type")}
                />
                <Section
                  title="status"
                  value={renderEditable("status", "select")}
                />
              </Box>
              <Divider />
              <Box display="flex" gap={2}>
                <InfoCard
                  title="의뢰서"
                  items={[
                    ["의뢰서 uid", selected.request_id],
                    ["의뢰 생성일", renderEditable("created_at", "date")],
                    ["의뢰 수락일", renderEditable("accepted_at", "date")],
                    ["의뢰 완료일", renderEditable("completed_at", "date")],
                    ["서비스진행 일정", renderEditable("service_date", "date")],
                    ["고객 요구사항", renderEditable("detailInfo")],
                    ["고객 요청시간", renderEditable("service_time")],
                    [
                      "서비스이미지",
                      (selected.service_images || []).length + "개",
                    ],
                    ["스프린트", (selected.sprint || []).join(", ")],
                    ["기사님 메모", renderEditable("memo")],
                  ]}
                />
                <InfoCard
                  title="기사"
                  image={{
                    label: "기사님 프로필",
                    src: selected.engineer_profile_image,
                  }}
                  items={[
                    ["기사님 이름", selected.engineer_name],
                    ["기사님 연락처", selected.engineer_phone],
                    ["기사님 UID", selected.engineer_uid],
                    [
                      "업체 주소",
                      selected.partner_address +
                        " " +
                        selected.partner_address_detail,
                    ],
                    ["업체 이름", selected.partner_name],
                    ["업체 UID", selected.partner_uid],
                  ]}
                />
              </Box>
              <Box display="flex" gap={2}>
                <InfoCard
                  title="고객"
                  items={[
                    ["고객 주소", renderEditable("customer_address")],
                    ["상세 주소", renderEditable("customer_address_detail")],
                    ["고객 연락처", renderEditable("customer_phone")],
                    ["고객유형", renderEditable("customer_type")],
                    ["고객 UID", selected.customer_uid || "-"],
                  ]}
                />
                <InfoCard
                  title="결제"
                  items={
                    paymentInfo
                      ? [
                          ["결제 요청일", paymentInfo.created_at],
                          ["결제 수단", paymentInfo.method],
                          ["결제 금액", paymentInfo.amount],
                          ["결제 완료일", paymentInfo.paid_at],
                          [
                            "결제 상태",
                            getPaymentStatusText(paymentInfo.status),
                          ],
                          ["결제 ID", paymentInfo.payment_id],
                        ]
                      : [["결제 정보", "없음"]]
                  }
                />
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

const Section = ({ title, value }) => (
  <Box border="1px solid #ddd" p={1} width="150px">
    <Typography fontSize={13} fontWeight="bold">
      {title}
    </Typography>
    <Typography fontSize={13}>{value}</Typography>
  </Box>
);

const InfoCard = ({ title, items, image }) => (
  <Box flex={1}>
    <Typography fontSize={14} fontWeight="bold" mb={1}>
      {title}
    </Typography>
    <Paper variant="outlined" sx={{ p: 1 }}>
      {image?.src && (
        <Box display="flex" flexDirection="column" alignItems="center" mb={1}>
          <Typography fontSize={12} color="textSecondary">
            {image.label}
          </Typography>
          <Box
            component="img"
            src={image.src}
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
      {items.map(([label, value], idx) => (
        <Box
          key={idx}
          display="flex"
          justifyContent="space-between"
          borderBottom={idx !== items.length - 1 ? "1px solid #eee" : "none"}
          py={0.5}
        >
          <Typography fontSize={12} color="textSecondary" width="45%">
            · {label}
          </Typography>
          <Typography fontSize={12} textAlign="right" width="55%">
            {value || "-"}
          </Typography>
        </Box>
      ))}
    </Paper>
  </Box>
);

export default InquiryDetails;
