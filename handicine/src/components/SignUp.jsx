import React, { useState } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { FormGroup } from '@mui/material';
// Material UI 테마
const theme = createTheme({
  typography: {
    allVariants: {
      color: '#000', // 모든 텍스트 색상을 검은색으로 설정
      fontWeight: 'normal', // 모든 텍스트 굵기 제거
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        contained: {
          backgroundColor: '#000', // 버튼 배경색을 검은색으로 설정
          color: '#fff', // 버튼 글씨 색상을 흰색으로 설정
          '&:hover': {
            backgroundColor: '#333', // 버튼 hover 시 어두운 색상으로 변경
          },
        },
        outlined: {
          color: '#000', // outlined 버튼 글씨 색상을 검은색으로 설정
          borderColor: '#000', // outlined 버튼 테두리 색상을 검은색으로 설정
          '&:hover': {
            borderColor: '#333', // outlined 버튼 hover 시 테두리 색상 변경
            backgroundColor: '#F5F5F5', // hover 시 배경색 변경
          },
        },
      },
    },
  },
});
export default function SignUp() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");
  const handleSubmit = async (event) => {
    event.preventDefault();
    const userData = {
      username: id,
      password: password,
      email: email,
      role_name: role
    };
    try {
      console.log(role);
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      if (response.ok) {
        const result = await response.json();
        console.log('User created:', result);
        alert("회원가입이 완료됐습니다!")
        window.location.href = "/login";
      } else {
        console.error('Error creating user');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  return (
    <div className="main-content">
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs" className="signup-container">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center', // 중앙 정렬
            }}
          >
            <Typography
              component="h1"
              variant="h4" // 'h4'로 유지
              className="brand-title"
              sx={{
                mb: 3,
                textAlign: 'center', // 중앙 정렬
                color: '#00A3E0',
                fontSize: '2.5rem', // 더 큰 크기
                fontWeight: 'bold', // 굵게
              }}
            >
              HANDICINE
            </Typography>
            <Typography
              component="h1"
              variant="h5"
              sx={{ marginBottom: 3, textAlign: 'center' }}
            >
              Sign up
            </Typography>
            <Typography
              variant="body1"
              sx={{ alignSelf: 'flex-start', mb: 1, fontWeight: 'bold' }}
            >
              ID
            </Typography>
            <TextField
              margin="normal"
              required
              fullWidth
              id="id"
              name="id"
              autoComplete="id"
              autoFocus
              value={id}
              onChange={(e) => setId(e.target.value)}
              sx={{
                mb: 2,
                '& .MuiInputBase-root': {
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                  padding: '10px',
                  '&:focus': {
                    borderColor: '#B3D9E2',
                  },
                },
              }}
            />
            <Typography
              variant="body1"
              sx={{ alignSelf: 'flex-start', mb: 1, fontWeight: 'bold' }}
            >
              Password
            </Typography>
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{
                mb: 2,
                '& .MuiInputBase-root': {
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                  padding: '10px',
                  '&:focus': {
                    borderColor: '#B3D9E2',
                  },
                },
              }}
            />
            <Typography
              variant="body1"
              sx={{ alignSelf: 'flex-start', mb: 1, fontWeight: 'bold' }}
            >
              E-mail
            </Typography>
            <TextField
              margin="normal"
              required
              fullWidth
              name="email"
              type="email"
              id="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                mb: 2,
                '& .MuiInputBase-root': {
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                  padding: '10px',
                  '&:focus': {
                    borderColor: '#B3D9E2',
                  },
                },
              }}
            />
            <FormGroup sx={{ mb: 2 }}>
              <FormControlLabel
                control={<Checkbox checked={role === 'member'} onChange={() => setRole('member')} />}
                label="일반인"
                value="member"
              />
              <FormControlLabel
                control={<Checkbox checked={role === 'expert'} onChange={() => setRole('expert')} />}
                label="전문가"
                value="expert"
              />
            </FormGroup>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              className="signup-button"
              onClick={handleSubmit}
            >
              Sign up
            </Button>
          </Box>
        </Container>
      </ThemeProvider>
    </div>
  );
}