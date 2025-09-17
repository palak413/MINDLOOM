 // src/middlewares/role.middleware.js
import { apiError } from '../utils/apiError.js';

// This is a higher-order function that takes roles as arguments
// and returns a middleware function.
export const roleMiddleware = (...requiredRoles) => {
  return (req, _, next) => {
    // Assumes authMiddleware has already run and attached req.user
    if (!req.user) {
      throw new apiError(401, "Unauthorized. Please log in.");
    }

    // You would need to add a 'role' field to your User.model.js
    // For example: role: { type: String, enum: ['user', 'admin'], default: 'user' }
    const userRole = req.user.role;

    if (!requiredRoles.includes(userRole)) {
      throw new apiError(
        403,
        "Forbidden: You do not have the necessary permissions to access this resource."
      );
    }
    
    next();
  };
};

/*
 * HOW TO USE IT IN A ROUTE:
 * import { roleMiddleware } from '../middlewares/role.middleware.js';
 *
 * router.route('/dashboard').get(authMiddleware, roleMiddleware('admin'), getAdminDashboard);
 * router.route('/reports').get(authMiddleware, roleMiddleware('admin', 'moderator'), getSpecialReports);
*/