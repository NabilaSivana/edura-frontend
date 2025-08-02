// src/scripts/pages/admin/manage-courses/model.js
import CONFIG from "../../../config.js";
import Api from "../../../data/api.js";

const AdminCourseModel = {
  // Get all courses with pagination and search
  async getAllCourses({ page = 1, limit = 10, search = "", level = "", subject = "", program_studi = "" } = {}) {
    const params = { page, limit };

    // Add search parameter
    if (search && search.trim()) {
      params.search = search.trim();
    }

    // Note: Backend tidak support filter level, subject, program_studi di query string
    // Kita akan filter di frontend untuk sementara
    const result = await Api.getAdminCourses(params);

    if (!result || !result.data) {
      return { data: [], total: 0, page: 1, totalPages: 1 };
    }

    let filteredData = result.data;

    // Filter di frontend jika diperlukan
    if (level) {
      filteredData = filteredData.filter(course => course.level === level);
    }

    if (subject) {
      filteredData = filteredData.filter(course => course.subject === subject);
    }

    if (program_studi) {
      filteredData = filteredData.filter(course => course.program_studi === program_studi);
    }

    return {
      data: filteredData,
      total: filteredData.length,
      page: result.page || page,
      totalPages: result.totalPages || 1
    };
  },

  // Get course detail with sessions
  async getCourseDetail(courseId) {
    return await Api.getAdminCourseDetail(courseId);
  },

  // Update course
  async updateCourse(courseId, updateData) {
    return await Api.updateAdminCourse(courseId, updateData);
  },

  // Delete course
  async deleteCourse(courseId) {
    return await Api.deleteAdminCourse(courseId);
  },

  // Export courses to CSV
  async exportCourses() {
    return await Api.exportAdminCourses();
  },

  // Get course statistics
  async getCourseStatistics() {
    try {
      const stats = await Api.getAdminCourseStatistics();
      return {
        total: stats.totalCourses || 0,
        active: stats.verifiedCourses || 0, // Gunakan verified sebagai "active"
        draft: stats.unverifiedCourses || 0, // Gunakan unverified sebagai "draft"
        totalStudents: 0, // Backend belum provide ini
        thisMonth: stats.thisMonthCourses || 0
      };
    } catch (error) {
      console.error('Error getting course statistics:', error);
      return {
        total: 0,
        active: 0,
        draft: 0,
        totalStudents: 0,
        thisMonth: 0
      };
    }
  },

  // Get unique subjects for filter (menggunakan dedicated endpoint)
  async getUniqueSubjects() {
    try {
      // Gunakan endpoint khusus jika tersedia
      const response = await fetch(`${CONFIG.BASE_URL}/admin/courses/subjects`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        return await response.json();
      }

      // Fallback: ambil dari courses biasa
      const { data } = await Api.getAdminCourses({ page: 1, limit: 50 });

      if (!data || !Array.isArray(data)) {
        return [];
      }

      const subjects = [...new Set(data.map(course => course.subject).filter(Boolean))];
      return subjects.sort();
    } catch (error) {
      console.error('Error getting unique subjects:', error);
      return [];
    }
  },

  // Get unique program studi for filter (menggunakan dedicated endpoint)
  async getUniqueProgramStudi() {
    try {
      // Gunakan endpoint khusus jika tersedia
      const response = await fetch(`${CONFIG.BASE_URL}/admin/courses/programs`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        return await response.json();
      }

      // Fallback: ambil dari courses biasa
      const { data } = await Api.getAdminCourses({ page: 1, limit: 50 });

      if (!data || !Array.isArray(data)) {
        return [];
      }

      const programStudi = [...new Set(data.map(course => course.program_studi).filter(Boolean))];
      return programStudi.sort();
    } catch (error) {
      console.error('Error getting unique program studi:', error);
      return [];
    }
  },

  // Create new course (jika diperlukan di masa depan)
  async createCourse(courseData) {
    try {
      // Note: Backend belum ada endpoint untuk create course
      // Implementasikan jika diperlukan
      throw new Error('Create course endpoint not available');
    } catch (error) {
      console.error('Error creating course:', error);
      throw error;
    }
  }
};

export default AdminCourseModel;