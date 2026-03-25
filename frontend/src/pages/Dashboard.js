import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import StatsChart from "../components/StatsChart";

const API = "https://codetracker-production-abf7.up.railway.app";

function Dashboard() {
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const userData = JSON.parse(localStorage.getItem("user"));
  const userId = userData?._id;
  const username = userData?.username || "User";

  useEffect(() => {
    if (!userId) {
      navigate("/");
      return;
    }

    loadUserData();
  }, [userId]);

  const loadUserData = async () => {
    try {
      const res = await axios.get(
        `${API}/api/user/${userId}`
      );

      const lc = res.data.lcUsername;
      const cc = res.data.ccUsername;
      const cf = res.data.cfUsername;

      if (!lc && !cc && !cf) {
        setLoading(false);
        return;
      }

      fetchStats(lc, cc, cf);

    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const fetchStats = async (lc, cc, cf) => {
    try {
      const res = await axios.get(
        `${API}/api/stats?lc=${lc}&cc=${cc}&cf=${cf}`
      );

      setData(res.data);
      setLoading(false);

    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <h2 style={{ padding: "20px" }}>Loading...</h2>
      </>
    );
  }

  if (!data) {
    return (
      <>
        <Navbar />
        <div style={{ padding: "20px" }}>
          <h2>Welcome {username}</h2>
          <p>Please set your usernames in Settings ⚙️</p>
          <button onClick={() => navigate("/settings")}>
            Go to Settings
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="container">
        <h2>Welcome {username} 👋</h2>

        <div style={{
          marginTop: "20px",
          background: "#020617",
          padding: "15px",
          borderRadius: "10px"
        }}>
          <h3>Linked Accounts 🔗</h3>
          <p><b>LeetCode:</b> {data.leetcodeUsername || "Not set"}</p>
          <p><b>CodeChef:</b> {data.codechefUsername || "Not set"}</p>
          <p><b>Codeforces:</b> {data.codeforcesUsername || "Not set"}</p>
        </div>

        <div className="card-container">
          <div className="card">
            <h3>Total</h3>
            <p>{data.combined.totalSolved}</p>
          </div>

          <div className="card">
            <h3>Easy</h3>
            <p>{data.combined.easy}</p>
          </div>

          <div className="card">
            <h3>Medium</h3>
            <p>{data.combined.medium}</p>
          </div>

          <div className="card">
            <h3>Hard</h3>
            <p>{data.combined.hard}</p>
          </div>
        </div>

        <div className="graph-section">
          <h3>Progress Overview 📊</h3>
          <StatsChart data={data} />
        </div>

        <div className="platform-grid">
          <div className="platform-card">
            <h4>LeetCode</h4>
            <p>Easy: {data.leetcode.easy}</p>
            <p>Medium: {data.leetcode.medium}</p>
            <p>Hard: {data.leetcode.hard}</p>
          </div>

          <div className="platform-card">
            <h4>CodeChef</h4>
            <p>Total: {data.codechef.totalSolved}</p>
            <p>Rating: {data.codechef.rating}</p>
          </div>

          <div className="platform-card">
            <h4>Codeforces</h4>
            <p>Total: {data.codeforces.totalSolved}</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
