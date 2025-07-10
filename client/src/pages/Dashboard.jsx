import React, { useEffect, useState } from "react";
import axios from "axios";
import BarChart from "../components/charts/BarChart";
import AppList from "../components/charts/AppList";
import { trackTimeOnDomain } from "../utils/tracker";

const StatCard = ({ title, value, color }) => (
  <div className={`p-4 rounded-xl shadow-md text-white ${color}`}>
    <h4 className="text-sm">{title}</h4>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

const formatDuration = (ms) => {
  const totalMinutes = Math.floor(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours} h ${minutes} min`;
};

// Map domains to categories
const domainToCategory = {
  "youtube.com": "Entertainment",
  "netflix.com": "Entertainment",
  "github.com": "Work",
  "cloud.mongodb.com": "Work",
  "localhost": "Work",
  "stackoverflow.com": "Work",
  "mail.google.com": "Communication",
  "gmail.com": "Communication",
  "meet.google.com": "Communication",
  "accounts.google.com": "Communication",
  "discord.com": "Social",
  "twitter.com": "Social",
  "facebook.com": "Social",
  "linkedin.com": "Work",
};

const Dashboard = () => {
  const [summary, setSummary] = useState([]);
  const [totalDuration, setTotalDuration] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("No token found");
      return;
    }

    const stopTracking = trackTimeOnDomain("Dashboard");

    const fetchSummary = () => {
      axios
        .get("http://localhost:3000/api/activity/summary", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const data = res.data.data || [];
          setSummary(data);
          const total = data.reduce((sum, item) => sum + (item.totalDuration || 0), 0);
          setTotalDuration(total);
        })
        .catch((err) => console.error("Error fetching activity summary:", err));
    };

    fetchSummary();
    const interval = setInterval(fetchSummary, 30000);

    return () => {
      clearInterval(interval);
      stopTracking();
    };
  }, []);

  // Group durations by category
  const groupedByCategory = summary.reduce((acc, item) => {
    const domain = item._id || "Unknown";
    const category = domainToCategory[domain] || "Others";
    const duration = item.totalDuration || 0;
    acc[category] = (acc[category] || 0) + duration;
    return acc;
  }, {});

  const chartData = Object.entries(groupedByCategory)
    .filter(([_, duration]) => duration > 0)
    .map(([category, duration]) => ({
      category,
      minutes: Math.round(duration / 60000),
      color: "#4caf50",
    }));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-1">Dashboard Usage</h1>
        <p className="text-md text-gray-600 dark:text-gray-300">
          Total Tracked Time: {formatDuration(totalDuration)}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* Bar Chart */}
        <div className="col-span-1 md:col-span-2 lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
          <h2 className="text-md font-semibold mb-2">Usage by Category</h2>
          {chartData.length > 0 ? (
            <>
              <BarChart data={chartData} rotateLabels />
              <div className="text-sm mt-4 text-gray-600 dark:text-gray-400">
                {chartData.map((d) => (
                  <div key={d.category}>
                    🟩 {d.category}: {d.minutes} min
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p>No activity found. Make sure tracking is working.</p>
          )}
        </div>

        {/* Stat Cards */}
        <StatCard title="Time At Work" value={formatDuration(totalDuration)} color="bg-blue-500" />
        <StatCard title="Productivity" value="Coming soon" color="bg-green-500" />
        <StatCard title="Communication" value="Coming soon" color="bg-cyan-500" />
        <StatCard title="Others" value="Coming soon" color="bg-purple-500" />

        {/* App List */}
        <div className="col-span-1 md:col-span-2 lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
          <h2 className="text-md font-semibold mb-2">Recent Activity</h2>
          <div className="h-48 overflow-y-auto">
            <AppList data={summary} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
