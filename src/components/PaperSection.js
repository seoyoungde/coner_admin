// src/components/PaperSection.jsx
import React from "react";
import { Box, Typography, Paper } from "@mui/material";

const PaperSection = ({ title, items }) => (
  <Box flex="1" minWidth="220px">
    <Typography fontSize={14} fontWeight="bold" mb={1}>
      {title}
    </Typography>
    <Paper variant="outlined" sx={{ p: 1 }}>
      {items.map(({ label, value }, idx) => (
        <Box
          key={idx}
          display="flex"
          justifyContent="space-between"
          borderBottom={idx !== items.length - 1 ? "1px solid #eee" : "none"}
          py={0.5}
        >
          <Typography fontSize={12} width="45%" color="textSecondary">
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

export default PaperSection;
