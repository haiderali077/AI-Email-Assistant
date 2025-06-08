import { useState } from "react";
import axios from "axios";
import {
  Box,
  CircularProgress,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Button,
  Paper,
  Fade,
  Zoom,
  useTheme,
} from "@mui/material";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SendIcon from '@mui/icons-material/Send';
import "./App.css";

function App() {
  const [emailContent, setEmailContent] = useState("");
  const [tone, setTone] = useState("");
  const [generatedReply, setGeneratedReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const theme = useTheme();

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/email/generate`,
        {
          emailContent,
          tone,
        }
      );
      setGeneratedReply(
        typeof response.data === "string"
          ? response.data
          : JSON.stringify(response.data)
      );
    } catch (error) {
      setError("Failed to generate email reply. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <Fade in timeout={1000}>
          <Paper
            elevation={24}
            sx={{
              p: 4,
              borderRadius: 4,
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
            }}
          >
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              sx={{
                textAlign: "center",
                fontWeight: 700,
                background: "linear-gradient(45deg, #667eea, #764ba2)",
                backgroundClip: "text",
                textFillColor: "transparent",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 4,
              }}
            >
              AI Email Reply Generator
            </Typography>

            <Box sx={{ mx: 2 }}>
              <TextField
                fullWidth
                multiline
                rows={6}
                variant="outlined"
                label="Original Email Content"
                value={emailContent || ""}
                onChange={(e) => setEmailContent(e.target.value)}
                sx={{
                  mb: 3,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    },
                  },
                }}
              />
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Tone</InputLabel>
                <Select
                  value={tone || ""}
                  label="Tone"
                  onChange={(e) => setTone(e.target.value)}
                  sx={{
                    borderRadius: 2,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    },
                  }}
                >
                  <MenuItem value="">None</MenuItem>
                  <MenuItem value="professional">Professional</MenuItem>
                  <MenuItem value="casual">Casual</MenuItem>
                  <MenuItem value="friendly">Friendly</MenuItem>
                </Select>
              </FormControl>
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={!emailContent || loading}
                fullWidth
                size="large"
                endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  background: "linear-gradient(45deg, #667eea, #764ba2)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                  },
                }}
              >
                {loading ? "Generating..." : "Generate Reply"}
              </Button>
            </Box>

            {error && (
              <Fade in timeout={500}>
                <Typography
                  color="error"
                  sx={{
                    mt: 2,
                    textAlign: "center",
                    p: 2,
                    borderRadius: 2,
                    bgcolor: "error.light",
                    color: "error.contrastText",
                  }}
                >
                  {error}
                </Typography>
              </Fade>
            )}

            {generatedReply && (
              <Zoom in timeout={500}>
                <Box sx={{ mt: 4 }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      fontWeight: 600,
                      color: "primary.main",
                    }}
                  >
                    Generated Reply:
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={6}
                    variant="outlined"
                    value={generatedReply || ""}
                    inputProps={{ readOnly: true }}
                    sx={{
                      mb: 2,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        bgcolor: "grey.50",
                      },
                    }}
                  />
                  <Button
                    variant="outlined"
                    startIcon={<ContentCopyIcon />}
                    onClick={() => navigator.clipboard.writeText(generatedReply)}
                    sx={{
                      borderRadius: 2,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                      },
                    }}
                  >
                    Copy to Clipboard
                  </Button>
                </Box>
              </Zoom>
            )}
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
}

export default App;
