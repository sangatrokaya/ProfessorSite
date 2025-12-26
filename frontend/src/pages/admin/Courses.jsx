import { useEffect, useState } from "react";
import api from "@/services/api";

const courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/api/courses");
        setCourses(data);
      } catch (error) {
        console.error("Failed to fetch courses: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Add course (No reload)
  const addCourseHandler = async () => {
    try {
      setLoading(true);

      const { data: newCourse } = await api.post("/api/courses", {
        title: "Sample Course",
        description: "Course Description",
        semester: "Spring 2025",
      });

      // Update local state immediately
      setCourses((prevCourses) => [newCourse, ...prevCourses]);
    } catch (error) {
      console.error("Failed to add course: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Courses</h2>
      <button
        className={`px-4 py-2 mb-4 text-white ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-black"
        }`}
        onClick={addCourseHandler}
        disabled={loading}
      >
        {loading ? "Processing..." : "Add Course"}
      </button>

      {loading && courses.length === 0 ? (
        <p>Loading courses...</p>
      ) : (
        <ul className="space-y-2">
          {courses.map((course) => (
            <li key={course._id} className="bg-white p-3 shadow">
              <p className="font-semibold">{course.title}</p>
              <p className="text-sm text-gray-600">{course.semester}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default courses;
