// src/scripts/pages/admin/manage-user/model.js
import Api from "../../../data/api.js";

const ManageUserModel = {
  // Get users by role with pagination
  async getAllstudent({ page = 1, limit = 10, search = "" }) {
    return await Api.getAllstudent(page, limit, search);
  },

  async getAllteacher({ page = 1, limit = 10, search = "" }) {
    return await Api.getAllteacher(page, limit, search);
  },

  async getAlladmin({ page = 1, limit = 10, search = "" }) {
    return await Api.getAlladmin(page, limit, search);
  },

  // Get user by ID
  async getUserById(userId) {
    return await Api.getUserById(userId);
  },

  // Create new user
  async createUser(userData) {
    return await Api.createUser(userData);
  },

  // Update user
  async updateUser(userId, updateData) {
    return await Api.updateUser(userId, updateData);
  },

  // Delete user
  async deleteUser(userId) {
    return await Api.deleteUser(userId);
  },

  // Reset password
  async resetUserPassword(userId, options) {
    return await Api.resetUserPassword(userId, options);
  },

  // Import users from CSV
  async importUsers(file) {
    return await Api.importUsers(file);
  },

  // Export users to CSV
  async exportUsers(role) {
    return await Api.exportUsers(role);
  },

  // Get users by role for statistics
  async getUserStatistics() {
    try {
      const [students, teachers, admins] = await Promise.all([
        this.getAllstudent({ page: 1, limit: 1, search: "" }),
        this.getAllteacher({ page: 1, limit: 1, search: "" }),
        this.getAlladmin({ page: 1, limit: 1, search: "" })
      ]);

      return {
        totalUsers: (students.pagination?.total || 0) + 
                   (teachers.pagination?.total || 0) + 
                   (admins.pagination?.total || 0),
        students: students.pagination?.total || 0,
        teachers: teachers.pagination?.total || 0,
        admins: admins.pagination?.total || 0
      };
    } catch (error) {
      console.error('Error getting user statistics:', error);
      return {
        totalUsers: 0,
        students: 0,
        teachers: 0,
        admins: 0
      };
    }
  }
};

export default ManageUserModel;