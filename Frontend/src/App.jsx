 import { useState, useEffect } from "react";
import HomePage from "./Pages/HomePage";
import ExplorePage from "./Pages/ExplorePage";
import AboutPage from "./Pages/AboutPage";
import LoginPage from "./Pages/LoginPage";
import SignUpPage from "./Pages/SignupPage"
import StartCampaignPage from "./Pages/StartCampaignPage";
import DashboardPage from "./Pages/DashboardPage";
import CampaignDetailPage from "./Pages/CampaignDetailPage";
import { isLoggedIn, removeToken } from "./services/api";

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [user, setUser] = useState(null);
  const [redirectPage, setRedirectPage] = useState(null);

  const [selectedCampaignId, setSelectedCampaignId] = useState(null);

  useEffect(() => {
      const savedUser = localStorage.getItem("crowdlift_user");
      if (savedUser && isLoggedIn()) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUser(JSON.parse(savedUser));
      }
    }, []);

  // Navigate function
  const navigate = (page, campaignId = null) => {
    if (page === "campaign-detail" && campaignId) {
      setSelectedCampaignId(campaignId);
      setCurrentPage("campaign-detail");
      window.scrollTo(0, 0);
      return;
    }
    // Protected pages
    if (page === "campaign" && !user) {
      setRedirectPage("campaign");
      setCurrentPage("login");
      window.scrollTo(0, 0);
      return;
    }
    if (page === "dashboard" && !user) {
      setRedirectPage("dashboard");
      setCurrentPage("login");
      window.scrollTo(0, 0);
      return;
    }
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };


  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("crowdlift_user", JSON.stringify(userData));
   
    if (redirectPage) {
      setCurrentPage(redirectPage);
      setRedirectPage(null);
    }
  };

  // Logout
  const handleLogout = () => {
    removeToken();
    localStorage.removeItem("crowdlift_user");
    setUser(null);
    setCurrentPage("home");
    window.scrollTo(0, 0);
  };

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage navigate={navigate} user={user} handleLogout={handleLogout} />;
      case "explore":
        return <ExplorePage navigate={navigate} user={user} handleLogout={handleLogout} />;
      case "about":
        return <AboutPage navigate={navigate} user={user} handleLogout={handleLogout} />;
      case "login":
        return <LoginPage navigate={navigate} handleLogin={handleLogin} fromPage={redirectPage} />;
      case "signup":
        return <SignUpPage navigate={navigate} handleLogin={handleLogin} />;
      case "campaign":
        return <StartCampaignPage navigate={navigate} user={user} handleLogout={handleLogout} />;
      case "dashboard":
        return <DashboardPage navigate={navigate} user={user} handleLogout={handleLogout} />;
      case "campaign-detail":
        return (
          <CampaignDetailPage
            navigate={navigate}
            user={user}
            handleLogout={handleLogout}
            campaignId={selectedCampaignId}
          />
        );
      default:
        return <HomePage navigate={navigate} user={user} handleLogout={handleLogout} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-white font-sans">
      {renderPage()}
    </div>
  );
}

export default App;