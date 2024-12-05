import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { useSelector } from "react-redux";
import DashSidebar from "../components/DashSidebar";
import DashProfile from "../components/DashProfile";
import CreateListing from "../components/CreateListing";
import ShowListings from "../components/ShowListings";
import ManageListings from "../components/ManageListings"; // Admin-specific
import ManageUsers from "../components/ManageUsers"; // Admin-specific
import AdminDashboard from "../components/AdminDashboard"; // Admin-specific

export default function Dashboard() {
  const location = useLocation();
  const { currentUser } = useSelector((state) => state.user);

  // State for current tab
  const [tab, setTab] = useState("");

  // Fetching selected tab from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  // Fetch Listings
  const [userListings, setUserListings] = useState([]);
  const [showListingsError, setShowListingsError] = useState(false);

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }
      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  useEffect(() => {
    if (tab === "show-listings") {
      handleShowListings();
    }
  }, [tab]);

  // Dynamically setting title based on tab
  const getTitle = () => {
    if (tab === "create-listing") return "Create Listings";
    if (tab === "show-listings") return "Show Listings";
    if (tab === "profile") return "Profile";
    if (currentUser?.isAdmin) {
      if (tab === "manage-listings") return "Manage Listings";
      if (tab === "users") return "Manage Users";
    }
    return currentUser?.isAdmin ? "Admin Dashboard" : "User Dashboard";
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-rgb(235, 251, 248); shadow-lg flex-col flex justify-between">
        <DashSidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-grow bg-white">
        <div className="w-full max-w-6xl mx-auto p-6">
          {/* Title */}
          <h2 className="text-2xl font-bold mb-6 bg-slate-800 text-orange-400 py-3 px-4 rounded-bl-lg rounded-br-lg  rounded-tl-lg rounded-tr-lg border-l-4 border-r-4 border-orange-400">
  {getTitle()}
</h2>



          {/* Conditional rendering based on selected tab */}
          {tab === "profile" && <DashProfile />}
          {tab === "create-listing" && <CreateListing />}
          {tab === "show-listings" && (
            <ShowListings listings={userListings} error={showListingsError} />
          )}

          {/* Admin-specific tabs */}
          {currentUser?.isAdmin && tab === "dashboard" && <AdminDashboard />}
          {currentUser?.isAdmin && tab === "manage-listings" && <ManageListings />}
          {currentUser?.isAdmin && tab === "users" && <ManageUsers />}
        </div>
      </div>
    </div>
  );
}
