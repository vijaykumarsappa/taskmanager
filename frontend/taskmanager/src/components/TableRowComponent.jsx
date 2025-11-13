import React from "react";
import {
  TableRow,
  TableCell,
  Typography,
  Chip,
  Box,
  IconButton,
} from "@mui/material";
import { Edit, Trash2 } from "lucide-react";

const TableRowComponent = ({ task, user, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <TableRow
      sx={{
        "&:hover": {
          backgroundColor: "action.hover",
        },
      }}
    >
      <TableCell>
        <Typography variant="subtitle1" fontWeight="600">
          {task.title}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            maxWidth: 300,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {task.description}
        </Typography>
      </TableCell>
      <TableCell>
        <Chip
          label={task.status === "completed" ? "Completed" : "Pending"}
          size="small"
          variant="outlined"
          sx={{
            backgroundColor:
              task.status === "completed" ? "#F2FFF7" : "#FFEBEE",
            color: task.status === "completed" ? "#00B448" : "#D32F2F",
            border:
              task.status === "completed"
                ? "1px solid #00B448"
                : "1px solid #D32F2F",
            fontWeight: 600,
            fontSize: "0.75rem",
            "& .MuiChip-icon": {
              color: task.status === "completed" ? "#00B448" : "#D32F2F",
            },
            "&:hover": {
              backgroundColor:
                task.status === "completed" ? "#E8F5E8" : "#FFE0E0",
            },
          }}
        />
      </TableCell>
      <TableCell>
        <Typography variant="body2" color="text.secondary">
          {formatDate(task.createdAt)}
        </Typography>
      </TableCell>
      <TableCell>
        <Box display="flex" gap={1}>
          <IconButton
            size="small"
            onClick={() => onEdit(task)}
            sx={{
              color: "primary.main",
              "&:hover": {
                backgroundColor: "primary.light",
                color: "white",
              },
            }}
          >
            <Edit size={16} />
          </IconButton>
          {user?.role === "admin" && (
            <IconButton
              size="small"
              onClick={() => onDelete(task._id)}
              sx={{
                color: "error.main",
                "&:hover": {
                  backgroundColor: "error.light",
                  color: "white",
                },
              }}
            >
              <Trash2 size={16} />
            </IconButton>
          )}
        </Box>
      </TableCell>
    </TableRow>
  );
};

export default TableRowComponent;
