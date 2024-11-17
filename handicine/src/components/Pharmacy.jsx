import React, { useEffect, useState } from "react";
import { Modal, Typography, Box } from "@mui/material";
import './Pharmacy.css';

const Pharmacy = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [map, setMap] = useState(null);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null); // 선택된 약국 정보
  const [openModal, setOpenModal] = useState(false); // 모달 상태 관리

  useEffect(() => {
    const loadGoogleMapsAPI = () => {
      if (!window.google) {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_API_KEY}&libraries=places,geometry`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
          console.log("Google Maps API loaded!");
          getUserLocation();
        };
        document.body.appendChild(script);
      } else {
        getUserLocation();
      }
    };

    loadGoogleMapsAPI();
  }, []);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCurrentLocation(location);
          initMap(location);
        },
        (error) => console.error("Error getting location:", error)
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const initMap = (location) => {
    const google = window.google;
    const mapInstance = new google.maps.Map(document.getElementById("map"), {
      center: location,
      zoom: 15,
    });
    setMap(mapInstance);
    fetchPharmacies(location, mapInstance); // 지도 초기화 후 약국 검색 실행
  };

  const fetchPharmacies = (location, mapInstance) => {
    const google = window.google;
    const service = new google.maps.places.PlacesService(mapInstance);

    const request = {
      location: new google.maps.LatLng(location.lat, location.lng),
      radius: 3000, // 3km 반경
      type: ["pharmacy"],
    };

    service.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        results.forEach((place) => {
          const marker = new google.maps.Marker({
            position: place.geometry.location,
            map: mapInstance,
            title: place.name,
          });

          // 핀 클릭 시 약국 정보 모달 띄우기
          marker.addListener("click", () => {
            setSelectedPharmacy(place); // 선택된 약국 정보 저장
            setOpenModal(true); // 모달 열기
          });
        });
      } else {
        console.error("PlacesService error:", status);
      }
    });
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedPharmacy(null); // 선택된 약국 정보 초기화
  };

  return (
    <div>
      {/* 구글 지도 화면에 가득 차게 */}
      <div id="map" style={{ height: "100vh", width: "100vw" }}></div>

      {/* 약국 정보 모달 */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
            borderRadius: "8px",
          }}
        >
          {selectedPharmacy && (
            <>
              <Typography variant="h6" component="h2">
                {selectedPharmacy.name}
              </Typography>
              <Typography sx={{ mt: 2 }}>
                주소: {selectedPharmacy.vicinity || "정보 없음"}
              </Typography>
              <Typography sx={{ mt: 1 }}>
                {selectedPharmacy.opening_hours?.isOpen()
                  ? "영업 중"
                  : "영업 종료"}
              </Typography>
            </>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default Pharmacy;