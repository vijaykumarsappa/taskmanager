import React from "react";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Chip,
  Box,
  Tooltip,
} from "@mui/material";
import { Edit, Trash2, Calendar, CheckCircle, Clock } from "lucide-react";
import { useSelector } from "react-redux";

const TaskCard = ({ task, onEdit, onDelete }) => {
  const { user } = useSelector((state) => state.auth);

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
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.3s ease",
        border: "1px solid",
        borderColor: "divider",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
          borderColor: "primary.main",
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        {/* Header */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          mb={2}
        >
          <Typography
            variant="h6"
            component="h3"
            sx={{
              fontWeight: 600,
              flex: 1,
              mr: 1,
              lineHeight: 1.3,
            }}
          >
            {task.title}
          </Typography>
          <Chip
            icon={
              task.status === "completed" ? (
                <CheckCircle size={14} />
              ) : (
                <Clock size={14} />
              )
            }
            label={task.status === "completed" ? "Completed" : "Pending"}
            color={task.status === "completed" ? "success" : "warning"}
            size="small"
            sx={{ fontWeight: 600 }}
          />
        </Box>

        {/* Description */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 3,
            lineHeight: 1.6,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {task.description}
        </Typography>

        {/* Footer */}
        <Box sx={{ mt: "auto" }}>
          {/* Date */}
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <Calendar size={16} color="#64748b" />
            <Typography variant="caption" color="text.secondary">
              Created: {formatDate(task.createdAt)}
            </Typography>
          </Box>

          {/* Actions */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              variant="caption"
              color="text.secondary"
              fontStyle="italic"
            >
              By: {task.createdBy?.name || "You"}
            </Typography>

            <Box display="flex" gap={0.5}>
              <Tooltip title="Edit Task">
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
              </Tooltip>

              {user?.role === "admin" && (
                <Tooltip title="Delete Task">
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
                </Tooltip>
              )}
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
