import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Container, Row, Col, Form, Modal, Button, ListGroup } from 'react-bootstrap';
import './searchMedicine.css';
import TylenolImage from '../images/Tylenol.jpg';
import TylenolImage2 from '../images/Tylenol2.jpg';
import TylenolImage3 from '../images/Tylenol3.jpg';
import axios from 'axios'; // axios 추가
import { FaPills } from 'react-icons/fa';

const medicineData = [
  {
    name: '타이레놀',
    image: TylenolImage,
    description: '통증 완화 및 해열에 사용되는 약품.',
    manufacturer: '제조사 A',
    usage: '사용법 설명',
    warning: '주의사항 설명',
    interaction: '상호작용 설명',
    sideEffects: '부작용 설명',
    storage: '보관법 설명'
  },
  {
    name: '타이레놀2',
    image: TylenolImage2,
    description: '염증 완화 및 통증 완화에 사용되는 약품.',
    manufacturer: '제조사 B',
    usage: '사용법 설명2',
    warning: '주의사항 설명2',
    interaction: '상호작용 설명2',
    sideEffects: '부작용 설명2',
    storage: '보관법 설명2'
  },
  {
    name: '타이레놀3',
    image: TylenolImage3,
    description: '알러지 증상 완화에 사용되는 약품.',
    manufacturer: '제조사 C',
    usage: '사용법 설명3',
    warning: '주의사항 설명3',
    interaction: '상호작용 설명3',
    sideEffects: '부작용 설명3',
    storage: '보관법 설명3'
  },
  {
    name: '타이레놀4',
    image: TylenolImage,
    description: '기타 설명.',
    manufacturer: '제조사 D',
    usage: '사용법 설명4',
    warning: '주의사항 설명4',
    interaction: '상호작용 설명4',
    sideEffects: '부작용 설명4',
    storage: '보관법 설명4'
  },
  {
    name: '타이레놀5',
    image: TylenolImage3,
    description: '알러지 증상 완화에 사용되는 약품.',
    manufacturer: '제조사 C',
    usage: '사용법 설명3',
    warning: '주의사항 설명3',
    interaction: '상호작용 설명3',
    sideEffects: '부작용 설명3',
    storage: '보관법 설명3'
  },
  {
    name: '타이레놀6',
    image: TylenolImage3,
    description: '알러지 증상 완화에 사용되는 약품.',
    manufacturer: '제조사 C',
    usage: '사용법 설명3',
    warning: '주의사항 설명3',
    interaction: '상호작용 설명3',
    sideEffects: '부작용 설명3',
    storage: '보관법 설명3'
  },
  {
    name: '타이레놀7',
    image: TylenolImage3,
    description: '알러지 증상 완화에 사용되는 약품.',
    manufacturer: '제조사 C',
    usage: '사용법 설명3',
    warning: '주의사항 설명3',
    interaction: '상호작용 설명3',
    sideEffects: '부작용 설명3',
    storage: '보관법 설명3'
  }
];
const SearchMedicine = () => {
  const { medicineName } = useParams();
  const [searchTerm, setSearchTerm] = useState(medicineName || '');
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeSection, setActiveSection] = useState('description');
  const navigate = useNavigate();
  useEffect(() => {
    // Update the search term and filteredMedicines when medicineName URL param changes
    if (medicineName) {
      fetchMedicines(medicineName);
      // 기존 코드
      // setSearchTerm(medicineName);
      // const results = medicineData.filter(medicine =>
      //   medicine.name.toLowerCase().includes(medicineName.toLowerCase())
      // );
      // setFilteredMedicines(results);
    }
  }, [medicineName]);
  const fetchMedicines = async (itemName) => {
    const url = `${process.env.REACT_APP_API_URL}/api/medicines/search`;
    try {
      const response = await axios.get(url, {
        params: { itemName }
      });
      console.log(response.data); // 전체 응답 데이터 출력
      if (response.data && response.data.length > 0) {
        // API 응답 데이터로 filteredMedicines 설정
        const medicines = response.data.map(item => ({
          name: item.itemName,
          image: item.itemImage || TylenolImage, // 기본 이미지를 설정하거나 API 응답에서 이미지 필드를 가져옵니다.
          description: item.efcyQesitm || '설명 없음',
          manufacturer: item.entpName || '제조사 정보 없음',
          usage: item.useMethodQesitm || '사용법 정보 없음',
          warning: item.atpnQesitm || '주의사항 정보 없음',
          interaction: item.intrcQesitm || '상호작용 정보 없음',
          sideEffects: item.sideEffects || '부작용 정보 없음',
          storage: item.depositMethodQesitm || '보관법 정보 없음'
        }));
        setFilteredMedicines(medicines); // API로부터 받은 데이터를 설정
        navigate(`/searchMedicine/${itemName}`, { state: { medicines } });
      } else {
        console.log("약품이 없습니다.");
        setFilteredMedicines([]); // 빈 배열로 설정
      }
    } catch (error) {
      console.error('불러오기 실패:', error);
    }
  };
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim() !== "") {
      fetchMedicines(searchTerm); // 검색어로 API 호출
      // 기존 코드
      // const results = medicineData.filter(medicine =>
      //   medicine.name.toLowerCase().includes(searchTerm.toLowerCase())
      // );
      // setFilteredMedicines(results);
      // navigate(`/searchMedicine/${searchTerm}`);
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearchSubmit(e);
    }
  };
  const handleCardClick = (medicine) => {
    setSelectedMedicine(medicine);
    setShowModal(true);
    setActiveSection('description');
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedMedicine(null);
  };
  const getItemStyle = (section) => {
    return section === activeSection ? { backgroundColor: '#83C9E7', color: '#fff' } : {};
  };
  return (
    <div className="search-medicine-page">
      <div className="search-bar-container">
        <Form onSubmit={handleSearchSubmit}>
          <Form.Group>
            <Form.Control
              type="text"
              placeholder="약품 이름을 입력하세요"
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
            />
          </Form.Group>
        </Form>
      </div>
      <Container>
        {filteredMedicines.length > 0 && (
          <Row className="card-container">
            {filteredMedicines.map((medicine, index) => (
              <Col md={4} key={index} className="card-col">
                <Card className="card" onClick={() => handleCardClick(medicine)}>
                {medicine.image !== "없음" ? (
                    <Card.Img 
                      variant="top" 
                      src={medicine.image} // 이미지가 있으면 보여줌
                      className="card-img" 
                      alt={medicine.name} 
                    />
                  ) : (
                    <div style={{ height: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <FaPills size={100} style={{ color: 'gray' }} />
                    </div>
                  )}
                  <Card.Body>
                    <Card.Title className="card-title">{medicine.name}</Card.Title>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
        {filteredMedicines.length === 0 && searchTerm.trim() !== '' && (
          <p style={{ color: "#333", marginTop:"500px", fontSize:"2rem" }}>해당 약품은 존재하지 않습니다.</p>
        )}
      </Container>
      {selectedMedicine && (
        <Modal show={showModal} onHide={handleCloseModal} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>{selectedMedicine.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container>
              <Row>
                <Col md={3}>
                  <ListGroup>
                    <ListGroup.Item
                      action
                      style={getItemStyle('description')}
                      onClick={() => setActiveSection('description')}
                    >
                      제품 설명
                    </ListGroup.Item>
                    <ListGroup.Item
                      action
                      style={getItemStyle('manufacturer')}
                      onClick={() => setActiveSection('manufacturer')}
                    >
                      제조사
                    </ListGroup.Item>
                    <ListGroup.Item
                      action
                      style={getItemStyle('usage')}
                      onClick={() => setActiveSection('usage')}
                    >
                      사용법
                    </ListGroup.Item>
                    <ListGroup.Item
                      action
                      style={getItemStyle('warning')}
                      onClick={() => setActiveSection('warning')}
                    >
                      주의사항
                    </ListGroup.Item>
                    <ListGroup.Item
                      action
                      style={getItemStyle('interaction')}
                      onClick={() => setActiveSection('interaction')}
                    >
                      상호작용
                    </ListGroup.Item>
                    <ListGroup.Item
                      action
                      style={getItemStyle('sideEffects')}
                      onClick={() => setActiveSection('sideEffects')}
                    >
                      부작용
                    </ListGroup.Item>
                    <ListGroup.Item
                      action
                      style={getItemStyle('storage')}
                      onClick={() => setActiveSection('storage')}
                    >
                      보관법
                    </ListGroup.Item>
                  </ListGroup>
                </Col>
                <Col md={9}>
                  {activeSection === 'description' && <p>{selectedMedicine.description}</p>}
                  {activeSection === 'manufacturer' && <p>{selectedMedicine.manufacturer}</p>}
                  {activeSection === 'usage' && <p>{selectedMedicine.usage}</p>}
                  {activeSection === 'warning' && <p>{selectedMedicine.warning}</p>}
                  {activeSection === 'interaction' && <p>{selectedMedicine.interaction}</p>}
                  {activeSection === 'sideEffects' && <p>{selectedMedicine.sideEffects}</p>}
                  {activeSection === 'storage' && <p>{selectedMedicine.storage}</p>}
                </Col>
              </Row>
            </Container>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default SearchMedicine;