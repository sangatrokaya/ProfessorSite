import { useEffect, useState } from "react";
import api from "@/services/api";
import { useSelector } from "react-redux";

const Papers = () => {
  const [papers, setPapers] = useState([]);
  const { adminInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchPapers = async () => {
      const { data } = await api.get("/api/papers");
      setPapers(data);
    };
    fetchPapers();
  }, []);

  const addPaperHandler = async () => {
    await api.post(
      "/api/papers",
      {
        title: "Sample Paper",
        authors: ["Professor"],
      },
      {
        headers: {
          Authorization: `Bearer ${adminInfo.token}`,
        },
      }
    );
    window.location.reload();
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Papers & Publications</h2>
      <button
        className="bg-black text-white px-4 py-2 mb-4"
        onClick={addPaperHandler}
      >
        Add
      </button>

      <ul className="sapce-y-2">
        {papers.map((paper) => (
          <li key={paper._id} className="bg-white p-3 shadow">
            {paper.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Papers;
