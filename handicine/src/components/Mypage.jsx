import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  // 리다이렉트를 위해 사용
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import './SignUp.css';  // 스타일을 위한 CSS 파일
import FormControlLabel from '@mui/material/FormControlLabel';
import { Radio } from '@mui/material';
// Material UI 테마
const theme = createTheme({
  typography: {
    allVariants: {
      color: '#000',
      fontWeight: 'normal',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        contained: {
          backgroundColor: '#000',
          color: '#fff',
          '&:hover': {
            backgroundColor: '#333',
          },
        },
        outlined: {
          color: '#000',
          borderColor: '#000',
          '&:hover': {
            borderColor: '#333',
          },
        },
      },
    },
  },
});
// Base64 디코딩 함수
function parseJwt(token) {
  try {
    const trimmedToken = token.trim();
    const base64Url = token.split('.')[1]; // JWT의 payload 부분 추출
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload); // payload JSON으로 반환
  } catch (error) {
    console.error("JWT 해석 중 오류 발생:", error);
    return null;
  }
}
export default function Mypage({setIsLoggedIn}) {
  const [selectedRole, setSelectedRole] = useState('MEMBER');
  const [username, setUsername] = useState('');  // ID가 아닌 username으로 변경
  const [email, setEmail] = useState('');
  const navigate = useNavigate();  // 리다이렉트를 위해 선언
  // 사용자 정보를 가져오는 useEffect
  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('토큰:', token);
    if (!token) {
      console.error('토큰이 없습니다. 로그인이 필요합니다.');
      return;
    }
    const decodedToken = parseJwt(token); // 토큰에서 정보 추출
    const username = decodedToken?.sub; // 토큰에서 username 추출
    if (!username) {
      console.error('username을 찾을 수 없습니다.');
      return;
    }
    // 토큰을 사용해 사용자 프로필 정보 가져오기
    fetch(`${process.env.REACT_APP_API_URL}/api/users/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => response.json())
    .then(data => {
      // 가져온 사용자 데이터를 폼 필드에 설정
      setUsername(username);  // username 설정
      setEmail(data.email);   // email 설정
    })
    .catch(error => console.error('사용자 데이터를 가져오는 중 오류 발생:', error));
  }, []);  // []로 useEffect를 한 번만 실행
  const handleSubmit = (event) => {
    event.preventDefault();
    const token = localStorage.getItem('token');
    // 토큰에서 user_id 추출
    const decodedToken = parseJwt(token);
    const userId = decodedToken?.user_id;
    if (!userId) {
      console.error('user_id를 찾을 수 없습니다.');
      return;
    }
    const data = {
      username: username,  // 사용자가 변경한 username
      email: email,        // 사용자가 변경한 email
      password: event.target.password.value,  // 패스워드 값도 추가
      role_name: selectedRole  // 선택된 역할 값 추가
    };
    console.log('보낼 데이터:', data);  // 전송할 데이터 확인
    fetch(`${process.env.REACT_APP_API_URL}/api/users/profile`, {  // user_id 경로 없이 토큰으로 처리
      method: 'PATCH',  // PATCH 메서드 사용
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => {
      if (response.ok) {
        alert('사용자 정보가 성공적으로 업데이트되었습니다.');
      } else {
        alert('사용자 정보 업데이트에 실패했습니다.');
      }
    })
    .catch(error => console.error('사용자 정보를 업데이트하는 중 오류 발생:', error));
  };
  const handleDeleteAccount = () => {
    const token = localStorage.getItem('token');
    const decodedToken = parseJwt(token);
    const userId = decodedToken?.user_id;
    if (!userId) {
      console.error('user_id를 찾을 수 없습니다.');
      return;
    }
    // Confirm with the user before proceeding with deletion
    if (window.confirm('정말로 계정을 삭제하시겠습니까? 이 작업은 취소할 수 없습니다.')) {
      fetch(`${process.env.REACT_APP_API_URL}/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      .then(response => {
        if (response.ok) {
          alert('계정이 성공적으로 삭제되었습니다.');
          localStorage.removeItem('token');
          setIsLoggedIn(false);
          navigate('/');
        } else {
          alert('계정 삭제에 실패했습니다.');
        }
      })
      .catch(error => console.error('계정 삭제 중 오류 발생:', error));
    }
  };
  const handleRoleChange = (event) => {
    // 역할 변경 시 호출되는 함수
    setSelectedRole(event.target.value);
  };
  return (
    <div className="main-content">
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs" className="login-container">
          <CssBaseline />
          <Box
            component="form" onSubmit={handleSubmit}
            sx={{
              marginTop: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <Typography
                component="h1"
                variant="h4"
                className="brand-title"
                sx={{
                  mb: 3,
                  mt: -3,
                  textAlign: 'left',
                  color: '#B3D9E2',
                  fontSize: '2rem',
                  flexGrow: 1,
                }}
              >
                HANDICINE
              </Typography>
              <Button
                variant="outlined"
                onClick={handleDeleteAccount}
                sx={{ ml: 2 }}
              >
                회원탈퇴
              </Button>
            </div>
            <Typography
              component="h1"
              variant="h5"
              sx={{ marginBottom: 3, textAlign: 'left' }}
            >
              회원 정보 수정
            </Typography>
            <Typography variant="body1" sx={{ alignSelf: 'flex-start', mb: 1 }}>
              ID
              <FormControlLabel
                style={{ marginLeft: "170px" }}
                control={<Radio checked={selectedRole === 'MEMBER'} onChange={handleRoleChange} value="MEMBER" />}
                label="일반인"
              />
              <FormControlLabel
                control={<Radio checked={selectedRole === 'EXPERT'} onChange={handleRoleChange} value="EXPERT" />}
                label="전문가"
              />
            </Typography>
            {/* ID 입력 필드 */}
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}  // 서버에서 받아온 username
              onChange={(e) => setUsername(e.target.value)}  // 사용자 입력 변경 처리
              sx={{ mb: 2 }}
            />
            <Typography variant="body1" sx={{ alignSelf: 'flex-start', mb: 1 }}>
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
            />
            <Typography variant="body1" sx={{ alignSelf: 'flex-start', mb: 1 }}>
              E-mail
            </Typography>
            <TextField
              margin="normal"
              required
              fullWidth
              name="Email"
              type="Email"
              id="Email"
              autoComplete="current-email"
              value={email}  // 서버에서 받아온 이메일
              onChange={(e) => setEmail(e.target.value)}  // 사용자 입력 변경 처리
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              className="update-button"
            >
              회원 정보 수정
            </Button>
          </Box>
        </Container>
      </ThemeProvider>
    </div>
  );
}