import React from "react";
import { Paper, Box, TextField, MenuItem, InputAdornment } from "@mui/material";
import { Search } from "lucide-react";

const FiltersSection = ({ filters, onFilterChange, isMobile, isTablet }) => {
  return (
    <Paper
      sx={{
        p: { xs: 2, md: 3 },
        mb: 3,
        borderRadius: 3,
      }}
    >
      <Box
        display="flex"
        flexDirection={isMobile ? "column" : "row"}
        gap={2}
        alignItems={isMobile ? "stretch" : "center"}
      >
        <TextField
          placeholder="Search tasks..."
          value={filters.search}
          onChange={(e) => onFilterChange("search", e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={20} color="#64748b" />
              </InputAdornment>
            ),
          }}
          sx={{
            minWidth: isMobile ? "auto" : isTablet ? 300 : 450,
            width: isMobile ? "100%" : "auto",
          }}
          size={isMobile ? "small" : "medium"}
        />

        <TextField
          select
          label="Status"
          value={filters.status}
          onChange={(e) => onFilterChange("status", e.target.value)}
          sx={{
            minWidth: isMobile ? "auto" : isTablet ? 200 : 350,
            width: isMobile ? "100%" : "auto",
          }}
          size={isMobile ? "small" : "medium"}
        >
          <MenuItem value="all">All Status</MenuItem>
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
        </TextField>
      </Box>
    </Paper>
  );
};

export default FiltersSection;
