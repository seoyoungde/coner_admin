import React, { useEffect } from "react";

const MapWithMarkers = ({ requests }) => {
  useEffect(() => {
    if (!window.kakao || !window.kakao.maps) return;

    const mapContainer = document.getElementById("map");
    const mapOption = {
      center: new window.kakao.maps.LatLng(37.5665, 126.978),
      level: 8,
    };
    const map = new window.kakao.maps.Map(mapContainer, mapOption);

    const geocoder = new window.kakao.maps.services.Geocoder();
    const clusterer = new window.kakao.maps.MarkerClusterer({
      map,
      averageCenter: true,
      minLevel: 7,
    });

    const completedRequests = requests.filter((r) => r.status === 4);

    completedRequests.forEach((req, index) => {
      const address = req.customer_address;
      if (!address) return;

      geocoder.addressSearch(address, (result, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);

          const marker = new window.kakao.maps.Marker({
            position: coords,
          });

          clusterer.addMarker(marker);
        }
      });
    });
  }, [requests]);

  return <div id="map" style={{ width: "100%", height: "100%" }} />;
};

export default MapWithMarkers;
