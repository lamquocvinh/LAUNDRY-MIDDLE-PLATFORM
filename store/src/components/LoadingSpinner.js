// import React from "react";
// import "../styles/spinner.css";

// export default function LoadingSpinner() {
//   return (
//     <div className="spinner-container">
//       <h2 style={{ color: "red" }}>Hiện tại cửa hàng chưa có dịch vụ nào</h2>
//       <h2 style={{ color: "red" }}>Tạo thêm dịch vụ của riêng bạn </h2>
//     </div>
//   );
// }


import React from "react";
// LoadingSpinner component

import  { useState, useEffect } from "react";
import "../styles/spinner.css";

export default function LoadingSpinner({ isSuccess }) {
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    if (isSuccess) {
      // Delay showing the spinner for 4 seconds
      const timer = setTimeout(() => {
        setShowSpinner(true);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

  return (
    <div className="spinner-container" style={{marginLeft:"0%", marginTop:"-10%"}}>
      <div className="loading-spinner">
       
      </div>
      <h2>Loading.....</h2>
   </div>
    
  );
  }