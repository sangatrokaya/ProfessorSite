import { useEffect, useState } from "react";
import api from "@/services/api";
import { SpaceIcon } from "lucide-react";

const Papers = () => {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        const { data } = await api.get("/api/papers");
        setPapers(data);
      } catch (error) {
        console.error("Failed to fetch papers!", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPapers();
  }, []);

  if (loading) {
    return <p>Loading Pubs...</p>;
  }
  return (
    <div className="max-w-5xl mx-auto space-y-10">
      {/* PAGE TITLE */}
      <section>
        <h1 className="text-3xl font-bold mb-2">Papers & Publications</h1>
        <p className="text-gray-600">
          A selection of academic papers and research publications.
        </p>
      </section>

      {/* PAPERS LIST */}
      <section className="space-y-6">
        {papers.length === 0 ? (
          <p className="text-gray-500">No publications available.</p>
        ) : (
          papers.map((paper) => (
            <div className="border-b pb-4">
              <h2 className="text-lg font-semibold">{paper.title}</h2>

              {/* AUTHORS */}
              {paper.authors && (
                <p className="text-sm text-gray-700">
                  {paper.authors.join(",")}
                </p>
              )}

              {/* JOURNAL + YEAR */}
              <p className="text-sm text-gray-600">
                {paper.journal && <span>{paper.journal}</span>}
                {paper.journal && paper.year && " • "}
                {paper.journal && <span>{paper.year}</span>}
              </p>

              {/* LINK */}
              {paper.link && (
                <a
                  href={paper.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm underline inline-block mt-1"
                >
                  View Publication
                </a>
              )}
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default Papers;
