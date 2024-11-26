import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import './Detail.css';
import axios from 'axios';

const QnADetail = () => {
  const { qnaId } = useParams();
  const [post, setPost] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [editCommentId, setEditCommentId] = useState(null);
  const [editedCommentContent, setEditedCommentContent] = useState("");
  const [comments, setComments] = useState([]);
  const userId = localStorage.getItem('userId');
  const userToken = localStorage.getItem('userToken');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/qna/${qnaId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch post');
        }
        const data = await response.json();
        setPost(data);
        fetchComments();
      } catch (error) {
        console.error("Error fetching post details:", error);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/qna/${qnaId}/answers`, {
          headers: {
            'Authorization': `Bearer ${userToken}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch comments');
        }
        const data = await response.json();
        setComments(data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchPostDetails();
  }, [qnaId, userToken]);

  const handleBackToList = () => {
    navigate('/qna');
  };

  const handleUpdateClick = () => {
    navigate(`/qna/update/${qnaId}`);
  };

  const handleAddComment = async () => {
    const token = localStorage.getItem('token');
    const decodedToken = parseJwt(token);
    const question_id = qnaId;

    if (decodedToken.role_name === "expert") {
      const commentData = {
        content: newComment,
        questionId: question_id,
        authorUsername: userId,
      };
      try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/qna/${question_id}/answers`, commentData, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setComments([...comments, response.data]);
        setNewComment("");
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    } else {
      alert("전문가만 댓글을 작성할 수 있습니다.");
    }
  };

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleEditCommentChange = (e) => {
    setEditedCommentContent(e.target.value);
  };

  const handleEditClick = (comment) => {
    setEditCommentId(comment.id);
    setEditedCommentContent(comment.content);
  };

  const handleUpdateComment = async (commentId, editedCommentContent) => {
    try {
      const response = await axios.patch(`${process.env.REACT_APP_API_URL}/api/qna/answers/${commentId}`, {
        content: editedCommentContent
      }, {
        headers: {
          'Authorization': `Bearer ${userToken}`
        }
      });
      setComments(comments.map(comment =>
        comment.id === commentId ? response.data : comment
      ));
      setEditCommentId(null);
      setEditedCommentContent("");
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };
  

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/qna/answers/${commentId}`, {
        headers: {
          'Authorization': `Bearer ${userToken}`
        }
      });
      setComments(comments.filter(comment => comment.id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const parseJwt = (token) => {
    try {
      const trimmedToken = token.trim();
      const base64Url = trimmedToken.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("JWT 해석 중 오류 발생:", error);
      return null;
    }
  };

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="qna-page">
      <h1 className='page-title' style={{ color: "black", marginLeft: "550px" }}>게시물 내용</h1>
      <div className="detail-container">
        <h2>제목</h2>
        <div className="title-box">
          <h1 style={{ textAlign: "left" }}>{post.title}</h1>
        </div>
        <h2>내용</h2>
        <div className="content-box">
          <h4>{post.content}</h4>
        </div>
      </div>
      <h2 className="comment-section-title" style={{ color: "black", marginRight: "950px" }}>댓글</h2>
      <Form.Control
        className='commentfield'
        as="textarea"
        rows={3}
        placeholder="댓글을 입력하세요"
        value={newComment}
        onChange={handleCommentChange}
        style={{ marginTop: "20px", maxWidth:"1000px" }}
      />
      {comments.map((comment) => (
        <div key={comment.id} className='container-box' style={{ marginTop: "30px", maxWidth: "1000px",  display: "flex", justifyContent: "space-between" }}>
          <div style={{display:"flex", alignItems:"center"}}>
          <strong>{comment.authorUsername}</strong>
          <span style={{ marginLeft: "5px", marginRight: "5px" }}>:</span>
          {editCommentId === comment.id ? (
            <Form.Control
              type="text"
              value={editedCommentContent}
              onChange={handleEditCommentChange}
              onBlur={async (e) => {
                await handleUpdateComment(comment.id, e.target.value); // 업데이트가 완료된 후 상태 변경
                setEditCommentId(null); // 업데이트 후 텍스트 박스 닫기
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleUpdateComment(comment.id, e.target.value);
                  setEditCommentId(null);
                }
              }}
            />
          ) : (
            <span>{comment.content}</span>
          )}
          </div>
          <div>
            {comment.authorUsername === userId && (
              <>
                <Button style={{marginLeft: "10px", backgroundColor: "skyblue" }} onClick={() => handleEditClick(comment)}>
                  수정
                </Button>
                <Button onClick={() => handleDeleteComment(comment.id)}>삭제</Button>
              </>
            )}
          </div>
        </div>
      ))}
      <div className="write-button-container" style={{ marginTop: "20px" }}>
        {post.authorUsername === userId && (
          <Button variant="secondary" onClick={handleUpdateClick} style={{ marginRight: "10px" }}>
            수정하기
          </Button>
        )}
        <Button variant="secondary" onClick={handleBackToList} style={{ marginRight: "10px" }}>
          목록보기
        </Button>
        <Button variant="success" onClick={handleAddComment}>
          댓글등록
        </Button>
      </div>
    </div>
  );
};

export default QnADetail;
