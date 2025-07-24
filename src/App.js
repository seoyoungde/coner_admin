import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminDashboardMain from "./pages/AdminDashboardMain";
import InquiryPage from "./pages/InquiryPage";
import LoginPage from "./pages/LoginPage";
import InquiryRegisterPage from "./pages/InquiryRegisterPage";
import PaymentRegisterPage from "./pages/PaymentRegisterPage";
import PaymentListPage from "./pages/PaymentListPage";
import PartnerEngineerListPage from "./pages/PartnerEngineerListPage";
import EngineerRegisterPage from "./pages/EngineerRegisterPage";
import MemberListPage from "./pages/MemberListPage";
import MapListPage from "./pages/MapListPage";
import Topbar from "./layout/Topbar";
import { AppProvider } from "./context/AppContext";
import PartnerRegisterPage from "./pages/PartnerRegisterPage";

const App = () => {
  return (
    <AppProvider>
      <Router>
        <Topbar />
        <Routes>
          <Route path="/" element={<AdminDashboardMain />} />
          <Route path="/inquiry" element={<InquiryPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/inquiry-register" element={<InquiryRegisterPage />} />
          <Route path="/payment-register" element={<PaymentRegisterPage />} />
          <Route path="/payment-list" element={<PaymentListPage />} />
          <Route path="/partners" element={<PartnerEngineerListPage />} />
          <Route
            path="/partner-engineer-register"
            element={<EngineerRegisterPage />}
          />
          <Route path="/member-list" element={<MemberListPage />} />
          <Route path="/map" element={<MapListPage />} />
          <Route
            path="/partner-company-register"
            element={<PartnerRegisterPage />}
          />
        </Routes>
      </Router>
    </AppProvider>
  );
};

export default App;
