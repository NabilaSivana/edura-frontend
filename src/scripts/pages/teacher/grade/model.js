// FILE: model.js - Enhanced with Cache Management and Refresh
import CONFIG from "../../../config.js";
import Api from "../../../data/api.js";

const TeacherGradeModel = {
  // Cache untuk optimasi performa
  cache: {
    classes: null,
    students: new Map(), // classId -> students data
    lastFetch: null,
    CACHE_DURATION: 5 * 60 * 1000 // 5 menit
  },

  // Check if cache is valid
  isCacheValid() {
    return this.cache.lastFetch &&
      (Date.now() - this.cache.lastFetch < this.cache.CACHE_DURATION);
  },

  // Clear cache
  clearCache() {
    //console.log("🧹 Clearing teacher grade cache...");
    this.cache.classes = null;
    this.cache.students.clear();
    this.cache.lastFetch = null;
    //console.log("✅ Teacher grade cache cleared");
  },

  // Clear specific class cache
  clearClassCache(classId) {
    //console.log(`🧹 Clearing cache for class ${classId}...`);
    this.cache.students.delete(classId);
    //console.log(`✅ Cache cleared for class ${classId}`);
  },

  /**
   * Get teacher classes with caching support
   */
  async getClasses(forceRefresh = false) {
    try {
      // Return cached data if valid and not forced refresh
      if (!forceRefresh && this.isCacheValid() && this.cache.classes) {
        //console.log('📚 Returning cached classes');
        return this.cache.classes;
      }

      //console.log('📚 Fetching teacher classes from API...');
      const classes = await Api.getTeacherClasses();
      
      // Update cache
      this.cache.classes = classes || [];
      this.cache.lastFetch = Date.now();
      
      //console.log(`✅ Found ${classes?.length || 0} classes`);
      return this.cache.classes;
    } catch (error) {
      console.error('❌ [Model] Failed to fetch classes:', error);
      
      // Return cached data if available during error
      if (this.cache.classes) {
        //console.log('📚 Returning cached classes due to error');
        return this.cache.classes;
      }
      
      throw new Error(error.message || 'Gagal mengambil data kelas');
    }
  },

  /**
   * Get students by class ID with caching support
   */
  async getStudentsByClass(classId, forceRefresh = false) {
    try {
      if (!classId) {
        throw new Error('Class ID is required');
      }

      // Check cache first (unless force refresh)
      if (!forceRefresh && this.cache.students.has(classId)) {
        //console.log(`👥 Returning cached students for class: ${classId}`);
        return this.cache.students.get(classId);
      }

      //console.log(`👥 Fetching students for class: ${classId} from API`);
      const students = await Api.getTeacherGrades(classId);
      
      // Cache the result
      this.cache.students.set(classId, students || []);
      
      //console.log(`✅ Found ${students?.length || 0} students`);
      return students || [];
    } catch (error) {
      console.error('❌ [Model] Failed to fetch students:', error);
      
      // Return cached data if available during error (and not force refresh)
      if (!forceRefresh && this.cache.students.has(classId)) {
        //console.log(`👥 Returning cached students due to error for class: ${classId}`);
        return this.cache.students.get(classId);
      }
      
      throw new Error(error.message || 'Gagal mengambil data siswa');
    }
  },

  /**
   * Send certificate to student by teacher
   */
  async sendStudentCertificateByTeacher(payload) {
    try {
      //console.log('📜 Sending certificate...', payload);

      // Validate payload
      if (!payload.course_id || !payload.student_id || !payload.class_id) {
        throw new Error('Data tidak lengkap untuk mengirim sertifikat');
      }

      const response = await fetch(`${CONFIG.BASE_URL}/teacher/send-certificate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || result.error || 'Gagal mengirim sertifikat');
      }

      //console.log('✅ Certificate sent successfully');
      return result;
    } catch (error) {
      console.error('❌ [Model] Failed to send certificate:', error);

      // Handle specific error cases
      if (error.message.includes('fetch')) {
        throw new Error('Koneksi bermasalah. Periksa internet Anda.');
      }
      if (error.message.includes('401')) {
        throw new Error('Sesi telah berakhir. Silakan login kembali.');
      }
      if (error.message.includes('403')) {
        throw new Error('Anda tidak memiliki izin untuk mengirim sertifikat.');
      }

      throw new Error(error.message || 'Gagal mengirim sertifikat');
    }
  },

  /**
   * Send notification to student
   */
  async notifyStudent(payload) {
    try {
      //console.log('📧 Sending notification...', payload);

      // Validate payload
      if (!payload.email || !payload.name || !payload.reason) {
        throw new Error('Data tidak lengkap untuk mengirim notifikasi');
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(payload.email)) {
        throw new Error('Format email tidak valid');
      }

      const response = await fetch(`${CONFIG.BASE_URL}/teacher/notify-student`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || result.error || 'Gagal mengirim notifikasi');
      }

      //console.log('✅ Notification sent successfully');
      return result;
    } catch (error) {
      console.error('❌ [Model] Failed to send notification:', error);

      // Handle specific error cases
      if (error.message.includes('fetch')) {
        throw new Error('Koneksi bermasalah. Periksa internet Anda.');
      }
      if (error.message.includes('401')) {
        throw new Error('Sesi telah berakhir. Silakan login kembali.');
      }
      if (error.message.includes('403')) {
        throw new Error('Anda tidak memiliki izin untuk mengirim notifikasi.');
      }

      throw new Error(error.message || 'Gagal mengirim notifikasi');
    }
  },

  /**
   * 🔄 NEW: Force refresh all data
   */
  async refreshAllData() {
    try {
      //console.log("🔄 Force refreshing all grade data...");
      
      // Clear cache first
      this.clearCache();
      
      // Fetch fresh classes data
      const classes = await this.getClasses(true);
      
      //console.log("✅ All grade data refreshed successfully");
      return classes;
    } catch (error) {
      console.error("❌ Failed to refresh all grade data:", error);
      throw error;
    }
  },

  /**
   * 🔄 NEW: Refresh specific class data
   */
  async refreshClassData(classId) {
    try {
      //console.log(`🔄 Refreshing data for class ${classId}...`);
      
      // Clear cache for this specific class
      this.clearClassCache(classId);
      
      // Fetch fresh student data
      const students = await this.getStudentsByClass(classId, true);
      
      //console.log(`✅ Class ${classId} data refreshed successfully`);
      return students;
    } catch (error) {
      console.error(`❌ Failed to refresh class ${classId} data:`, error);
      throw error;
    }
  },

  /**
   * Validate teacher permissions (optional helper method)
   */
  async validateTeacherPermissions() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token tidak ditemukan');
      }

      // You can add additional permission checks here
      return true;
    } catch (error) {
      console.error('❌ [Model] Permission validation failed:', error);
      throw new Error('Anda tidak memiliki izin untuk mengakses fitur ini');
    }
  },

  /**
   * Batch operations helper (for future use)
   */
  async batchOperation(operation, items, batchSize = 5) {
    const results = [];
    const errors = [];

    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);

      try {
        const batchPromises = batch.map(item => operation(item));
        const batchResults = await Promise.allSettled(batchPromises);

        batchResults.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            results.push({ item: batch[index], result: result.value });
          } else {
            errors.push({ item: batch[index], error: result.reason });
          }
        });
      } catch (error) {
        console.error(`❌ [Model] Batch operation failed for batch ${i}:`, error);
        batch.forEach(item => {
          errors.push({ item, error: new Error('Batch operation failed') });
        });
      }
    }

    return { results, errors };
  },

  /**
   * 🔄 NEW: Get cache information for debugging
   */
  getCacheInfo() {
    return {
      hasClasses: !!this.cache.classes,
      classCount: this.cache.classes?.length || 0,
      cachedStudentsClasses: this.cache.students.size,
      lastFetch: this.cache.lastFetch,
      cacheAge: this.cache.lastFetch ? Date.now() - this.cache.lastFetch : null,
      isValid: this.isCacheValid()
    };
  }
};

export default TeacherGradeModel;