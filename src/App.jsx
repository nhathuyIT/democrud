import Navbar from "./page/Navbar";
import { Route, Routes } from "react-router-dom";
import Home from "./page/Home";
import AllLessons from "./page/all-lessons";
import CompletedLessions from "./page/completed-lessions";
import LessionDetail from "./page/lessons-details";
import CreateLessons from "./page/create-lessons";
import EditLession from "./page/edit-lessions";

function App() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 16 }}>
      <Navbar />
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/se180003/all-lessons" element={<AllLessons />} />
        <Route
          path="/se180003/completed-lessons"
          element={<CompletedLessions />}
        />
        <Route path="/se180003/lessons/:lessonId" element={<LessionDetail />} />
        <Route path="/se180003/add-lesson" element={<CreateLessons />} />
        <Route
          path="/se180003/edit-lesson/:lessonId"
          element={<EditLession />}
        />
      </Routes>
    </div>
  );
}

export default App;
