import { useEffect, useState } from "react";
import api from "@/services/api";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await api.get("/api/courses");
        setCourses(data);
      } catch (error) {
        console.error("Failed to fetch courses!", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) {
    return <p>Loading Courses...</p>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      {/* HEADER */}
      <section>
        <h1 className="text-3xl font-bold mb-2">Courses</h1>
        <p className="text-gray-600">
          Courses taught and coordinated by Asst. Prof. Bhim Rokaya.
        </p>
      </section>

      {/* COURSE LIST */}
      <section className="grid md:grid-cols-2 gap-6">
        {courses.length === 0 ? (
          <p className="text-gray-500">No courses available at the momnet!</p>
        ) : (
          courses.map((course) => (
            <div key={course._id} className="border p-5 rounded-md bg-gray-200">
              <h2 className="text-lg font-semibold mb-1">{course.title}</h2>

              {course.semester && (
                <p className="text-sm text-gray-500 mb-1">
                  Course semester: {course.semester}
                </p>
              )}
              <p className="text-gray-700 text-sm">{course.description}</p>
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default Courses;
