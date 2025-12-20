import Course from "../models/Course.js";

// @desc Get all courses
// @route GET /api/courses
// @access Public
export const getCourses = async (req, res) => {
  const courses = await Course.find().sort({ createdAt: -1 });
  res.json(courses);
};

// @desc Create course
// @route POST /api/courses
// @access Admin
export const createCourse = async (req, res) => {
  const { title, description, semester, materials } = req.body;

  const course = new Course({
    title,
    description,
    semester,
    materials,
  });

  const createdCourse = await course.save();
  res.status(201).json(createdCourse);
};

// @desc Delete course
// @route DELETE /api/courses/:id
// @access Admin
export const deleteCourse = async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (course) {
    await course.deleteOne();
    res.json({ message: "Course removed successfully..." });
  } else {
    res.status(404).json({ message: "Course not found!" });
  }
};
