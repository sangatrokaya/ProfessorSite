import { useEffect, useState } from "react";
import api from "@/services/api";
import {
  GraduationCap,
  Youtube,
  FileText,
  Calendar,
  ExternalLink,
  Loader2,
  Search,
  Filter,
  BookOpen,
  Download,
} from "lucide-react";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("all");

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

  // Get unique semesters
  const semesters = [
    "all",
    ...new Set(courses.map((c) => c.semester).filter(Boolean)),
  ];

  // Filter courses
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSemester =
      selectedSemester === "all" || course.semester === selectedSemester;
    return matchesSearch && matchesSemester;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
          <p className="text-slate-600 dark:text-slate-400 font-medium">
            Loading courses...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
              <GraduationCap className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold mb-2">Courses</h1>
              <p className="text-blue-100 text-lg">
                Courses taught and coordinated by Asst. Prof. Bhim Rokaya
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-3xl font-bold">{courses.length}</div>
              <div className="text-blue-100 text-sm">Total Courses</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-3xl font-bold">
                {courses.filter((c) => c.youtubePlaylist).length}
              </div>
              <div className="text-blue-100 text-sm">Video Lectures</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-3xl font-bold">
                {courses.reduce(
                  (acc, c) => acc + (c.materials?.length || 0),
                  0,
                )}
              </div>
              <div className="text-blue-100 text-sm">Resources</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-3xl font-bold">{semesters.length - 1}</div>
              <div className="text-blue-100 text-sm">Semesters</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search courses by title or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Semester Filter */}
            <div className="relative sm:w-64">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer transition-all"
              >
                {semesters.map((sem) => (
                  <option key={sem} value={sem}>
                    {sem === "all" ? "All Semesters" : sem}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-400">
            Showing {filteredCourses.length} of {courses.length} courses
          </p>
        </div>

        {/* Courses Grid */}
        {filteredCourses.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full mb-6">
              <BookOpen className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-2xl font-semibold mb-2 text-slate-800 dark:text-slate-200">
              No courses found
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              {searchQuery
                ? "Try adjusting your search query"
                : "No courses available at the moment"}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
            {filteredCourses.map((course) => (
              <div
                key={course._id}
                className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 dark:border-slate-800 hover:-translate-y-2"
              >
                {/* Course Image */}
                <div className="relative h-56 overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-slate-800 dark:to-slate-700">
                  {course.image ? (
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="w-20 h-20 text-slate-300 dark:text-slate-600" />
                    </div>
                  )}

                  {/* Semester Badge */}
                  {course.semester && (
                    <div className="absolute top-4 right-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                        {course.semester}
                      </span>
                    </div>
                  )}
                </div>

                {/* Course Content */}
                <div className="p-6 space-y-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {course.title}
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-3 leading-relaxed">
                      {course.description}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3 pt-2">
                    {/* YouTube Playlist */}
                    {course.youtubePlaylist && (
                      <a
                        href={course.youtubePlaylist}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between gap-3 p-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/30 dark:to-pink-950/30 rounded-xl hover:from-red-100 hover:to-pink-100 dark:hover:from-red-950/50 dark:hover:to-pink-950/50 transition-all group/btn border border-red-100 dark:border-red-900"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-red-500 rounded-lg">
                            <Youtube className="w-5 h-5 text-white" />
                          </div>
                          <span className="font-medium text-red-700 dark:text-red-400">
                            Watch Video Lectures
                          </span>
                        </div>
                        <ExternalLink className="w-4 h-4 text-red-600 dark:text-red-400 group-hover/btn:translate-x-1 transition-transform" />
                      </a>
                    )}

                    {/* Course Materials */}
                    {course.materials && course.materials.length > 0 && (
                      <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-blue-600" />
                            <span className="font-medium text-slate-800 dark:text-slate-200">
                              Course Materials
                            </span>
                          </div>
                          <span className="text-sm text-slate-600 dark:text-slate-400 bg-slate-200 dark:bg-slate-700 px-3 py-1 rounded-full">
                            {course.materials.length} files
                          </span>
                        </div>
                        <div className="space-y-2">
                          {course.materials
                            .slice(0, 2)
                            .map((material, index) => (
                              <a
                                key={index}
                                href={material}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 p-2 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-colors group/material"
                              >
                                <Download className="w-4 h-4 text-slate-400 group-hover/material:text-blue-600 transition-colors" />
                                <span className="text-sm text-slate-600 dark:text-slate-400 group-hover/material:text-blue-600 transition-colors truncate flex-1">
                                  {material.split("/").pop() ||
                                    `Material ${index + 1}`}
                                </span>
                                <ExternalLink className="w-3 h-3 text-slate-400 opacity-0 group-hover/material:opacity-100 transition-opacity" />
                              </a>
                            ))}
                          {course.materials.length > 2 && (
                            <div className="text-xs text-slate-500 dark:text-slate-400 text-center pt-1">
                              +{course.materials.length - 2} more materials
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* No resources indicator */}
                    {!course.youtubePlaylist &&
                      (!course.materials || course.materials.length === 0) && (
                        <div className="text-center py-4 text-sm text-slate-400 dark:text-slate-600">
                          Course resources coming soon
                        </div>
                      )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;

// import { useEffect, useState } from "react";
// import api from "@/services/api";

// const Courses = () => {
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchCourses = async () => {
//       try {
//         const { data } = await api.get("/api/courses");
//         setCourses(data);
//       } catch (error) {
//         console.error("Failed to fetch courses!", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchCourses();
//   }, []);

//   if (loading) {
//     return <p>Loading Courses...</p>;
//   }

//   return (
//     <div className="max-w-5xl mx-auto space-y-10">
//       {/* HEADER */}
//       <section>
//         <h1 className="text-3xl font-bold mb-2">Courses</h1>
//         <p className="text-gray-600">
//           Courses taught and coordinated by Asst. Prof. Bhim Rokaya.
//         </p>
//       </section>

//       {/* COURSE LIST */}
//       <section className="grid md:grid-cols-2 gap-6">
//         {courses.length === 0 ? (
//           <p className="text-gray-500">No courses available at the momnet!</p>
//         ) : (
//           courses.map((course) => (
//             <div key={course._id} className="border p-5 rounded-md bg-gray-200">
//               <h2 className="text-lg font-semibold mb-1">{course.title}</h2>

//               {course.semester && (
//                 <p className="text-sm text-gray-500 mb-1">
//                   Course semester: {course.semester}
//                 </p>
//               )}
//               <p className="text-gray-700 text-sm">{course.description}</p>
//             </div>
//           ))
//         )}
//       </section>
//     </div>
//   );
// };

// export default Courses;
