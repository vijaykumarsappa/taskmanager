import React, { useEffect, useState } from "react";
import { Box, Alert, useTheme, useMediaQuery } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks } from "../store/slices/taskSlice";
import TaskForm from "../components/TaskForm";
import DashboardHeader from "../components/DashboardHeader";
import FiltersSection from "../components/FiltersSection";
import TasksTable from "../components/TasksTable";
import TasksGrid from "../components/TasksGrid";
import TablePagination from "../components/TablePagination";

const Dashboard = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.down("lg"));

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

  const handleEdit = (task) => {
    setEditingTask(task);
    setOpenForm(true);
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

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100%",
        p: { xs: 1, sm: 2, md: 3 },
        boxSizing: "border-box",
      }}
    >
      <DashboardHeader
        user={user}
        onAddTask={() => setOpenForm(true)}
        isMobile={isMobile}
      />

      <FiltersSection
        filters={filters}
        onFilterChange={handleFilterChange}
        isMobile={isMobile}
        isTablet={isTablet}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {isMobile ? (
        <TasksGrid
          tasks={filteredTasks}
          isLoading={isLoading}
          filters={filters}
          user={user}
          onEdit={handleEdit}
          onAddTask={() => setOpenForm(true)}
        />
      ) : (
        <TasksTable
          tasks={filteredTasks}
          isLoading={isLoading}
          filters={filters}
          user={user}
          onEdit={handleEdit}
          onAddTask={() => setOpenForm(true)}
        />
      )}

      {totalPages > 0 && (
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalTasks={totalTasks}
          onPageChange={(page) => dispatch(fetchTasks(page))}
          isMobile={isMobile}
        />
      )}

      <TaskForm open={openForm} onClose={handleCloseForm} task={editingTask} />
    </Box>
  );
};

export default Dashboard;
