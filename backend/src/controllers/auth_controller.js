import authService from '../services/auth_service.js';

export const registerUser = async (req, res) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [AUTH REQUEST] POST /api/v1/auth/register - email: ${req.body.email}`);

  try {
    const result = await authService.register(req.body);
    console.log(`[${timestamp}] [AUTH SUCCESS] 201 Created - User registered: ${result.user.email}`);
    res.status(201).json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    console.error(`[${timestamp}] [AUTH ERROR] ${statusCode} - ${error.message}`);
    res.status(statusCode).json({ error: error.message || 'Server error' });
  }
};

export const loginUser = async (req, res) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [AUTH REQUEST] POST /api/v1/auth/login - email: ${req.body.email}`);

  try {
    const result = await authService.login(req.body);
    console.log(`[${timestamp}] [AUTH SUCCESS] 200 OK - User logged in: ${result.user.email}`);
    res.json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    console.error(`[${timestamp}] [AUTH ERROR] ${statusCode} - ${error.message}`);
    res.status(statusCode).json({ error: error.message || 'Server error' });
  }
};

export const getMe = async (req, res) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [AUTH REQUEST] GET /api/v1/auth/me - userId: ${req.user.id}`);

  try {
    const user = await authService.getMe(req.user.id);
    console.log(`[${timestamp}] [AUTH SUCCESS] 200 OK - User profile retrieved`);
    res.json(user);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    console.error(`[${timestamp}] [AUTH ERROR] ${statusCode} - ${error.message}`);
    res.status(statusCode).json({ error: error.message || 'Server error' });
  }
};

export const updateProfile = async (req, res) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [AUTH REQUEST] PUT /api/v1/auth/profile - userId: ${req.user.id}`);

  try {
    const updatedUser = await authService.updateProfile(req.user.id, req.body);
    console.log(`[${timestamp}] [AUTH SUCCESS] 200 OK - User profile updated: ${updatedUser.email}`);
    res.json(updatedUser);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    console.error(`[${timestamp}] [AUTH ERROR] ${statusCode} - ${error.message}`);
    res.status(statusCode).json({ error: error.message || 'Server error' });
  }
};
