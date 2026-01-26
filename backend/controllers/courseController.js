import Course from "../models/Course.js";

// @desc Get all courses
// @route GET /api/courses
// @access Public
export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch courses!" });
  }
};

// @desc Create course
// @route POST /api/courses
// @access Admin
export const createCourse = async (req, res) => {
  try {
    const { title, description, semester, image, youtubePlaylist, materials } =
      req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const course = new Course({
      title,
      description,
      semester,
      image,
      youtubePlaylist,
      materials: Array.isArray(materials) ? materials : [],
    });

    const createdCourse = await course.save();
    res.status(201).json(createdCourse);
  } catch (error) {
    res.status(500).json({ message: "Failed to create course." });
  }
};

// @desc Update course
// @route PUT /api/courses/:id
// @access Admin
export const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found!" });
    }

    const { title, description, semester, image, youtubePlaylist, materials } =
      req.body;

    course.title = title ?? course.title;
    course.description = description ?? course.description;
    course.semester = semester ?? course.semester;
    course.image = image ?? course.image;
    course.youtubePlaylist = youtubePlaylist ?? course.youtubePlaylist;
    course.materials = Array.isArray(materials) ? materials : course.materials;

    const updatedCourse = await course.save();
    res.json(updatedCourse);
  } catch (error) {
    res.status(500).json({ message: "Failed to update course!" });
  }
};

// @desc Delete course
// @route DELETE /api/courses/:id
// @access Admin
export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (course) {
      await course.deleteOne();
      res.json({ message: "Course removed successfully..." });
    } else {
      res.status(404).json({ message: "Course not found!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to delete course!" });
  }
};
