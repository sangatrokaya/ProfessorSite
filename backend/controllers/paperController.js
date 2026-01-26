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

// @desc Update paper
// @route PUT /api/papers/:id
// @access Admin
export const updatePaper = async (req, res) => {
  try {
    const { title, authors, journal, year, link } = req.body;

    // Find paper by ID
    const paper = await Paper.findById(req.params.id);

    if (!paper) {
      return res.status(404).json({ message: "Paper not found!" });
    }

    // Update fields(only if provided)
    paper.title = title || paper.title;
    paper.authors = authors || paper.authors;
    paper.journal = journal || paper.journal;
    paper.year = year || paper.year;
    paper.link = link || paper.link;

    const updatedPaper = await paper.save();
    res.json(updatePaper);
  } catch (error) {
    res.status(500).json({ message: "Failed to update paper", error });
  }
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
