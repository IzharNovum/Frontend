import React, { useState, useEffect } from "react";
import "./AuditLogs.scss";

const AuditLogs = () => {
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem("logs");
    return savedMessages ? JSON.parse(savedMessages) : [];
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [sortLevel, setSortLevel] = useState("");
  const [sortCategory, setSortCategory] = useState("");
  const [selectedLogs, setSelectedLogs] = useState([]);

  useEffect(() => {   //WEBSOCKET CONNECT TO RECEIVE DATA FROM BCKEND...
    console.log("Attempting to create WebSocket connection...");

    const ws = new WebSocket("ws://localhost:3002");

    ws.onopen = () => {
      console.log("WebSocket connection established");
    };

    ws.onmessage = (event) => {
      console.log("Message from server:", event.data);
      try {
        const logData = JSON.parse(event.data);

        const formattedLog =
          `${logData.ExchangeService}\u2003 : \u2003 [${logData.timestamp}]\u2003--\u2003 ` +
          `[${logData.level}]\u2003--\u2003 ${logData.Category}\u2003--\u2003 ` +
          `${logData.userName}\u2003--\u2003 ${logData.endPoint}\u2003==> \u2003 ` +
          `${logData.message}`;

        setMessages((prevMessages) => {
          const updatedMessages = [
            ...prevMessages,
            { ...logData, formattedLog },
          ];
          localStorage.setItem("logs", JSON.stringify(updatedMessages));
          return updatedMessages;
        });
      } catch (error) {
        console.error("Failed to parse message from server:", error);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      console.log("Cleaning up WebSocket connection...");
      // ws.close();
    };
  }, []);



              // ...Over-Ride...
  // const getColorByLogLevel = (level) => {
  //   switch (level) {
  //     case "INFO":
  //       return "#2ecc71"; // Emerald Green
  //     case "ERROR":
  //       return "#e74c3c"; // Cinnabar Red
  //     case "WARN":
  //       return "#95a5a6"; // Light Gray
  //     case "DEBUG":
  //       return "#3498db"; // Sky Blue
  //     case "CRITICAL":
  //       return "#c0392b"; // Dark Red
  //     default:
  //       return "black"; // Default Black
  //   }
  // };
  const getColorByLogLevel = (level) => {
    switch (level) {
      case "INFO":
        return {
          text: "#4CAF50", // Emerald Green
          background: "rgba(129, 199, 132, 0.2)", // Light Green for background
        };
      case "ERROR":
        return {
          text: "#FF4C4C", // Cinnabar Red
          background: "rgba(255, 99, 99, 0.2)", // Light Red for background
        };
      case "WARN":
        return {
          text: "#FFC107", // Light Gray
          background: "rgba(255, 193, 7, 0.2)", // Yellow-orange for background
        };
      case "DEBUG":
        return {
          text: "#3498db", // Sky Blue
          background: "rgba(100, 181, 246, 0.3)", // Light Blue for background
        };
      case "CRITICAL":
        return {
          text: "#c0392b", // Dark Red
          background: "rgba(183, 28, 28, 0.4)", // Darker Red for background
        };
      default:
        return {
          text: "black",
          background: "rgba(238, 238, 238, 0.6)", // Default Gray for background
        };
    }
  };

  //DEL THE LOG USING SELECTED DEL LOGIC...
  const handleCheckboxChange = (index) => {
    setSelectedLogs((prevSelectedLogs) => {
      if (prevSelectedLogs.includes(index)) {
        return prevSelectedLogs.filter((i) => i !== index);
      } else {
        return [...prevSelectedLogs, index];
      }
    });
  };

  //LOGIC FOR SELECTED DEL LOG...
  const clearSelectedLogs = () => {
    const remainingLogs = messages.filter(
      (msg, index) => !selectedLogs.includes(index)
    );
    setMessages(remainingLogs);
    setSelectedLogs([]);
    localStorage.setItem("logs", JSON.stringify(remainingLogs));
    console.log("Selected Logs Cleared!");
  };

  //CLEAR ALL LOGS...
  const clearLogs = () => {
    localStorage.removeItem("logs");
    setMessages([]);
    console.log("Logs Cleared!");
  };


  const filteredMessages = messages.filter((msg) => {
    //SEARCH FILTER LOGIC....
    const matchesSearchQuery = msg.formattedLog
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

      //FILTERING BASED ON LOG LEVEL....
    const matchesSortLevel = sortLevel
      ? msg.level.toLowerCase() === sortLevel.toLowerCase()
      : true;

      //FILTERING BASED ON CATEGORY....
    const matchesSortCategory = sortCategory
      ? sortCategory
          .split(",")
          .some(
            (category) => msg.Category.toLowerCase() === category.toLowerCase()
          )
      : true;

    return matchesSearchQuery && matchesSortLevel && matchesSortCategory;
  });

  return (
    <div id="audit">
      <div id="container">
        <div id="header">
          {/* SEARCH BAR */}
          <div class="searchBar">
            <input checked="" class="checkbox" type="checkbox" />
            <div class="mainbox">
              <div class="iconContainer">
                <svg
                  viewBox="0 0 512 512"
                  height="1em"
                  xmlns="http://www.w3.org/2000/svg"
                  class="search_icon"
                >
                  <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"></path>
                </svg>
              </div>
              <input
                class="search_input"
                placeholder="search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* CATEGORY SORTING */}
          <div className="sortCategory">
            <form className="form">
              <label htmlFor="Category" className="label">
                Select Category:
              </label>
              <select
                name="cats"
                id="Category"
                className="sort"
                type="text"
                value={sortCategory}
                onChange={(e) => setSortCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="Balance">Balance</option>
                <option value="Place-Order,PlaceOrder-API">PlaceOrder</option>
                <option value="Pending-Order,PendingOrder">PendingOrder</option>
                <option value="Cancele-Order,CancelOrder">CancelOrder</option>
                <option value="Place-Order,FetchOrder">FetchOrder</option>
                <option value="Trades">Trades</option>
                <option value="Klines">Klines</option>
              </select>
            </form>
          </div>

          {/* LEVEL SORTING */}
          <div className="sortLevel">
            <form className="form">
              <label htmlFor="level" className="label">
                Select Level:
              </label>
              <select
                name="cats"
                id="level"
                className="sort"
                type="text"
                value={sortLevel}
                onChange={(e) => setSortLevel(e.target.value)}
              >
                <option value="">All Levels</option>
                <option value="INFO">INFO</option>
                <option value="ERROR">ERROR</option>
                <option value="DEBUG">DEBUG</option>
                <option value="WARN">WARN</option>
                <option value="CRITICAL">CRITICAL</option>
              </select>
            </form>
          </div>

          {/* DELETE BUTTONS */}
          <div id="btn">
            <button className="btn" onClick={clearSelectedLogs}>
              Delete Selected Logs
            </button>
            <button className="btn" onClick={clearLogs}>
              Delete All Logs
            </button>
          </div>
        </div>

        <div className="text">
          <p>AUDIT LOGS...</p>
        </div>

        {/* CONTAINER 2 */}
        <div id="content">
          <div id="ServiceLogs">
            {filteredMessages.length > 0 ? (
              filteredMessages.map((msg, index) => {
                if (!msg.formattedLog || !msg.level) return null;

                const colors = getColorByLogLevel(msg.level);
                const parts = msg.formattedLog.split(`[${msg.level}]`);

                return (
                  <p
                    key={index}
                    id="log"
                    style={{
                      color: colors.text,
                      backgroundColor: colors.background,
                    }}
                  >
                    <input
                      type="checkbox"
                      id="checkbox"
                      checked={selectedLogs.includes(index)}
                      onChange={() => handleCheckboxChange(index)}
                    />
                    {parts[0]}
                    <span style={{ color: colors.text }}>[{msg.level}]</span>
                    {parts[1]}
                  </p>
                );
              })
            ) : (
              <h2>No Log found....</h2> //IF NO LOGS THEN DISPLAYS THIS...
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;
