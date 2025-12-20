import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "@/services/api";

const courses = () => {
  const [courses, setCourses] = useState([]);
  const { adminInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchCourses = async () => {
      const { data } = await api.get("/api/courses");
      setCourses(data);
    };
    fetchCourses();
  }, []);

  const addCourseHandler = async () => {
    await api.post(
      "/api/courses",
      {
        title: "Sample Course",
        description: "Course Description",
        semester: "Spring 2025",
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
      <h2 className="text-xl font-bold mb-4">Courses</h2>
      <button
        className="bg-black text-white px-4 py-2 mb-4"
        onClick={addCourseHandler}
      >
        Add Course
      </button>

      <ul className="space-y-2">
        {courses.map((course) => (
          <li key={course._id} className="bg-white p-3 shadow">
            <p className="font-semibold">{course.title}</p>
            <p className="text-sm text-gray-600">{course.semester}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default courses;
