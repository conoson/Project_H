import React, { useState, useEffect } from 'react';
import './QnAPage.css';
import { Link, useNavigate } from 'react-router-dom'; // useNavigate로 페이지 이동 추가
import { FormControl, InputGroup, Button, Pagination, Table, Container, Row, Col, Form } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa'; // 돋보기 아이콘
const QnAPage = () => {
  const [questions, setQuestions] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 10;
  const navigate = useNavigate();
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/qna`);
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
    if(userToken){
      navigate('/Input', { state: { from: 'qna' } });
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
      <hr></hr>
      <h1 className='page-title' style={{ color: "black", marginLeft:"650px"}}>전문가 Q&A 게시판</h1>
      <div className="container-box" style={{width:'90%', margin:'0 auto'}}>
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
                  <Link
                  to={`/qna/${question.id}`}>
                    {question.title}
                  </Link>
                </td>
                <td>{question.authorUsername}</td>
                <td>{new Date(question.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        {/* 페이지네이션 */}
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
        {/* 글쓰기 버튼 */}
        <div className="write-button-container">
          <Button variant="light" className='btn' onClick={handleWriteClick}>
            글쓰기
          </Button>
        </div>
      </div>
    </div>
  );
};
export default QnAPage;