import React, { useState, useEffect } from 'react';
import './Board.css';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Pagination, Table, Form } from 'react-bootstrap';
const Board = () => {
  const [questions, setQuestions] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 10;
  const navigate = useNavigate();
  // 토큰 확인 및 페이지 접근 제한
  // 서버로부터 게시글 목록 가져오기
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/board`);
        const data = await response.json();
        setQuestions(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchQuestions();
  }, []);
  const handleWriteClick = () => {
    const userToken = localStorage.getItem('token');
    if (userToken) {
      navigate('/Input', { state: { from: 'board' } });
    }
    else {
      alert("로그인 후 이용가능합니다.");
      navigate('/Login');
    }
  };
  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = questions.slice(indexOfFirstQuestion, indexOfLastQuestion);
  const totalPages = Math.ceil(questions.length / questionsPerPage);
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  return (
    <div className="qna-page">
      <hr />
      <h1 className='page-title' style={{ color: "black", marginLeft: "650px" }}>자유 게시판</h1>
      <div className="container-box">
        <Table striped bordered hover responsive className="qna-table">
          <thead>
            <tr>
              <th>제목</th>
              <th>작성자</th>
              <th>작성일</th>
            </tr>
          </thead>
          <tbody>
            {currentQuestions.map(question => (
              <tr key={question.id}>
                <td>
                  <Link to={`/board/${question.id}`}>
                    {question.title}
                  </Link>
                </td>
                <td>{question.authorUsername}</td>
                <td>{new Date(question.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Pagination className="pagination">
          <Pagination.First onClick={() => handlePageChange(1)} />
          <Pagination.Prev
            onClick={() => handlePageChange(currentPage > 1 ? currentPage - 1 : 1)}
          />
          {[...Array(totalPages).keys()].map((number) => (
            <Pagination.Item
              key={number + 1}
              active={number + 1 === currentPage}
              onClick={() => handlePageChange(number + 1)}
            >
              {number + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            onClick={() => handlePageChange(currentPage < totalPages ? currentPage + 1 : totalPages)}
          />
          <Pagination.Last onClick={() => handlePageChange(totalPages)} />
        </Pagination>
        <div className="write-button-container">
          <Button variant="light" className='btn' onClick={handleWriteClick}>
            글쓰기
          </Button>
        </div>
      </div>
    </div>
  );
};
export default Board;