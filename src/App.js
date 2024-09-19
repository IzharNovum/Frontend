// import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Container from "./Components/Container/Container.jsx";
import Loader from "./Components/Loader/Loader.jsx";


function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Loader/>} />
          <Route path="/log" element={<Container/>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
