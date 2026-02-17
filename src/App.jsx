import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreatePoll from "./pages/CreatePoll";
import PollPage from "./pages/PollPage";

function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<CreatePoll />} />
          <Route path="/poll/:pollId" element={<PollPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;