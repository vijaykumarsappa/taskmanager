import React from "react";
import { Typography, Box, Paper } from "@mui/material";
import { Settings as SettingsIcon } from "lucide-react";

const Settings = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
        Settings
      </Typography>
      <Paper sx={{ p: 4, textAlign: "center" }}>
        <SettingsIcon
          size={64}
          color="#ccc"
          style={{ margin: "0 auto 16px" }}
        />
        <Typography variant="h6" color="text.secondary">
          Settings page coming soon...
        </Typography>
      </Paper>
    </Box>
  );
};

export default Settings;
