import React from "react";
import { Typography, Button, Box } from "@mui/material";
import { Plus } from "lucide-react";

const DashboardHeader = ({ user, onAddTask, isMobile }) => {
  return (
    <Box sx={{ mb: { xs: 2, md: 4 } }}>
      <Box
        display="flex"
        flexDirection={isMobile ? "column" : "row"}
        justifyContent="space-between"
        alignItems={isMobile ? "flex-start" : "center"}
        gap={isMobile ? 2 : 0}
        mb={3}
      >
        <Box>
          <Typography
            variant={isMobile ? "h5" : "h4"}
            component="h1"
            fontWeight="bold"
            gutterBottom
          >
            Task Management
          </Typography>
          <Typography
            variant={isMobile ? "body1" : "h6"}
            color="text.secondary"
            sx={{ fontSize: { xs: "0.9rem", md: "1rem" } }}
          >
            Manage and organize your tasks efficiently
            {user?.role === "admin" && " (Administrator)"}
          </Typography>
        </Box>
        <Button
          variant="contained"
          size={isMobile ? "medium" : "large"}
          startIcon={<Plus size={isMobile ? 18 : 20} />}
          onClick={onAddTask}
          sx={{
            borderRadius: 2,
            px: { xs: 2, md: 3 },
            py: { xs: 1, md: 1.5 },
            fontSize: { xs: "0.875rem", md: "1rem" },
            fontWeight: 600,
            backgroundColor: "#3B7067",
            width: isMobile ? "100%" : "auto",
            textTransform: "capitalize",
          }}
        >
          Add New Task
        </Button>
      </Box>
    </Box>
  );
};

export default DashboardHeader;
