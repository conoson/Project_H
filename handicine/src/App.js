import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainContent from './components/MainContent';
import Navibar from './components/Navibar';
import QnAPage from './components/QnAPage';
import QnADetail from './components/QnADetail';
import Login from './components/Login';
import AuthCallback from './components/AuthCallback';
import SignUp from './components/SignUp';
import Board from './components/Board';
import BoardDetail from './components/BoardDetail';
import Input from './components/Input';
import SearchMedicine from './components/SearchMedicine';
import QnAUpdate from './components/QnAUpdate';
import Mypage from './components/Mypage';
import Pharmacy from './components/Pharmacy';
import { useState, useEffect } from 'react';
import BoardUpdate from './components/BoardUpdate';
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  useEffect(() => {
    // 로그인 상태를 localStorage에서 확인하여 초기화
    const loggedInStatus = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedInStatus);
  }, []);
  return (
    <Router>
      <div className="App">
        <Navibar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} userId={userId} />
        <Routes>
          <Route path="/" element={<MainContent />} />
          <Route path="/qna" element={<QnAPage />} /> {/* QnA 페이지 라우트 추가 */}
          <Route path="/qna/:qnaId" element={<QnADetail />} />
          <Route path="/board/:postId" element={<BoardDetail />} />
          <Route path="/board" element={<Board />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setUserId={setUserId}/>} />
          <Route path="/oauth2/callback" element={<AuthCallback />} />
          <Route path="/Input" element={<Input />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/mypage" element={<Mypage setIsLoggedIn={setIsLoggedIn}/>} />
          <Route path="/qna/update/:qnaId" element={<QnAUpdate/>} />
          <Route path="/board/update/:postId" element={<BoardUpdate/>} />
          <Route path="/searchMedicine/:medicineName" element={<SearchMedicine />} />
          <Route path="/pharmacy" element={<Pharmacy />} />
        </Routes>
      </div>
    </Router>
  );
}
export default App;


























