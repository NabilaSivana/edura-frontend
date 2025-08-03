// File: src/scripts/pages/admin/dashboard-admin-model.js
import CONFIG from "../../../config.js";
import Api from "../../../data/api.js";

const DashboardAdminModel = {
  async getAllStats() {
    try {
      // Use Promise.allSettled to handle potential failures gracefully
      const results = await Promise.allSettled([
        Api.getAllstudent(1, 1),
        Api.getAllteacher(1, 1),
        Api.getAlladmin(1, 1),
        this.getAllCourses({ page: 1, limit: 1 }) // Use admin endpoint for courses
      ]);

      // Extract results with error handling
      const students = results[0].status === 'fulfilled' ? results[0].value : null;
      const teachers = results[1].status === 'fulfilled' ? results[1].value : null;
      const admins = results[2].status === 'fulfilled' ? results[2].value : null;
      const courses = results[3].status === 'fulfilled' ? results[3].value : null;

      // Debug log to see the actual structure
      //console.log("API Responses:", {
        students,
        teachers,
        admins,
        courses
      });

      return {
        totalStudents: students?.pagination?.total || 0,
        totalTeachers: teachers?.pagination?.total || 0,
        totalAdmins: admins?.pagination?.total || 0,
        totalCourses: courses?.total || courses?.pagination?.total || 0 // Handle both response formats
      };
    } catch (error) {
      console.error("Error fetching stats:", error);
      return {
        totalStudents: 0,
        totalTeachers: 0,
        totalAdmins: 0,
        totalCourses: 0
      };
    }
  },

  async getAllCourses({ page = 1, limit = 10, search = "" } = {}) {
    const url = new URL(`${CONFIG.BASE_URL}/admin/courses`);
    url.searchParams.append("page", page);
    url.searchParams.append("limit", limit);
    if (search) url.searchParams.append("search", search);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch courses");
    }

    return await response.json();
  },

  async getPendingTeacherRequests() {
    try {
      const response = await Api.getTeacherRequests();

      // Handle both array response and object with data property
      const requests = Array.isArray(response) ? response : (response.data || []);

      // Filter only pending requests
      return requests.filter(req => req.status === 'pending') || [];
    } catch (error) {
      console.error("Error fetching teacher requests:", error);
      // Return empty array on error instead of throwing
      return [];
    }
  },

  async updateTeacherRequestStatus(id, status, rejectReason = null) {
    try {
      return await Api.updateTeacherRequestStatus(id, status, rejectReason);
    } catch (error) {
      console.error("Error updating teacher request status:", error);
      throw error;
    }
  },

  async getRecentActivities() {
    // This could be replaced with a real API endpoint if available
    try {
      // Fetch recent data for activities
      const [recentStudents, recentCourses] = await Promise.allSettled([
        Api.getAllstudent(1, 3), // Get 3 most recent students
        this.getAllCourses({ page: 1, limit: 3 }) // Get 3 most recent courses
      ]);

      const activities = [];

      // Add student activities - Fixed to properly access data
      if (recentStudents.status === 'fulfilled' && recentStudents.value?.data) {
        recentStudents.value.data.forEach(student => {
          activities.push({
            type: 'user',
            message: `Siswa baru mendaftar - ${student.full_name}`,
            time: 'Baru saja',
            icon: 'user'
          });
        });
      }

      // Add course activities - Fixed to properly access data
      if (recentCourses.status === 'fulfilled' && recentCourses.value?.data) {
        recentCourses.value.data.forEach(course => {
          activities.push({
            type: 'course',
            message: `Kursus "${course.title || course.subject || course.name}" ${course.is_verified ? 'telah diverifikasi' : 'dibuat'}`,
            time: 'Baru saja',
            icon: 'book'
          });
        });
      }

      // If no activities, show default
      if (activities.length === 0) {
        activities.push({
          type: 'info',
          message: 'Tidak ada aktivitas terbaru',
          time: 'Sekarang',
          icon: 'info'
        });
      }

      return activities.slice(0, 5); // Return only 5 most recent
    } catch (error) {
      console.error("Error fetching recent activities:", error);
      return [
        {
          type: 'info',
          message: 'Tidak dapat memuat aktivitas terbaru',
          time: 'Error',
          icon: 'error'
        }
      ];
    }
  }
};

export default DashboardAdminModel;