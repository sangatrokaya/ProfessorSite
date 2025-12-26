import { useEffect, useState } from "react";
import api from "@/services/api";

const Papers = () => {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/api/papers");
        setPapers(data);
      } catch (error) {
        console.error("Failed to fetch courses: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPapers();
  }, []);

  const addPaperHandler = async () => {
    try {
      setLoading(true);
      const { data: newPaper } = await api.post("/api/papers", {
        title: "Sample Paper",
        authors: ["Professor"],
      });

      // Updae local state immediately
      setPapers((prevPapers) => [newPaper, ...prevPapers]);
    } catch (error) {
      console.error("Failed to add paper: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Papers & Publications</h2>
      <button
        className={`px-4 py-2 mb-4 text-white ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-black"
        }`}
        onClick={addPaperHandler}
        disabled={loading}
      >
        {loading ? "Processing.." : "Add Paper"}
      </button>

      {loading && papers.length === 0 ? (
        <p>Loading courses...</p>
      ) : (
        <ul className="sapce-y-2">
          {papers.map((paper) => (
            <li key={paper._id} className="bg-white p-3 shadow">
              {paper.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Papers;
