const { Startup, User } = require('../models/usermodel');

// GET /api/startups - List all startups with optional filters
exports.getStartups = async (req, res) => {
  try {
    const { domain, stage, search, page = 1, limit = 20 } = req.query;
    const filter = { userType: 'STARTUP', profileCompleted: true };

    if (domain) filter.domains = { $in: domain.split(',') };
    if (stage) filter.stage = stage;
    if (search) {
      filter.$or = [
        { companyName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [startups, total] = await Promise.all([
      Startup.find(filter)
        .select('-password')
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 }),
      Startup.countDocuments(filter),
    ]);

    // Shape data for frontend
    const shaped = startups.map(s => ({
      id: s._id,
      name: s.companyName,
      tagline: s.description?.substring(0, 100),
      domains: s.domains || [],
      fundingStage: s.stage || 'IDEA',
      growthRate: s.metrics?.growthRate || 0,
      teamSize: s.teamSize || 1,
      valuation: s.funding?.totalRaised || 0,
      description: s.description,
      foundedYear: s.createdAt ? new Date(s.createdAt).getFullYear() : new Date().getFullYear(),
      location: s.location ? `${s.location.city || ''}, ${s.location.country || ''}` : 'Remote',
      website: '',
      stats: {
        revenue: s.metrics?.monthlyRevenue || 0,
        users: s.metrics?.userBase || 0,
        retention: 0,
        mrrGrowth: s.metrics?.growthRate || 0,
        burnRate: s.metrics?.burnRate || 0,
      },
      team: (s.teamMembers || []).map(t => ({
        name: t.name,
        role: t.role,
        linkedin: t.linkedIn,
      })),
      documents: [],
      traction: [],
    }));

    res.json({ startups: shaped, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (error) {
    console.error('Error fetching startups:', error);
    res.status(500).json({ message: error.message });
  }
};

// GET /api/startups/:id - Get single startup detail
exports.getStartupById = async (req, res) => {
  try {
    const startup = await Startup.findById(req.params.id).select('-password');
    if (!startup || startup.userType !== 'STARTUP') {
      return res.status(404).json({ message: 'Startup not found' });
    }

    res.json({
      id: startup._id,
      name: startup.companyName,
      tagline: startup.description?.substring(0, 100),
      domains: startup.domains || [],
      fundingStage: startup.stage || 'IDEA',
      growthRate: startup.metrics?.growthRate || 0,
      teamSize: startup.teamSize || 1,
      valuation: startup.funding?.totalRaised || 0,
      description: startup.description,
      foundedYear: startup.createdAt ? new Date(startup.createdAt).getFullYear() : new Date().getFullYear(),
      location: startup.location ? `${startup.location.city || ''}, ${startup.location.country || ''}` : 'Remote',
      stats: {
        revenue: startup.metrics?.monthlyRevenue || 0,
        users: startup.metrics?.userBase || 0,
        retention: 0,
        mrrGrowth: startup.metrics?.growthRate || 0,
        burnRate: startup.metrics?.burnRate || 0,
      },
      team: (startup.teamMembers || []).map(t => ({
        name: t.name,
        role: t.role,
        experience: '',
        linkedin: t.linkedIn,
      })),
      funding: startup.funding || {},
      metrics: startup.metrics || {},
    });
  } catch (error) {
    console.error('Error fetching startup:', error);
    res.status(500).json({ message: error.message });
  }
};
