import React from "react";
import { Box, Typography, Divider } from "@mui/material";
import MapList from "../components/Map/MapList";
import { useAppContext } from "../context/AppContext";

const MapListPage = () => {
  const { request } = useAppContext();
  return (
    <Box display="flex" flexDirection="column" height="100vh">
      <Box display="flex" flex={1}>
        <Box flex={1} p={3}>
          <Typography fontWeight="bold" mb={1}>
            [ 지도 - 현재 서비스 중인 구별 완료된 의뢰 건수 ]
          </Typography>

          <Divider sx={{ my: 3 }} />
          <Box height="600px">
            <MapList />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default MapListPage;
