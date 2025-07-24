import React from "react";
import { Paper, Typography, Box } from "@mui/material";

const DashboardCard = ({ label, value }) => {
  return (
    <Paper
      sx={{
        p: 2,
        minHeight: "120px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <Typography variant="subtitle2">{label}</Typography>
      <Typography variant="h6">{value}</Typography>
    </Paper>
  );
};

export default DashboardCard;
