import React from "react";
import {
  Paper,
  Typography,
  CircularProgress,
  Box,
  Button,
  Chip,
  IconButton,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { deleteTask } from "../store/slices/taskSlice";

const TasksGrid = ({ tasks, isLoading, filters, user, onEdit, onAddTask }) => {
  const dispatch = useDispatch();

  const handleDelete = (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      dispatch(deleteTask(taskId));
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" py={4}>
        <CircularProgress size={40} />
      </Box>
    );
  }

  if (tasks.length === 0) {
    return (
      <Paper sx={{ p: 3, borderRadius: 3, textAlign: "center" }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No tasks found
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {filters.search || filters.status !== "all"
            ? "Try adjusting your filters"
            : "Get started by creating your first task!"}
        </Typography>
        <Button
          variant="contained"
          startIcon={<Plus size={20} />}
          onClick={onAddTask}
          size="large"
          sx={{
            backgroundColor: "#3B7067",
            "&:hover": {
              backgroundColor: "#2d5a52",
            },
            textTransform: "capitalize",
          }}
        >
          Create Your First Task
        </Button>
      </Paper>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {tasks.map((task) => (
        <Card key={task._id} sx={{ borderRadius: 2 }}>
          <CardContent>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="flex-start"
              mb={2}
            >
              <Typography variant="h6" fontWeight="600" sx={{ flex: 1 }}>
                {task.title}
              </Typography>
              <Chip
                label={task.status === "completed" ? "Completed" : "Pending"}
                size="small"
                sx={{
                  backgroundColor:
                    task.status === "completed" ? "#F2FFF7" : "#FFEBEE",
                  color: task.status === "completed" ? "#00B448" : "#D32F2F",
                  fontWeight: 600,
                  fontSize: "0.7rem",
                  ml: 1,
                }}
              />
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {task.description}
            </Typography>

            <Typography variant="caption" color="text.secondary">
              Created: {formatDate(task.createdAt)}
            </Typography>
          </CardContent>

          <CardActions sx={{ justifyContent: "flex-end", pt: 0 }}>
            <IconButton
              size="small"
              onClick={() => onEdit(task)}
              sx={{
                color: "primary.main",
              }}
            >
              <Edit size={16} />
            </IconButton>
            {user?.role === "admin" && (
              <IconButton
                size="small"
                onClick={() => handleDelete(task._id)}
                sx={{
                  color: "error.main",
                }}
              >
                <Trash2 size={16} />
              </IconButton>
            )}
          </CardActions>
        </Card>
      ))}
    </Box>
  );
};

export default TasksGrid;
