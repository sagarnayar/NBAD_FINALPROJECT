import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.scss";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import { calculatePercentage } from "../utils";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement
);

function HomePage() {
  const navigate = useNavigate();
  const [budgets, setBudgets] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("January");
  // eslint-disable-next-line
  const [usedBudget, setUsedBudget] = useState(0);
  // eslint-disable-next-line
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedYearTable, setSelectedYearTable] = useState(
    new Date().getFullYear()
  );
  // eslint-disable-next-line
  const [usedselectedCategory, setUsedSelectedCategory] = useState("");
  // eslint-disable-next-line
  const [usedselectedYear, setUsedSelectedYear] = useState(
   
    new Date().getFullYear()
    // eslint-disable-next-line
  );
  // eslint-disable-next-line
  const [usedselectedMonth, setUsedSelectedMonth] = useState(""); // eslint-disable-next-line
  const [userId, setUserId] = useState("");
  const [tableData, setTableData] = useState([]);// eslint-disable-next-line
  const [usedCategories, setUsedCategories] = useState([]); 

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");// eslint-disable-next-line
    const storedToken = localStorage.getItem("token");
    setUserId(storedUserId);
    fetchData(selectedYear, selectedMonth, storedUserId);
  }, [selectedYear, selectedMonth, selectedCategory, selectedYearTable]);

  useEffect(() => {
    fetchUsedCategories();
  }, []);

  const fetchData = (year, month, userId) => {
    axios
      .get(`http://64.176.221.128:3002/api/get-budgets/${year}/${month}/${userId}`)
      .then((response) => {
        setBudgets(response.data);
      })
      .catch((error) => {
        console.error("Error fetching budgets:", error);
      });
  };

  const fetchTableData = () => {
    const storedUserId = localStorage.getItem("userId");
    axios
      .get(
        `http://64.176.221.128:3002/api/get-table-data/${selectedYearTable}/${storedUserId}`
      )
      .then((response) => {
        setTableData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching table data:", error);
      });
  };

  const fetchUsedCategories = () => {
    axios
      .get("http://64.176.221.128:3002/api/get-all-categories")
      .then((response) => {
        setUsedCategories(response.data);
        setUsedSelectedCategory(response.data[0]);
      })
      .catch((error) => {
        console.error("Error fetching used categories:", error);
      });
  };

  const checkTokenExpiration = () => {
    const token = localStorage.getItem("token");
    const expirationTime = localStorage.getItem("tokenExpiration");

    if (token && expirationTime) {
      const currentTime = new Date().getTime();
      const timeToExpire = expirationTime - currentTime;

      if (timeToExpire < 20000 && timeToExpire > 0) {
        const extendSession = window.confirm(
          "Hey, your session is throwing a mini tantrum, ready to hit the snooze button and keep the party going?⏳🎉"
        );

        if (extendSession) {
          const newExpirationTime = Date.now() + 60 * 1000;
          localStorage.setItem("tokenExpiration", newExpirationTime);
        } else {
          localStorage.removeItem("username");
          localStorage.removeItem("token");
          localStorage.removeItem("password");
          localStorage.removeItem("userid");
          localStorage.removeItem("tokenExpiration");
          navigate("/");
        }
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      checkTokenExpiration(); // eslint-disable-next-line
    }, 5000);

    return () => clearInterval(interval); // eslint-disable-next-line
  }, []);

  const totalBudget = budgets.reduce(
    (acc, budget) => acc + budget.allocated,
    0
  );

  const pieData = {
    labels: budgets.map((b) => b.category),
    datasets: [
      {
        data: budgets.map((b) => b.allocated),
        backgroundColor: [
          "blue",
          "green",
          "orange",
          "red",
          "brown",
          "purple",
          "pink",
          "teal",
          "yellow",
          "cyan",
          "maroon",
          "navy",
          "olive",
          "silver",
          "lime",
          "aqua",
          "fuchsia",
          "gray",
          "black",
        ],
      },
    ],
  };

  const pieOptions = {
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const category = budgets[context.dataIndex].category;
            const allocated = budgets[context.dataIndex].allocated;
            const percentage = calculatePercentage(allocated, totalBudget);
            const additionalInfo = `${category} - ${allocated} (${percentage}% of total budget)`;
            return additionalInfo;
          },
        },
      },
    },
  };

  const barData = {
    labels: budgets.map((b) => b.category),
    datasets: [
      {
        label: "Allocated Budget",
        data: budgets.map((b) => b.allocated),
        backgroundColor: "rgba(0, 123, 255, 0.5)",
      },
      {
        label: "Used Budget",
        data: budgets.map((b) => b.used),
        backgroundColor: "rgba(255, 193, 7, 0.5)",
      }, // eslint-disable-next-line
    ],
  };
// eslint-disable-next-line
  const handleUsedBudgetSubmit = async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem("userId");
    const usedBudgetNumber = parseFloat(usedBudget);

    const payload = {
      category: usedselectedCategory,
      used: usedBudgetNumber,
      month: usedselectedMonth,
      year: usedselectedYear,
      userId: userId,
    };

    try {
      await axios.post("http://64.176.221.128:3002/api/enter-used-budget", payload);
      console.log("Used Budget update successful");
      fetchData(selectedMonth, userId);
    } catch (error) {
      console.error("Error entering used budget:", error);
      if (error.response && error.response.data) {
        console.error("Server error message:", error.response.data);
      }
    }
  };

  useEffect(() => { // eslint-disable-next-line
    if (selectedYearTable) {
      fetchTableData();
    } // eslint-disable-next-line
  }, []);

  return (
    <div className="pagecontent">
      <div className="homepage-container">
        <div className="charts-container">
          {/* Month and Year Selection Form */}
          <form className="month-year-form">
            <label>
              Select Month:
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                {[ "select none",
                  "January",
                  "February",
                  "March",
                  "April",
                  "May",
                  "June",
                  "July",
                  "August",
                  "September",
                  "October",
                  "November",
                  "December",
                ].map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Select Year:
              <input
                type="number"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              />
            </label>
          </form>

          {/* Budget Allocation Pie and Bar Charts */}
          <div className="charts-wrapper">
            <div className="chart-box pie-chart-box">
              <h2>Budget Allocation</h2>
              {budgets.length > 0 ? (
                <Pie data={pieData} options={pieOptions} />
              ) : (
                <p>No data available</p>
              )}
            </div>

            <div className="chart-box bar-chart-box">
              <h2>Budget Usage</h2>
              {budgets.length > 0 ? (
                <Bar data={barData} />
              ) : (
                <p>No data available</p>
              )}
            </div>
          </div>

          {/* Table Content */}
          <div className="table-content">
            {/* Year Selector Form */}
            <div className="year-selector">
              <label>
                Select Table Year:
                <input
                  type="number"
                  value={selectedYearTable}
                  onChange={(e) => setSelectedYearTable(e.target.value)}
                />
              </label>
              <button onClick={fetchTableData}>Get Table</button>
            </div>

            {/* Budget Analysis Table */}
            <div className="budget-table">
              <h2>Budget Analysis Table for Year {selectedYearTable}</h2>

              <table className="table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Month</th>
                    <th>Allocated</th>
                    <th>Used budget</th>
                    <th>Summary</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((data, index) => (
                    <tr key={index} className="table-row">
                      <td>{data.category}</td>
                      <td>{data.month}</td>
                      <td>{data.allocated}</td>
                      <td>{data.used}</td>
                      <td>
                        {data.allocated - data.used > 0 ? (
                          `${data.allocated - data.used} can be used`
                        ) : (
                          `Exceeded by ${data.used - data.allocated}`
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
