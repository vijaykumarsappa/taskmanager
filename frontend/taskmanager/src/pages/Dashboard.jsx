import React, { useEffect, useState } from "react";
import {
  Typography,
  Button,
  Box,
  Pagination,
  CircularProgress,
  Alert,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  TextField,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import { Plus, Search, Edit, Trash2, CheckCircle, Clock } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks, deleteTask } from "../store/slices/taskSlice";
import TaskForm from "../components/TaskForm";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { tasks, isLoading, error, currentPage, totalPages, totalTasks } =
    useSelector((state) => state.tasks);
  const { user } = useSelector((state) => state.auth);

  const [openForm, setOpenForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
  });

  useEffect(() => {
    dispatch(fetchTasks(1));
  }, [dispatch]);

  const handlePageChange = (event, value) => {
    console.log("Changing to page:", value);
    dispatch(fetchTasks(value));
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setOpenForm(true);
  };

  const handleDelete = (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      dispatch(deleteTask(taskId));
    }
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setEditingTask(null);
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      task.description.toLowerCase().includes(filters.search.toLowerCase());
    const matchesStatus =
      filters.status === "all" || task.status === filters.status;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getShowingRange = () => {
    const start = (currentPage - 1) * 10 + 1;
    const end = Math.min(currentPage * 10, totalTasks);
    return { start, end };
  };

  const { start, end } = getShowingRange();

  return (
    <Box sx={{ width: "100%", minHeight: "100%", p: 3 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Box>
            <Typography
              variant="h4"
              component="h1"
              fontWeight="bold"
              gutterBottom
            >
              Task Management
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Manage and organize your tasks efficiently
              {user?.role === "admin" && " (Administrator)"}
            </Typography>
          </Box>
          <Button
            variant="contained"
            size="large"
            startIcon={<Plus size={20} />}
            onClick={() => setOpenForm(true)}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1.5,
              fontSize: "1rem",
              fontWeight: 600,
            }}
          >
            Add New Task
          </Button>
        </Box>
      </Box>

      {/* Filters Section */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }}>
        <Box display="flex" flexWrap="wrap" gap={2} alignItems="center">
          <TextField
            placeholder="Search tasks..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={20} color="#64748b" />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 450 }}
          />

          <TextField
            select
            label="Status"
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            sx={{ minWidth: 350 }}
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </TextField>
        </Box>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {/* Tasks Table */}
      <Paper sx={{ borderRadius: 3, overflow: "hidden" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#42B587" }}>
                <TableCell
                  sx={{ fontWeight: "bold", fontSize: "1rem", color: "#ffff" }}
                >
                  Title
                </TableCell>
                <TableCell
                  sx={{ fontWeight: "bold", fontSize: "1rem", color: "#ffff" }}
                >
                  Description
                </TableCell>
                <TableCell
                  sx={{ fontWeight: "bold", fontSize: "1rem", color: "#ffff" }}
                >
                  Status
                </TableCell>
                <TableCell
                  sx={{ fontWeight: "bold", fontSize: "1rem", color: "#ffff" }}
                >
                  Created Date
                </TableCell>
                <TableCell
                  sx={{ fontWeight: "bold", fontSize: "1rem", color: "#ffff" }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <CircularProgress size={40} />
                  </TableCell>
                </TableRow>
              ) : filteredTasks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <Box textAlign="center">
                      <Typography
                        variant="h6"
                        color="text.secondary"
                        gutterBottom
                      >
                        No tasks found
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 3 }}
                      >
                        {filters.search || filters.status !== "all"
                          ? "Try adjusting your filters"
                          : "Get started by creating your first task!"}
                      </Typography>
                      <Button
                        variant="contained"
                        startIcon={<Plus size={20} />}
                        onClick={() => setOpenForm(true)}
                        size="large"
                      >
                        Create Your First Task
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                filteredTasks.map((task) => (
                  <TableRow
                    key={task._id}
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
                        label={
                          task.status === "completed" ? "Completed" : "Pending"
                        }
                        size="small"
                        variant="outlined"
                        sx={{
                          backgroundColor:
                            task.status === "completed" ? "#F2FFF7" : "#FFEBEE",
                          color:
                            task.status === "completed" ? "#00B448" : "#D32F2F",
                          border:
                            task.status === "completed"
                              ? "1px solid #00B448"
                              : "1px solid #D32F2F",
                          fontWeight: 600,

                          fontSize: "0.75rem",
                          "& .MuiChip-icon": {
                            color:
                              task.status === "completed"
                                ? "#00B448"
                                : "#D32F2F",
                          },
                          "&:hover": {
                            backgroundColor:
                              task.status === "completed"
                                ? "#E8F5E8"
                                : "#FFE0E0",
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
                          onClick={() => handleEdit(task)}
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
                            onClick={() => handleDelete(task._id)}
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
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Enhanced Pagination */}
        {totalPages > 0 && (
          <Box
            sx={{
              p: 3,
              borderTop: 1,
              borderColor: "divider",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            {/* Showing range */}
            <Typography variant="body2" color="text.secondary">
              Showing {start} to {end} of {totalTasks} tasks
            </Typography>

            {/* Pagination Controls */}
            <Box display="flex" alignItems="center" gap={2}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
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

            {/* Page info */}
            <Typography variant="body2" color="text.secondary">
              Page {currentPage} of {totalPages}
            </Typography>
          </Box>
        )}
      </Paper>

      <TaskForm open={openForm} onClose={handleCloseForm} task={editingTask} />
    </Box>
  );
};

export default Dashboard;
