import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { useAppContext } from "../context/AppContext";
import koLocale from "date-fns/locale/ko";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import * as XLSX from "xlsx";

const Section = ({ title, headers, data }) => (
  <Box mb={6}>
    <Typography
      variant="subtitle1"
      gutterBottom
      sx={{ fontWeight: "bold", mb: 1 }}
    >
      ● {title}
    </Typography>
    <TableContainer component={Paper} sx={{ border: "1px solid #ccc" }}>
      <Table size="small">
        <TableBody>
          <TableRow>
            {headers.map((head, i) => (
              <TableCell
                key={i}
                align="center"
                sx={{
                  fontWeight: "bold",
                  border: "1px solid #ccc",
                  whiteSpace: "nowrap",
                  padding: "10px",
                }}
              >
                {head}
              </TableCell>
            ))}
          </TableRow>
          <TableRow>
            {data.map((val, i) => (
              <TableCell
                key={i}
                align="center"
                sx={{ border: "1px solid #ccc", padding: "10px" }}
              >
                {val}
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  </Box>
);

const AdminDashboardMain = () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const {
    request,
    customer: members,
    setRequest,
    engineer,
    partner,
  } = useAppContext();

  const [cornerSummary, setCornerSummary] = useState([]);
  const [engineerSummary, setEngineerSummary] = useState([]);
  const [partnerSummary, setPartnerSummary] = useState([]);
  const [brandSummary, setBrandSummary] = useState([]);
  const [typeSummary, setTypeSummary] = useState([]);
  const [overallSummary, setOverallSummary] = useState([]);

  const parseDate = (str) => {
    const cleaned = str
      ?.replace(/\s/g, "")
      .replace("년", "-")
      .replace("월", "-")
      .replace("일", "");
    return new Date(cleaned);
  };

  const filterRequestsByDate = (data) => {
    const start = startDate ? new Date(startDate.setHours(0, 0, 0, 0)) : null;
    const end = endDate ? new Date(endDate.setHours(23, 59, 59, 999)) : null;
    return data.filter((item) => {
      const created = parseDate(item.created_at);
      return (!start || created >= start) && (!end || created <= end);
    });
  };

  const getGroupedSummary = (groupBy = "brand") => {
    const filtered = filterRequestsByDate(request);
    const categories =
      groupBy === "brand"
        ? [
            "삼성전자",
            "LG전자",
            "센추리",
            "캐리어",
            "귀뚜라미",
            "SK매직",
            "기타",
          ]
        : ["설치", "청소", "이전", "철거", "냉매 충전", "점검", "수리"];

    return categories.map((key) => {
      const group = filtered.filter((r) => {
        const value = groupBy === "brand" ? r.brand : r.service_type;
        return value === key || (!value && key === "기타");
      });
      const submitted = group.filter((r) => r.status === 1).length;
      const completed = group.filter((r) => r.status === 4).length;
      const canceled = group.filter((r) => r.status === 0).length;
      return `${submitted} / ${completed} / ${canceled}`;
    });
  };

  const handleSearch = () => {
    const filtered = filterRequestsByDate(request);
    setBrandSummary(getGroupedSummary("brand"));
    setTypeSummary(getGroupedSummary("service_type"));

    const submitted = filtered.length;
    const inProgress = filtered.filter((r) => r.status === 1).length;
    const completed = filtered.filter((r) => r.status === 4).length;
    const canceled = filtered.filter((r) => r.status === 0).length;

    setOverallSummary([
      `${submitted}건`,
      `${inProgress}건`,
      `${completed}건`,
      `${canceled}건`,
    ]);
  };

  const exportToExcel = () => {
    const [접수, 진행, 완료, 취소] = overallSummary.map((val) =>
      val.replace("건", "")
    );

    const wsData = [
      ["항목", "값"],
      ["신규 회원가입", cornerSummary[0] || ""],
      ["회원 탈퇴", cornerSummary[1] || ""],
      ["의뢰 취소", cornerSummary[2] || ""],
      ["의뢰서 제출", cornerSummary[3] || ""],
      ["기사 배정", cornerSummary[4] || ""],
      ["서비스 중", cornerSummary[5] || ""],
      ["서비스 완료", cornerSummary[6] || ""],
      [],
      ["전체 누적 기사님 수", engineerSummary[0] || ""],
      ["실제 기사님 수", engineerSummary[1] || ""],
      [],
      ["전체 누적 제휴 업체 수", partnerSummary[0] || ""],
      ["실제 협력 업체 수", partnerSummary[1] || ""],
      [],
      ["접수건", 접수],
      ["진행건", 진행],
      ["완료건", 완료],
      ["취소건", 취소],
    ];

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "요약");
    XLSX.writeFile(wb, "대시보드_요약_데이터.xlsx");
  };

  const showAllInquiries = () => {
    setStartDate(null);
    setEndDate(null);
    handleSearch();
  };

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "Request"));
      const data = querySnapshot.docs.map((doc) => doc.data());
      setRequest(data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!request || !members) return;
    const signupCount = members.filter((m) => m.state === 1).length;
    const withdrawCount = members.filter((m) => m.state === 0).length;
    const canceledRequests = request.filter((r) => r.status === 0).length;
    const submittedRequests = request.filter((r) => r.status === 1).length;
    const assigned = request.filter((r) => r.status === 2).length;
    const servicing = request.filter((r) => r.status === 3).length;
    const completed = request.filter((r) => r.status === 4).length;
    setCornerSummary([
      `${signupCount}명`,
      `${withdrawCount}명`,
      `${canceledRequests}건`,
      `${submittedRequests}건`,
      `${assigned}건`,
      `${servicing}건`,
      `${completed}건`,
    ]);
  }, [request, members]);

  useEffect(() => {
    if (!Array.isArray(engineer)) return;
    const total = engineer.length;
    const active = engineer.length;
    setEngineerSummary([`${total}명`, `${active}명`]);
  }, [engineer]);

  useEffect(() => {
    if (!Array.isArray(partner)) return;
    const total = partner.length;
    const active = partner.length;
    setPartnerSummary([`${total}곳`, `${active}곳`]);
  }, [partner]);

  const chartData = ["접수건", "진행건", "완료건", "취소건"].map(
    (label, idx) => ({
      name: label,
      count: parseInt(overallSummary[idx]?.replace("건", "")) || 0,
    })
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={koLocale}>
      <Box px={5} py={2}>
        {!isLoggedIn ? (
          <Typography variant="h6" color="textSecondary">
            로그인을 해주세요.
          </Typography>
        ) : (
          <>
            <Section
              title="코너 누적 현황"
              headers={[
                "신규 회원가입",
                "회원 탈퇴",
                "의뢰 취소",
                "의뢰서제출",
                "기사배정",
                "서비스중",
                "서비스완료",
              ]}
              data={cornerSummary}
            />
            <Section
              title="기사님 현황"
              headers={["전체 누적 기사님 수", "실제 기사님 수"]}
              data={engineerSummary}
            />
            <Section
              title="전체 제휴 업체 현황"
              headers={["전체 누적 제휴 업체 수", "실제 협력 중인 업체 수"]}
              data={partnerSummary}
            />

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
                모든 건수 보기
              </Button>
              <Button variant="contained" onClick={exportToExcel}>
                엑셀 다운로드
              </Button>
            </Box>

            <Section
              title="전체 의뢰서 브랜드별 건 (진행(status=1) / 완료 / 취소)"
              headers={[
                "삼성전자",
                "LG전자",
                "센추리",
                "캐리어",
                "귀뚜라미",
                "SK매직",
                "기타",
              ]}
              data={brandSummary}
            />
            <Section
              title="전체 의뢰서 건 타입별 ((진행(status=1) / 완료 / 취소)"
              headers={[
                "설치",
                "청소",
                "이전",
                "철거",
                "냉매 충전",
                "점검",
                "수리",
              ]}
              data={typeSummary}
            />
            <Section
              title="검색된 기간 내 전체 의뢰서 요약 (접수 / 진행 / 완료 / 취소)"
              headers={["접수건", "진행건", "완료건", "취소건"]}
              data={overallSummary}
            />

            <Box height={300}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                >
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#1976d2" barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </>
        )}
      </Box>
    </LocalizationProvider>
  );
};

export default AdminDashboardMain;
