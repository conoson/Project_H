import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; 
import { FormControl, InputGroup, Button, Form } from 'react-bootstrap'; 
import axios from 'axios'; 
import './Update.css';

const QnAUpdate = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate(); // 페이지 이동을 위한 hook
  const { qnaId } = useParams();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/qna/${qnaId}`);
        const qna = response.data;
        setTitle(qna.title);
        setContent(qna.content);
      } catch (error) {
        console.error("Error fetching post data:", error);
      }
    };
    fetchPost();
  }, [qnaId]);
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);              
  };

  const handleBackToList = () => {
    navigate('/qna'); // 'qna' 페이지로 이동
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`${process.env.REACT_APP_API_URL}/api/qna/${qnaId}`, { title, content });
      navigate('/qna'); 
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert("로그인이 필요합니다.");
          return;
        }
  
        const response = await axios.delete(`${process.env.REACT_APP_API_URL}/api/qna/${qnaId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        console.log('Delete response:', response);
        navigate('/qna');
      } catch (error) {
        if (error.response) {
          console.error("Error deleting post:", error.response.data);
          alert(`Error: ${error.response.data.message || "게시물 삭제 실패"}`);
        } else {
          console.error("Error deleting post:", error.message);
          alert("Network error: 요청을 처리할 수 없습니다.");
        }
      }
    }
  };
  return (
    <div className="qna-page">
      <h1 className='page-title' style={{color:"#333", marginLeft:"650px"}}>게시물 수정</h1>
      <div className="container-box">
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formTitle">
            <h2>제목</h2>
            <FormControl
              className='box'
              type="text"
              placeholder="제목을 입력하세요"
              value={title}
              onChange={handleTitleChange}
            />
          </Form.Group>

          <Form.Group controlId="formContent">
            <h2 style={{marginTop:"20px"}}>내용</h2>
            <FormControl
              className='box'
              as="textarea"
              rows={5}
              placeholder="내용을 입력하세요"
              value={content}
              onChange={handleContentChange}
            />
          </Form.Group>
          

          <div className="write-button-container">
            <Button variant="secondary" onClick={handleBackToList} style={{marginRight: "10px"}}>
              목록보기
            </Button>
            <Button variant="success" type="submit" style={{marginRight: "10px"}}>
              수정하기
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              삭제하기
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default QnAUpdate;
