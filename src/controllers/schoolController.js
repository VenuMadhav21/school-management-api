const pool = require('../config/db');
const { z } = require('zod');

// Validation schema for addSchool
const addSchoolSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
  latitude: z.number().min(-90).max(90, "Invalid latitude"),
  longitude: z.number().min(-180).max(180, "Invalid longitude"),
});

// Validation schema for listSchools
const listSchoolsSchema = z.object({
  latitude: z.string().refine((val) => !isNaN(parseFloat(val)), "Invalid latitude"),
  longitude: z.string().refine((val) => !isNaN(parseFloat(val)), "Invalid longitude"),
});

// Haversine formula to calculate distance between two coordinates
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

exports.addSchool = async (req, res) => {
  try {
    // Validate input
    const validatedData = addSchoolSchema.parse(req.body);

    // Insert into database
    const [result] = await pool.execute(
      'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)',
      [validatedData.name, validatedData.address, validatedData.latitude, validatedData.longitude]
    );

    res.status(201).json({
      message: 'School added successfully',
      schoolId: result.insertId
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    console.error('Error adding school:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.listSchools = async (req, res) => {
  try {
    // Validate query parameters
    const validatedQuery = listSchoolsSchema.parse(req.query);
    const userLat = parseFloat(validatedQuery.latitude);
    const userLon = parseFloat(validatedQuery.longitude);

    // Fetch all schools from the database
    const [schools] = await pool.execute('SELECT * FROM schools');

    // Calculate distance and sort
    const schoolsWithDistance = schools.map(school => {
      const distance = calculateDistance(userLat, userLon, school.latitude, school.longitude);
      return { ...school, distance };
    });

    schoolsWithDistance.sort((a, b) => a.distance - b.distance);

    res.status(200).json(schoolsWithDistance);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    console.error('Error listing schools:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
