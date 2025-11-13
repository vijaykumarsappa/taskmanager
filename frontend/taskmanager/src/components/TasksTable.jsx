import React from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  Box,
  Button,
} from "@mui/material";
import { Plus } from "lucide-react";
import { useDispatch } from "react-redux";
import { deleteTask } from "../store/slices/taskSlice";
import TableRowComponent from "./TableRowComponent";

const TasksTable = ({ tasks, isLoading, filters, user, onEdit, onAddTask }) => {
  const dispatch = useDispatch();

  const handleDelete = (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      dispatch(deleteTask(taskId));
    }
  };

  if (isLoading) {
    return (
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
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <CircularProgress size={40} />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    );
  }

  if (tasks.length === 0) {
    return (
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
                  </Box>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    );
  }

  return (
    <Paper sx={{ borderRadius: 3, overflow: "hidden" }}>
      <TableContainer sx={{ maxWidth: "100%", overflowX: "auto" }}>
        <Table sx={{ minWidth: 650 }}>
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
            {tasks.map((task) => (
              <TableRowComponent
                key={task._id}
                task={task}
                user={user}
                onEdit={onEdit}
                onDelete={handleDelete}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default TasksTable;
