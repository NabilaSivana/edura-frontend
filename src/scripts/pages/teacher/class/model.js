// File: routes/class/teacher-class-model.js - Enhanced Version (FIXED)
import Api from '../../../data/api.js';

const TeacherClassModel = {
  // Cache untuk mengurangi API calls
  cache: {
    classes: null,
    students: new Map(),
    lastFetch: null,
    CACHE_DURATION: 5 * 60 * 1000 // 5 menit
  },

  // Check if cache is valid
  isCacheValid() {
    return this.cache.lastFetch &&
      (Date.now() - this.cache.lastFetch) < this.cache.CACHE_DURATION;
  },

  // Clear cache
  clearCache() {
    this.cache.classes = null;
    this.cache.students.clear();
    this.cache.lastFetch = null;
  },

  // Get classes with caching
  async getClasses(forceRefresh = false) {
    try {
      // Return cached data if valid and not forced refresh
      if (!forceRefresh && this.isCacheValid() && this.cache.classes) {
        console.log('[Model] Returning cached classes');
        return this.cache.classes;
      }

      console.log('[Model] Fetching classes from API');
      const classes = await Api.getTeacherClasses();

      // Update cache
      this.cache.classes = classes;
      this.cache.lastFetch = Date.now();

      return classes || [];
    } catch (error) {
      console.error('[Model] Error fetching classes:', error);
      // Return cached data if available during error
      if (this.cache.classes) {
        console.log('[Model] Returning cached data due to error');
        return this.cache.classes;
      }
      throw error;
    }
  },

  // Create class - FIXED: Send correct field name
  async createClass(data) {
    try {
      // Validate data
      if (!data.name || !data.name.trim()) {
        throw new Error('Nama kelas tidak boleh kosong');
      }

      // 🔧 FIX: Backend expects 'name' field, not 'class_name'
      const result = await Api.createTeacherClass({
        name: data.name.trim() // Backend expects 'name' field
      });

      // Clear cache to force refresh
      this.clearCache();

      return result;
    } catch (error) {
      console.error('[Model] Error creating class:', error);
      throw error;
    }
  },

  // Update class - FIXED: Send correct field name
  async updateClass(classId, data) {
    try {
      // Validate data
      if (!classId) {
        throw new Error('ID kelas tidak valid');
      }

      if (!data.name || !data.name.trim()) {
        throw new Error('Nama kelas tidak boleh kosong');
      }

      // 🔧 FIX: Backend expects 'name' field, not 'class_name'
      const result = await Api.updateTeacherClass(classId, {
        name: data.name.trim() // Backend expects 'name' field
      });

      // Update cache if exists
      if (this.cache.classes) {
        const index = this.cache.classes.findIndex(c => c.id === classId);
        if (index !== -1) {
          this.cache.classes[index] = {
            ...this.cache.classes[index],
            name: data.name.trim() // Update the displayed name
          };
        }
      }

      return result;
    } catch (error) {
      console.error('[Model] Error updating class:', error);
      throw error;
    }
  },

  // Delete class
  async deleteClass(classId) {
    try {
      if (!classId) {
        throw new Error('ID kelas tidak valid');
      }

      const result = await Api.deleteTeacherClass(classId);

      // Remove from cache
      if (this.cache.classes) {
        this.cache.classes = this.cache.classes.filter(c => c.id !== classId);
      }
      this.cache.students.delete(classId);

      return result;
    } catch (error) {
      console.error('[Model] Error deleting class:', error);
      throw error;
    }
  },

  // Get class students with caching
  async getClassStudents(classId) {
    try {
      if (!classId) {
        throw new Error('ID kelas tidak valid');
      }

      // Check cache first
      if (this.cache.students.has(classId)) {
        console.log(`[Model] Returning cached students for class ${classId}`);
        return this.cache.students.get(classId);
      }

      console.log(`[Model] Fetching students for class ${classId} from API`);
      const students = await Api.getClassStudents(classId);

      // Cache the result
      this.cache.students.set(classId, students || []);

      return students || [];
    } catch (error) {
      console.error('[Model] Error fetching students:', error);
      // Return empty array on error
      return [];
    }
  },

  // Remove student from class
  async removeStudent(classId, studentId) {
    try {
      if (!classId || !studentId) {
        throw new Error('ID kelas atau mahasiswa tidak valid');
      }

      const result = await Api.removeStudentFromClass(classId, studentId);

      // Update cache
      if (this.cache.students.has(classId)) {
        const students = this.cache.students.get(classId);
        this.cache.students.set(
          classId,
          students.filter(s => s.id !== studentId)
        );
      }

      return result;
    } catch (error) {
      console.error('[Model] Error removing student:', error);
      throw error;
    }
  },

  // Get class statistics
  async getClassStatistics() {
    try {
      const classes = await this.getClasses();
      let totalStudents = 0;
      let maxStudents = 0;
      let minStudents = Infinity;

      for (const cls of classes) {
        const students = await this.getClassStudents(cls.id);
        const count = students.length;
        totalStudents += count;
        maxStudents = Math.max(maxStudents, count);
        minStudents = Math.min(minStudents, count);
      }

      const avgStudents = classes.length > 0
        ? Math.round(totalStudents / classes.length)
        : 0;

      return {
        totalClasses: classes.length,
        totalStudents,
        avgStudentsPerClass: avgStudents,
        maxStudentsInClass: maxStudents === -Infinity ? 0 : maxStudents,
        minStudentsInClass: minStudents === Infinity ? 0 : minStudents
      };
    } catch (error) {
      console.error('[Model] Error calculating statistics:', error);
      return {
        totalClasses: 0,
        totalStudents: 0,
        avgStudentsPerClass: 0,
        maxStudentsInClass: 0,
        minStudentsInClass: 0
      };
    }
  },

  // Search classes
  searchClasses(searchTerm) {
    if (!this.cache.classes) return [];

    const term = searchTerm.toLowerCase().trim();
    if (!term) return this.cache.classes;

    return this.cache.classes.filter(cls =>
      cls.name.toLowerCase().includes(term) ||
      cls.class_code.toLowerCase().includes(term) ||
      cls.perguruan_tinggi.toLowerCase().includes(term)
    );
  },

  // Export class data (placeholder for future implementation)
  async exportClassData(classId, format = 'csv') {
    try {
      const cls = this.cache.classes?.find(c => c.id === classId);
      if (!cls) throw new Error('Kelas tidak ditemukan');

      const students = await this.getClassStudents(classId);

      // TODO: Implement actual export logic
      console.log(`[Model] Exporting class ${cls.name} in ${format} format`);

      return {
        success: true,
        message: 'Export berhasil',
        data: { class: cls, students }
      };
    } catch (error) {
      console.error('[Model] Error exporting data:', error);
      throw error;
    }
  }
};

export default TeacherClassModel;