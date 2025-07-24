// src/pages/AdminDashboardMain.jsx
import React from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from "@mui/material";

const Section = ({ title, headers, data, subData }) => {
  return (
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
            {subData && (
              <TableRow>
                {subData.map((obj, i) => (
                  <TableCell
                    key={i}
                    align="center"
                    sx={{
                      border: "1px solid #ccc",
                      padding: "10px",
                      lineHeight: 1.6,
                    }}
                  >
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                    >
                      <Box display="flex" width="100%">
                        <Box
                          flex={1}
                          textAlign="center"
                          borderRight="1px solid #ccc"
                        >
                          일간
                        </Box>
                        <Box
                          flex={1}
                          textAlign="center"
                          borderRight="1px solid #ccc"
                        >
                          주간
                        </Box>
                        <Box flex={1} textAlign="center">
                          월간
                        </Box>
                      </Box>
                      <Box display="flex" width="100%">
                        <Box
                          flex={1}
                          textAlign="center"
                          borderRight="1px solid #ccc"
                        >
                          {obj.daily}
                        </Box>
                        <Box
                          flex={1}
                          textAlign="center"
                          borderRight="1px solid #ccc"
                        >
                          {obj.weekly}
                        </Box>
                        <Box flex={1} textAlign="center">
                          {obj.monthly}
                        </Box>
                      </Box>
                    </Box>
                  </TableCell>
                ))}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

const AdminDashboardMain = () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  return (
    <>
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
              data={[...Array(7).fill("0건")]}
            />

            <Section
              title="기사님 현황"
              headers={[
                "전체 누적 기사님 수",
                "실제 기사님 수",
                "월간 신규 기사님 수",
                "종료 기사님 수",
              ]}
              data={["0건", "0건", "0건", "0건"]}
            />

            <Section
              title="전체 제휴 업체 현황"
              headers={[
                "전체 누적 제휴 업체 건",
                "종료 제휴 업체 건",
                "실제 협력 업체 건",
                "월간 신규 제휴 건",
              ]}
              data={["1,000곳", "5곳", "30곳", "100곳"]}
            />

            <Section
              title="전체 의뢰서 브랜드별 건 (접수건/완료)"
              headers={[
                "삼성전자 건",
                "LG전자 건",
                "센추리 진행",
                "캐리어 건",
                "귀뚜라미 건",
                "SK매직 건",
                "기타 진행",
              ]}
              data={[...Array(7).fill("50건 / 8건")]}
              subData={[
                ...Array(7).fill({
                  daily: "12건",
                  weekly: "20건",
                  monthly: "33건",
                }),
              ]}
            />

            <Section
              title="전체 의뢰서 건 (접수건/완료)"
              headers={[
                "설치 건",
                "청소 건",
                "이전 건",
                "철거 건",
                "냉매 충전 건",
                "점검 건",
                "수리 건",
              ]}
              data={[...Array(7).fill("50건 / 8건")]}
              subData={[
                ...Array(7).fill({
                  daily: "5건",
                  weekly: "10건",
                  monthly: "15건",
                }),
              ]}
            />
          </>
        )}
      </Box>
    </>
  );
};

export default AdminDashboardMain;
