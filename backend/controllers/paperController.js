import Paper from "../models/Paper.js";

// @desc Get all papers
// @route GET /api/papers
// @access Public
export const getPapers = async (req, res) => {
  const papers = await Paper.find().sort({ year: -1 });
  res.json(papers);
};

// @desc Create paper
// @route POST /api/papers
// @access Admin
export const createPaper = async (req, res) => {
  const { title, authors, journal, year, link } = req.body;

  const paper = new Paper({
    title,
    authors,
    journal,
    year,
    link,
  });

  const createdPaper = await paper.save();
  res.status(201).json(createdPaper);
};

// @desc Delete paper
// @route DELETE /api/papers/:id
// @access Admin
export const deletePaper = async (req, res) => {
  const paper = await Paper.findById(req.params.id);

  if (paper) {
    await paper.deleteOne();
    res.json({ message: "Paper removed successfully..." });
  } else {
    res.status(404).json({ message: "Paper not found!" });
  }
};
