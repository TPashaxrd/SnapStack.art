import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Avatar,
  TextField,
  Button,
  Chip,
  CircularProgress,
  Stack,
  createTheme,
  ThemeProvider,
  Divider,
  Skeleton,
} from "@mui/material";
import { Grid } from "@mui/material";
import { FaHeart, FaComment, FaEye } from "react-icons/fa";
import axios from "axios";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

interface User {
  _id: string;
  username: string;
  avatarUrl: string;
  bio: string;
}

interface Art {
  _id: string;
  title: string;
  imageUrl: string;
  tags?: string[];
  likes?: number;
  comments?: any[];
  view?: number;
}

interface SearchResult {
  users: User[];
  arts: Art[];
}

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#9c27b0" },
    secondary: { main: "#f50057" },
    background: { default: "#121212" },
    text: { primary: "#fff", secondary: "#aaa" }
  },
  typography: { fontFamily: "'Roboto', sans-serif" }
});

const SearchComponent: React.FC = () => {
  const [query, setQuery] = useState("");
  const [searchResult, setSearchResult] = useState<SearchResult>({ users: [], arts: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [skipUsers, setSkipUsers] = useState(0);
  const [skipArts, setSkipArts] = useState(0);
  const limit = 6;
  const [hasMoreUsers, setHasMoreUsers] = useState(true);
  const [hasMoreArts, setHasMoreArts] = useState(true);
  const timeoutRef = useRef<number | null>(null);

  const fetchSearch = async (reset = false) => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get<SearchResult>(
        `http://localhost:5000/api/search?q=${encodeURIComponent(
          query
        )}&skipUsers=${reset ? 0 : skipUsers}&skipArts=${reset ? 0 : skipArts}&limit=${limit}`
      );

      setSearchResult(prev => ({
        users: reset ? res.data.users : [...prev.users, ...res.data.users],
        arts: reset ? res.data.arts : [...prev.arts, ...res.data.arts]
      }));

      setSkipUsers(prev => (reset ? res.data.users.length : prev + res.data.users.length));
      setSkipArts(prev => (reset ? res.data.arts.length : prev + res.data.arts.length));

      if (res.data.users.length < limit) setHasMoreUsers(false);
      if (res.data.arts.length < limit) setHasMoreArts(false);
    } catch (err) {
      console.error(err);
      setError("Search failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      fetchSearch(true);
    }, 500);
  
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [query]);
  

  const handleScroll = useCallback(() => {
    if (loading) return;
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
      if (hasMoreUsers || hasMoreArts) fetchSearch();
    }
  }, [loading, hasMoreUsers, hasMoreArts, query]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <>
      <div className="absolute -top-20 -left-20 w-60 h-60 bg-[#6B46C1] rounded-full opacity-20 rotate-12 animate-pulse-slow blur-2xl"></div>
      <div className="absolute -bottom-28 -right-24 w-80 h-80 bg-[#7C3AED] rounded-full opacity-15 rotate-45 animate-pulse-slow blur-2xl"></div>
      <Header />
      <ThemeProvider theme={theme}>
        <Box p={{ xs: 2, sm: 4 }} minHeight="100vh" bgcolor="#0F0F0F">
          <Typography variant="h3" textAlign="center" gutterBottom sx={{ color: "#6B46C1", fontWeight: "bold", fontFamily: "Inter", letterSpacing: "-0.025em" }}>
            🔍 Search Users & Arts
          </Typography>
  
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="center"
            mb={4}
            alignItems="center"
          >
            <TextField
              variant="outlined"
              placeholder="Search for users or arts..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              sx={{
                flex: 1,
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#2D2D2D",
                  borderRadius: "8px",
                  border: "1px solid rgba(75, 85, 99, 0.5)", // border-gray-800/50
                  color: "#E5E7EB", // text-gray-100
                  "&:hover": {
                    borderColor: "#6B46C1",
                  },
                  "&.Mui-focused": {
                    borderColor: "#6B46C1",
                    boxShadow: "0 0 0 2px rgba(107, 70, 193, 0.5)", // focus:ring-[#6B46C1]
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                },
                "& .MuiInputBase-input": {
                  fontFamily: "Inter",
                  color: "#E5E7EB", // text-gray-100
                  "&::placeholder": {
                    color: "#9CA3AF", // text-gray-400
                    opacity: 1,
                  },
                },
              }}
            />
            <Button
              variant="contained"
              onClick={() => fetchSearch(true)}
              sx={{
                backgroundColor: "#6B46C1",
                color: "#FFFFFF",
                fontFamily: "Inter",
                fontWeight: "semibold",
                borderRadius: "8px",
                padding: "8px 16px",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#7C3AED",
                  boxShadow: "0 4px 14px rgba(107, 70, 193, 0.5)", // hover:shadow-[#6B46C1]/50
                },
              }}
            >
              Search
            </Button>
          </Stack>
  
          {loading && (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress sx={{ color: "#6B46C1" }} />
            </Box>
          )}
          {error && (
            <Typography textAlign="center" mb={4} sx={{ color: "#F87171", fontFamily: "Inter" }}>
              {error}
            </Typography>
          )}
  
          {/* Users */}
          <Box mb={6}>
            <Typography variant="h4" gutterBottom sx={{ color: "#6B46C1", fontWeight: "bold", fontFamily: "Inter", letterSpacing: "-0.025em" }}>
              Users
            </Typography>
            <Grid container spacing={3}>
              {searchResult.users.length > 0 ? (
                searchResult.users.map((user) => (
                  <Grid item xs={12} sm={6} md={4} key={user._id}>
                    <Card
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        p: 2,
                        bgcolor: "#1A1A1A",
                        borderRadius: "12px",
                        border: "1px solid rgba(75, 85, 99, 0.5)", // border-gray-800/50
                        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)", // shadow-xl
                        transition: "all 0.3s",
                        "&:hover": {
                          transform: "scale(1.03)",
                          boxShadow: "0 8px 40px rgba(107, 70, 193, 0.5)", // hover:shadow-[#6B46C1]/50
                        },
                      }}
                    >
                      <Avatar
                        src={`http://localhost:5000${user.avatarUrl}`}
                        sx={{ width: 56, height: 56, border: "2px solid #6B46C1" }}
                      />
                      <Box ml={2}>
                        <Typography variant="h6" sx={{ color: "#E5E7EB", fontFamily: "Inter", fontWeight: "semibold" }}>
                          {user.username}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#9CA3AF", fontFamily: "Inter" }}>
                          {user.bio}
                        </Typography>
                      </Box>
                    </Card>
                  </Grid>
                ))
              ) : loading ? (
                [1, 2, 3].map((i) => (
                  <Grid item xs={12} sm={6} md={4} key={i}>
                    <Skeleton variant="rectangular" height={80} sx={{ borderRadius: "12px", bgcolor: "#2D2D2D" }} />
                  </Grid>
                ))
              ) : (
                <Typography sx={{ color: "#9CA3AF", fontFamily: "Inter" }}>No users found.</Typography>
              )}
            </Grid>
          </Box>
  
          <Divider sx={{ my: 4, borderColor: "rgba(75, 85, 99, 0.5)" }} />
  
          <Box>
            <Typography variant="h4" gutterBottom sx={{ color: "#6B46C1", fontWeight: "bold", fontFamily: "Inter", letterSpacing: "-0.025em" }}>
              Arts
            </Typography>
            <Grid container spacing={3}>
              {searchResult.arts.length > 0 ? (
                searchResult.arts.map((art) => (
                  <Grid item xs={12} sm={6} md={4} key={art._id}>
                    <Card
                      sx={{
                        bgcolor: "#1A1A1A",
                        borderRadius: "12px",
                        border: "1px solid rgba(75, 85, 99, 0.5)", // border-gray-800/50
                        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)", // shadow-xl
                        transition: "all 0.3s",
                        "&:hover": {
                          transform: "scale(1.03)",
                          boxShadow: "0 8px 40px rgba(107, 70, 193, 0.5)", // hover:shadow-[#6B46C1]/50
                        },
                      }}
                    >
                      <Box sx={{ position: "relative", pt: "100%", overflow: "hidden" }}>
                        <CardMedia
                          component="img"
                          image={`http://localhost:5000${art.imageUrl}`}
                          alt={art.title}
                          sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            transition: "transform 0.5s",
                            "&:hover": { transform: "scale(1.1)" },
                          }}
                        />
                      </Box>
                      <CardContent>
                        <Typography variant="h6" sx={{ color: "#6B46C1", fontFamily: "Inter", fontWeight: "semibold", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {art.title}
                        </Typography>
                        {art.tags && art.tags.length > 0 && (
                          <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
                            {art.tags.map((tag, idx) => (
                              <Chip
                                key={idx}
                                label={`#${tag}`}
                                sx={{
                                  bgcolor: "#2D2D2D",
                                  color: "#E5E7EB",
                                  fontFamily: "Inter",
                                  "&:hover": { bgcolor: "#6B46C1", color: "#FFFFFF" },
                                }}
                                size="small"
                              />
                            ))}
                          </Stack>
                        )}
                        <Stack direction="row" spacing={2} mt={2} sx={{ color: "#9CA3AF" }}>
                          <Box display="flex" alignItems="center" gap={1}>
                            <FaHeart sx={{ color: "#F87171" }} /> <Typography sx={{ fontFamily: "Inter" }}>{art.likes || 0}</Typography>
                          </Box>
                          <Box display="flex" alignItems="center" gap={1}>
                            <FaComment sx={{ color: "#6B46C1" }} /> <Typography sx={{ fontFamily: "Inter" }}>{art.comments?.length || 0}</Typography>
                          </Box>
                          <Box display="flex" alignItems="center" gap={1}>
                            <FaEye sx={{ color: "#10B981" }} /> <Typography sx={{ fontFamily: "Inter" }}>{art.view || 0}</Typography>
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              ) : loading ? (
                [1, 2, 3].map((i) => (
                  <Grid item xs={12} sm={6} md={4} key={i}>
                    <Skeleton variant="rectangular" height={200} sx={{ borderRadius: "12px", bgcolor: "#2D2D2D" }} />
                  </Grid>
                ))
              ) : (
                <Typography sx={{ color: "#9CA3AF", fontFamily: "Inter" }}>No arts found.</Typography>
              )}
            </Grid>
          </Box>
        </Box>
      </ThemeProvider>
      <Footer />
    </>
  );
};

export default SearchComponent;