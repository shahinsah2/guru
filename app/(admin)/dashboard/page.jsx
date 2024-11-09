"use client";

import React from "react";
import { Doughnut, Line } from "react-chartjs-2";
import "chart.js/auto"; // Import Chart.js components automatically
import { useUser } from "@clerk/nextjs";

const Dashboard = () => {
  const { isLoaded, isSignedIn, user } = useUser();

  // Ensure the component doesn't render if the user isn't signed in
  if (!isLoaded || !isSignedIn) {
    return null;
  }

  console.log(user);

  // Data for Doughnut Chart (Rent Status and Product Status)
  const rentStatusData = {
    labels: ["On Rent", "Not Rented"],
    datasets: [
      {
        data: [62, 38],
        backgroundColor: ["#7E5FF4", "#2D9CDB"],
        hoverBackgroundColor: ["#7E5FF4", "#2D9CDB"],
      },
    ],
  };

  const productStatusData = {
    labels: ["Rental", "Sale", "Service", "Pending Stocks"],
    datasets: [
      {
        data: [52, 25, 9, 14],
        backgroundColor: ["#7E5FF4", "#F9C22E", "#2D9CDB", "#FF3D00"],
        hoverBackgroundColor: ["#7E5FF4", "#F9C22E", "#2D9CDB", "#FF3D00"],
      },
    ],
  };

  // Data for Line Chart (Yearly Overview)
  const lineData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Revenue",
        data: [
          250000, 220000, 200000, 230000, 240000, 260000, 280000, 290000,
          310000, 320000, 330000, 350000,
        ],
        borderColor: "#7E5FF4",
        fill: false,
      },
      {
        label: "Sales",
        data: [
          144000, 155000, 165000, 145000, 160000, 180000, 190000, 200000,
          210000, 220000, 230000, 240000,
        ],
        borderColor: "#2D9CDB",
        fill: false,
      },
    ],
  };

  // High Paying Rental Clients Data
  const rentalClients = [
    { code: "1620", name: "Anand Technologies Pvt Ltd", totalCost: "150K" },
    { code: "1621", name: "Tech Innovators LLC", totalCost: "130K" },
  ];

  // Balance Payment Data
  const balancePayments = [
    { code: "1620", name: "Anand Technologies Pvt Ltd", balanceCost: "50K" },
    { code: "1621", name: "Tech Innovators LLC", balanceCost: "40K" },
  ];

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">
        Hello,{" "}
        {(user?.username || user?.firstName || "User")[0]?.toUpperCase() +
          (user?.username || user?.firstName || "User").slice(1)}
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {["New Contacts", "Rental Order", "Sale Order", "Rental Return"].map(
          (title, index) => (
            <div key={index} className="bg-white shadow-md rounded-xl p-6">
              <div className="flex items-center space-x-4">
                {/* Add an icon for each card */}
                <span className="bg-blue-500 text-white p-2 rounded-full">
                  📊
                </span>
                <div>
                  <h2 className="font-semibold text-lg">{title}</h2>
                  <div className="flex justify-between text-sm mt-2">
                    <div>
                      <p>Today</p>
                      <p className="font-bold text-xl">0</p>
                    </div>
                    <div>
                      <p>7 Days</p>
                      <p className="font-bold text-xl">2</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        )}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Rent Status */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="font-semibold text-xl mb-4">Rent Status</h2>
          <Doughnut data={rentStatusData} />
          <ul className="mt-4 text space-y-2">
            {["On Rent", "Not Rented"].map((item, index) => (
              <li key={index} className="flex justify-between">
                <span className="flex items-center">
                  <span
                    className={`w-3 h-3 rounded-full mr-2`}
                    style={{
                      backgroundColor:
                        rentStatusData.datasets[0].backgroundColor[index],
                    }}
                  ></span>
                  {item}
                </span>
                <span>{rentStatusData.datasets[0].data[index]}%</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Product Status */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="font-semibold text-xl mb-4">Product Status</h2>
          <Doughnut data={productStatusData} />
          <ul className="mt-4 text space-y-2">
            {["Rental", "Sale", "Service", "Pending Stocks"].map(
              (item, index) => (
                <li key={index} className="flex justify-between">
                  <span className="flex items-center">
                    <span
                      className={`w-3 h-3 rounded-full mr-2`}
                      style={{
                        backgroundColor:
                          productStatusData.datasets[0].backgroundColor[index],
                      }}
                    ></span>
                    {item}
                  </span>
                  <span>{productStatusData.datasets[0].data[index]}%</span>
                </li>
              )
            )}
          </ul>
        </div>

        {/* Yearly Overview */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="font-semibold text-xl mb-4">Yearly Overview</h2>
          <Line data={lineData} />
        </div>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* High Paying Rental Clients */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="font-semibold text-xl mb-4">
            High Paying Rental Clients
          </h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2">Customer Code</th>
                <th className="py-2">Name</th>
                <th className="py-2">Company Name</th>
                <th className="py-2">Total Cost</th>
              </tr>
            </thead>
            <tbody>
              {rentalClients.map((client, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2">{client.code}</td>
                  <td className="py-2">{client.name}</td>
                  <td className="py-2">Anand Technologies Pvt Ltd</td>
                  <td className="py-2">{client.totalCost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Balance Payment */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="font-semibold text-xl mb-4">Pending Payments</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2">Customer Code</th>
                <th className="py-2">Name</th>
                <th className="py-2">Company Name</th>
                <th className="py-2">Balance Cost</th>
              </tr>
            </thead>
            <tbody>
              {balancePayments.map((payment, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2">{payment.code}</td>
                  <td className="py-2">{payment.name}</td>
                  <td className="py-2">Anand Technologies Pvt Ltd</td>
                  <td className="py-2">{payment.balanceCost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
