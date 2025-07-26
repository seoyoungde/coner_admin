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
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import koLocale from "date-fns/locale/ko";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { useAppContext } from "../context/AppContext";

const InquiryDetails = () => {
  const { request } = useAppContext();
  const [filteredInquiries, setFilteredInquiries] = useState([]);
  const [selected, setSelected] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);

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

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={koLocale}>
      <Box display="flex" height="100vh">
        {/* 왼쪽 목록 영역 */}
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
                  onClick={() => setSelected(item)}
                >
                  <Typography fontSize={13}>{item.request_id}</Typography>
                </Paper>
              ))}
            </Box>
          )}
        </Box>

        {/* 오른쪽 상세 보기 */}
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
              <Box display="flex" gap={2}>
                <Section title="에어컨 종류" value={selected.aircon_type} />
                <Section title="에어컨 브랜드" value={selected.brand} />
                <Section title="서비스 종류" value={selected.service_type} />
                <Section
                  title="status"
                  value={getStatusText(selected.status)}
                />
              </Box>
              <Divider />
              <Box display="flex" gap={2}>
                <InfoCard
                  title="의뢰서"
                  items={[
                    ["의뢰서 uid", selected.request_id],
                    ["의뢰 생성일", selected.created_at],
                    ["의뢰 수락일", selected.accepted_at],
                    ["의뢰 완료일", selected.completed_at],
                    ["서비스진행 일정", selected.service_date],
                    ["고객 요구사항", selected.detailInfo],
                    ["고객 요청시간", selected.service_time],
                    [
                      "서비스이미지",
                      (selected.service_images || []).length + "개",
                    ],
                    ["스프린트", (selected.sprint || []).join(", ")],
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
                    ["기사님 메모", selected.memo],
                  ]}
                />
              </Box>
              <Box display="flex" gap={2}>
                <InfoCard
                  title="고객"
                  items={[
                    [
                      "고객 주소 / 상세 주소",
                      selected.customer_address +
                        " " +
                        selected.customer_address_detail,
                    ],
                    ["고객 연락처", selected.customer_phone],
                    ["고객유형", selected.customer_type],
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
