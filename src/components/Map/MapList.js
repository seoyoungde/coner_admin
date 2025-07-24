import React, { useMemo } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from "@mui/material";
import { useAppContext } from "../../context/AppContext";
import { getDistrictFromAddress } from "../../utils/getDistrict";
import MapWithMarkers from "./MapWithMarkers";

const targetDistricts = [
  "강북구",
  "광진구",
  "노원구",
  "동대문구",
  "성북구",
  "도봉구",
  "은평구",
  "중랑구",
  "종로구",
];

const MapList = () => {
  const { request } = useAppContext();

  const districtStats = useMemo(() => {
    const stats = {};
    targetDistricts.forEach((d) => {
      stats[d] = 0;
    });

    request
      .filter((r) => r.status === 4)
      .forEach((r) => {
        const district = getDistrictFromAddress(r.customer_address || "");
        if (targetDistricts.includes(district)) {
          stats[district] += 1;
        }
      });

    const sorted = targetDistricts.map((d) => [d, stats[d] || 0]);
    return sorted;
  }, [request]);

  return (
    <Box p={3}>
      {/* 가로로 긴 표 */}
      <Paper sx={{ overflowX: "auto", mb: 3 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {districtStats.map(([district]) => (
                <TableCell key={district} align="center">
                  {district}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              {districtStats.map(([_, count], idx) => (
                <TableCell key={idx} align="center">
                  {count}
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </Paper>

      <Box
        sx={{
          border: "1px solid #ccc",
          height: 500,
          width: "100%",
        }}
        id="map"
      >
        <MapWithMarkers requests={request} />
      </Box>
    </Box>
  );
};

export default MapList;
