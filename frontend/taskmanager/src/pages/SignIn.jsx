import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Link,
  Alert,
  CircularProgress,
  Checkbox,
  FormControlLabel,
  Divider,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signIn, clearError } from "../store/slices/authSlice";
import { LogIn, Mail, Lock, Eye, EyeOff } from "lucide-react";

const SignIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    dispatch(clearError());

    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      setFormData((prev) => ({
        ...prev,
        email: rememberedEmail,
        rememberMe: true,
      }));
    }
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      if (formData.rememberMe) {
        localStorage.setItem("rememberedEmail", formData.email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      dispatch(signIn(formData));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container
      component="main"
      maxWidth={false}
      sx={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
        px: 2,
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <Paper
        elevation={24}
        sx={{
          p: 6,
          width: "100%",
          maxWidth: 500,
          borderRadius: 2,
          background: "linear-gradient(145deg, #f5f7fa 0%, #c3cfe2 100%)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              backgroundColor: "primary.main",
              borderRadius: "50%",
              p: 2,
              mb: 2,
            }}
          >
            <LogIn size={32} color="white" />
          </Box>

          <Typography
            component="h1"
            variant="h4"
            fontWeight="bold"
            gutterBottom
          >
            Welcome Back
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            textAlign="center"
            mb={3}
          >
            Sign in to your account to continue managing your tasks
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
              error={!!formErrors.email}
              helperText={formErrors.email}
              InputProps={{
                startAdornment: (
                  <Mail size={20} color="#64748b" style={{ marginRight: 8 }} />
                ),
              }}
              sx={{ mb: 2 }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              error={!!formErrors.password}
              helperText={formErrors.password}
              InputProps={{
                startAdornment: (
                  <Lock size={20} color="#64748b" style={{ marginRight: 8 }} />
                ),
                endAdornment: (
                  <Button
                    type="button"
                    onClick={togglePasswordVisibility}
                    sx={{ minWidth: "auto", p: 0.5 }}
                  >
                    {showPassword ? (
                      <EyeOff size={20} color="#64748b" />
                    ) : (
                      <Eye size={20} color="#64748b" />
                    )}
                  </Button>
                ),
              }}
              sx={{ mb: 1 }}
            />

            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={3}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    color="primary"
                  />
                }
                label="Remember me"
              />

              <Link
                component={RouterLink}
                to="/forgot-password"
                variant="body2"
                sx={{
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                Forgot password?
              </Link>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading}
              sx={{
                py: 1.5,
                borderRadius: 2,
                fontSize: "1.1rem",
                fontWeight: 600,
              }}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Sign In"
              )}
            </Button>

            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                NEW HERE?
              </Typography>
            </Divider>

            <Box textAlign="center">
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{" "}
                <Link
                  component={RouterLink}
                  to="/signup"
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    textDecoration: "none",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  Create Account
                </Link>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default SignIn;
