const TechnicianProfile = require("../models/TechnicianProfile");
const asyncHandler = require("../utils/asyncHandler");

// ── Search technicians by state / city (public) ──────────────────────
exports.getNearbyTechnicians = asyncHandler(async (req, res) => {
  const { state, city, serviceCategoryId, isAvailable, sortBy = "rating" } = req.query;

  if (!state) {
    return res.status(400).json({ success: false, message: "state query param is required" });
  }

  const filter = {
    approvalStatus: "approved",
    state: { $regex: new RegExp(`^${state}$`, "i") }, // case-insensitive match
  };

  if (city) {
    filter.city = { $regex: new RegExp(`^${city}$`, "i") };
  }
  if (serviceCategoryId) filter.serviceCategoryId = serviceCategoryId;
  if (isAvailable !== undefined) filter.isAvailable = isAvailable === "true";

  let sort = { averageRating: -1, completedJobs: -1 };
  if (sortBy === "experience") sort = { experienceYears: -1, averageRating: -1 };
  if (sortBy === "jobs") sort = { completedJobs: -1, averageRating: -1 };

  const technicians = await TechnicianProfile.find(filter)
    .populate("userId", "name avatarUrl")
    .populate("serviceCategoryId", "name slug")
    .sort(sort);

  res.json({
    success: true,
    count: technicians.length,
    data: technicians,
  });
});

// ── Get all technicians (admin or public approved list) ────────────
exports.getTechnicians = asyncHandler(async (req, res) => {
  const filter = {};

  // Non-admin only sees approved
  if (!req.user || req.user.role !== "admin") {
    filter.approvalStatus = "approved";
  }

  const technicians = await TechnicianProfile.find(filter)
    .populate("userId", "name email avatarUrl")
    .populate("serviceCategoryId", "name slug")
    .sort({ createdAt: -1 });

  res.json({ success: true, count: technicians.length, data: technicians });
});

// ── Get single technician profile (public) ─────────────────────────
exports.getTechnicianById = asyncHandler(async (req, res) => {
  const technician = await TechnicianProfile.findById(req.params.id)
    .populate("userId", "name email phone avatarUrl")
    .populate("serviceCategoryId", "name slug");

  if (!technician) {
    return res.status(404).json({ success: false, message: "Technician not found" });
  }

  res.json({ success: true, data: technician });
});

// ── Update own profile (technician) ────────────────────────────────
exports.updateProfile = asyncHandler(async (req, res) => {
  const { experienceYears, bio, address, state, city, serviceCategoryId } = req.body;

  const update = {};
  if (experienceYears !== undefined) update.experienceYears = experienceYears;
  if (bio !== undefined) update.bio = bio;
  if (address !== undefined) update.address = address;
  if (state !== undefined) update.state = state;
  if (city !== undefined) update.city = city;
  if (serviceCategoryId !== undefined) update.serviceCategoryId = serviceCategoryId;

  const profile = await TechnicianProfile.findOneAndUpdate({ userId: req.user._id }, update, {
    new: true,
    runValidators: true,
  }).populate("serviceCategoryId", "name slug");

  if (!profile) {
    return res.status(404).json({ success: false, message: "Technician profile not found" });
  }

  res.json({ success: true, message: "Profile updated", data: profile });
});

// ── Toggle availability (technician) ───────────────────────────────
exports.updateAvailability = asyncHandler(async (req, res) => {
  const { isAvailable } = req.body;

  const profile = await TechnicianProfile.findOneAndUpdate(
    { userId: req.user._id },
    { isAvailable },
    { new: true }
  );

  if (!profile) {
    return res.status(404).json({ success: false, message: "Technician profile not found" });
  }

  res.json({ success: true, message: `Availability set to ${isAvailable}`, data: profile });
});
