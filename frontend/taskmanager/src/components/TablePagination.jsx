import React from "react";
import { Box, Pagination, Typography } from "@mui/material";

const TablePagination = ({
  currentPage,
  totalPages,
  totalTasks,
  onPageChange,
  isMobile,
}) => {
  const getShowingRange = () => {
    const start = (currentPage - 1) * 10 + 1;
    const end = Math.min(currentPage * 10, totalTasks);
    return { start, end };
  };

  const { start, end } = getShowingRange();

  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        borderTop: 1,
        borderColor: "divider",
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        justifyContent: "space-between",
        alignItems: isMobile ? "stretch" : "center",
        gap: 2,
      }}
    >
      <Typography
        variant="body2"
        color="text.secondary"
        textAlign={isMobile ? "center" : "left"}
      >
        Showing {start} to {end} of {totalTasks} tasks
      </Typography>

      <Box display="flex" justifyContent="center">
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(event, value) => onPageChange(value)}
          color="primary"
          size={isMobile ? "small" : "large"}
          showFirstButton={!isMobile}
          showLastButton={!isMobile}
          sx={{
            "& .MuiPaginationItem-root": {
              borderRadius: 2,
              fontWeight: 600,
            },
            "& .MuiPaginationItem-page.Mui-selected": {
              backgroundColor: "#ED9B22",
              color: "white",
              "&:hover": {
                backgroundColor: "#ED9B22",
              },
            },
          }}
        />
      </Box>

      <Typography
        variant="body2"
        color="text.secondary"
        textAlign={isMobile ? "center" : "right"}
      >
        Page {currentPage} of {totalPages}
      </Typography>
    </Box>
  );
};

export default TablePagination;
