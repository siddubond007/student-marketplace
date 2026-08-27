const fs = require('fs');

const targetPath = 'backend/src/controllers/jobController.js';
let code = fs.readFileSync(targetPath, 'utf8');

const newGetJobsAPI = `// 3. GET PUBLIC JOBS (Enterprise Discovery API with Multifaceted Filtering)
exports.getJobs = async (req, res) => {
  try {
    const { q, minBudget, maxBudget, type, skills, page = 1, limit = 20 } = req.query;

    // Base constraints
    let where = {
      isOpen: true,
      status: 'OPEN'
    };

    // Full-Text Search
    if (q) {
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } }
      ];
    }

    // Budget Range constraints
    if (minBudget || maxBudget) {
      where.budget = {};
      if (minBudget) where.budget.gte = parseFloat(minBudget);
      if (maxBudget) where.budget.lte = parseFloat(maxBudget);
    }

    // Project Type (e.g., HOURLY, FIXED)
    if (type) {
      const typesArray = type.split(',').map(t => t.trim());
      where.projectType = { in: typesArray };
    }

    // Multi-Skill Matching
    if (skills) {
      const skillsArray = skills.split(',').map(s => s.trim());
      where.skills = { hasSome: skillsArray };
    }

    // Pagination calculations
    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);
    const skip = (pageNumber - 1) * pageSize;

    // Execute parallel queries for optimal performance
    const [jobs, totalJobs] = await Promise.all([
      prisma.job.findMany({
        where,
        include: {
          client: { select: { id: true, fullName: true, profile: true } },
          bids: { select: { id: true } } // Only need bid counts for the feed
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize
      }),
      prisma.job.count({ where })
    ]);

    res.json({
      jobs,
      pagination: {
        total: totalJobs,
        page: pageNumber,
        limit: pageSize,
        totalPages: Math.ceil(totalJobs / pageSize)
      }
    });
  } catch (err) {
    console.error('Error in Enterprise getJobs:', err);
    res.status(500).json({ error: err.message });
  }
};
`;

// Replace the old getJobs function via Regex boundary targeting
const regex = /\/\/ 3\. GET PUBLIC JOBS[\s\S]*?(?=\/\/ 4\. GET CLIENT'S DRAFTS ONLY)/;

if (regex.test(code)) {
  code = code.replace(regex, newGetJobsAPI + '\n');
  fs.writeFileSync(targetPath, code);
  console.log('✅ Successfully upgraded getJobs API endpoint for enterprise filtering!');
} else {
  console.error('❌ Error: Could not find the target code block. Ensure the file has not been modified.');
}
