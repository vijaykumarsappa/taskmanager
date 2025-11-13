import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks } from "../store/slices/taskSlice";
import {
  TrendingUp,
  CheckCircle,
  Clock,
  List,
  Users,
  Target,
} from "lucide-react";

const Analytics = () => {
  const dispatch = useDispatch();
  const { tasks, isLoading, error } = useSelector((state) => state.tasks);
  const { user } = useSelector((state) => state.auth);

  const [analyticsData, setAnalyticsData] = useState(null);

  useEffect(() => {
    dispatch(fetchTasks(1));
  }, [dispatch]);

  useEffect(() => {
    if (tasks.length > 0) {
      calculateAnalytics();
    }
  }, [tasks]);

  const calculateAnalytics = () => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(
      (task) => task.status === "completed"
    ).length;
    const pendingTasks = tasks.filter(
      (task) => task.status === "pending"
    ).length;
    const completionRate =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const last7Days = [...Array(7)]
      .map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split("T")[0];
      })
      .reverse();

    const weeklyData = last7Days.map((date) => {
      const dayTasks = tasks.filter(
        (task) => task.createdAt.split("T")[0] === date
      );
      const dayCompleted = dayTasks.filter(
        (task) => task.status === "completed"
      ).length;

      return {
        date: new Date(date).toLocaleDateString("en-US", { weekday: "short" }),
        completed: dayCompleted,
        created: dayTasks.length,
      };
    });

    const statusData = [
      { name: "Completed", value: completedTasks },
      { name: "Pending", value: pendingTasks },
    ];

    const last30Days = [...Array(30)]
      .map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split("T")[0];
      })
      .reverse();

    const monthlyTrend = last30Days.map((date) => {
      const dayTasks = tasks.filter(
        (task) => task.createdAt.split("T")[0] === date
      );

      return {
        date: new Date(date).getDate(),
        tasks: dayTasks.length,
      };
    });

    const avgCompletionTime =
      completedTasks > 0
        ? Math.round(tasks.filter((t) => t.status === "completed").length * 2.5)
        : 0;

    setAnalyticsData({
      totalTasks,
      completedTasks,
      pendingTasks,
      completionRate,
      weeklyData,
      statusData,
      monthlyTrend,
      avgCompletionTime,
    });
  };

  const COLORS = ["#00B448", "#D32F2F"];
  const CHART_COLORS = {
    completed: "#00B448",
    pending: "#D32F2F",
    created: "#42B587",
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          p: 3,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 400,
        }}
      >
        <CircularProgress size={40} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!analyticsData) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Analytics Dashboard
        </Typography>
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary">
            No data available. Create some tasks to see analytics.
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
        Analytics Dashboard
      </Typography>
      <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
        Real-time insights and performance metrics
        {user?.role === "admin" && " (Administrator View)"}
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              borderRadius: 3,
              height: "100%",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: "0 12px 28px rgba(0,0,0,0.15)",
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box>
                  <Typography variant="h3" fontWeight="bold" color="white">
                    {analyticsData.totalTasks}
                  </Typography>
                  <Typography variant="h6" color="rgba(255,255,255,0.8)">
                    Total Tasks
                  </Typography>
                  <Typography variant="caption" color="rgba(255,255,255,0.7)">
                    All time
                  </Typography>
                </Box>
                <Box
                  sx={{
                    backgroundColor: "rgba(255,255,255,0.2)",
                    borderRadius: "60%",
                    p: 2,
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <List size={20} color="white" />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              borderRadius: 3,
              height: "100%",
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              color: "white",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: "0 12px 28px rgba(0,0,0,0.15)",
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box>
                  <Typography variant="h3" fontWeight="bold" color="white">
                    {analyticsData.pendingTasks}
                  </Typography>
                  <Typography variant="h6" color="rgba(255,255,255,0.8)">
                    Pending
                  </Typography>
                  <Typography variant="caption" color="rgba(255,255,255,0.7)">
                    Needs attention
                  </Typography>
                </Box>
                <Box
                  sx={{
                    backgroundColor: "rgba(255,255,255,0.2)",
                    borderRadius: "50%",
                    p: 2,
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <Clock size={28} color="white" />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              borderRadius: 3,
              height: "100%",
              background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
              color: "white",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: "0 12px 28px rgba(0,0,0,0.15)",
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box>
                  <Typography variant="h3" fontWeight="bold" color="white">
                    {analyticsData.completedTasks}
                  </Typography>
                  <Typography variant="h6" color="rgba(255,255,255,0.8)">
                    Completed
                  </Typography>
                  <Typography variant="caption" color="rgba(255,255,255,0.7)">
                    Well done!
                  </Typography>
                </Box>
                <Box
                  sx={{
                    backgroundColor: "rgba(255,255,255,0.2)",
                    borderRadius: "50%",
                    p: 2,
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <CheckCircle size={28} color="white" />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              borderRadius: 3,
              height: "100%",
              background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
              color: "white",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: "0 12px 28px rgba(0,0,0,0.15)",
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box>
                  <Typography variant="h3" fontWeight="bold" color="white">
                    {analyticsData.completionRate}%
                  </Typography>
                  <Typography variant="h6" color="rgba(255,255,255,0.8)">
                    Completion Rate
                  </Typography>
                  <Typography variant="caption" color="rgba(255,255,255,0.7)">
                    Efficiency score
                  </Typography>
                </Box>
                <Box
                  sx={{
                    backgroundColor: "rgba(255,255,255,0.2)",
                    borderRadius: "50%",
                    p: 2,
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <TrendingUp size={28} color="white" />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: "2px" }}>
            <Typography variant="h6" gutterBottom fontWeight="600">
              Weekly Performance
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Task completion and creation trends over the last 7 days
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="completed"
                  fill={CHART_COLORS.completed}
                  name="Completed Tasks"
                  radius={[2, 2, 0, 0]}
                />
                <Bar
                  dataKey="created"
                  fill={CHART_COLORS.created}
                  name="Created Tasks"
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: "2px" }}>
            <Typography variant="h6" gutterBottom fontWeight="600">
              Task Status Distribution
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Current breakdown of task status
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analyticsData.statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {analyticsData.statusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: "2px" }}>
            <Typography variant="h6" gutterBottom fontWeight="600">
              Monthly Task Creation Trend
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Daily task creation over the last 30 days
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={analyticsData.monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="tasks"
                  stroke={CHART_COLORS.created}
                  strokeWidth={2}
                  dot={{ fill: CHART_COLORS.created, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: CHART_COLORS.created }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: "2px" }}>
            <Typography variant="h6" gutterBottom fontWeight="600">
              Performance Metrics
            </Typography>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={6}>
                <Box
                  textAlign="center"
                  p={2}
                  sx={{ border: "1px solid #e0e0e0", borderRadius: "2px" }}
                >
                  <Target
                    size={32}
                    color="#42B587"
                    style={{ margin: "0 auto 8px" }}
                  />
                  <Typography variant="h4" fontWeight="bold" color="#42B587">
                    {analyticsData.completionRate}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Success Rate
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box
                  textAlign="center"
                  p={2}
                  sx={{ border: "1px solid #e0e0e0", borderRadius: "2px" }}
                >
                  <Users
                    size={32}
                    color="#2196f3"
                    style={{ margin: "0 auto 8px" }}
                  />
                  <Typography variant="h4" fontWeight="bold" color="#2196f3">
                    {analyticsData.avgCompletionTime}h
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Avg. Completion
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box
                  sx={{
                    mt: 2,
                    p: 2,
                    backgroundColor: "#f5f5f5",
                    borderRadius: "2px",
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    <strong>Insight:</strong>{" "}
                    {analyticsData.completionRate >= 70
                      ? "Excellent productivity! You're completing tasks efficiently."
                      : analyticsData.completionRate >= 50
                      ? "Good progress. Focus on completing pending tasks."
                      : "Consider prioritizing tasks to improve completion rate."}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics;
