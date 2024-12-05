import React, { useEffect, useState } from "react";
import { FiUsers } from "react-icons/fi";
import { FaHome } from "react-icons/fa";
import { RiAdminLine } from "react-icons/ri";

const Dashboard = () => {
  const [userCount, setUserCount] = useState(0); // State for user count

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const response = await fetch("/api/users/total/count"); // Correct fetch syntax
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json(); // Parse JSON data
        setUserCount(data); // Set the user count
      } catch (error) {
        console.error("Error fetching user count:", error);
        setUserCount("Error"); // Optional fallback for errors
      }
    };

    fetchUserCount();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-bgPrimary p-5">
        <h1>Hi, Admin!</h1>
        <p>Welcome to the admin dashboard</p>
        <p>Here you can manage listings, users, and reviews</p>
      </div>

      {/* Cards Grid */}
      <div className="flex flex-col md:flex-row justify-center gap-8 pt-8">
        <div className="bg-green-100 py-6 w-full rounded-sm space-y-1 flex flex-col items-center">
          <FiUsers className="size-8 text-orange-500" />
          <p>Users</p>
          <p className="text-lg font-bold">{userCount}</p> {/* Display user count */}
        </div>
        <div className="bg-slate-600 py-6 w-full rounded-sm space-y-1 flex flex-col items-center">
          <FaHome className="size-8 text-orange-500" />
          <p>Listings</p>
        </div>
        <div className="bg-green-100 py-6 w-full rounded-sm space-y-1 flex flex-col items-center">
          <RiAdminLine className="size-8 text-orange-500" />
          <p>Admins</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
