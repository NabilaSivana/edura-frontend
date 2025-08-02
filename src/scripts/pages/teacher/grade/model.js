// // FILE: model.js
// import CONFIG from "../../../config.js";
// import Api from "../../../data/api.js";

// const TeacherGradeModel = {
//   async getClasses() {
//     try {
//       return await Api.getTeacherClasses();
//     } catch (error) {
//       // console.error("[Model] Gagal mengambil kelas:", error);
//       throw error;
//     }
//   },

//   async getStudentsByClass(classId) {
//     try {
//       return await Api.getTeacherGrades(classId); // endpoint ambil nilai
//     } catch (error) {
//       // console.error("[Model] Gagal mengambil siswa:", error);
//       throw error;
//     }
//   },

//   async sendStudentCertificateByTeacher(payload) {
//     try {
//       const response = await fetch(`${CONFIG.BASE_URL}/teacher/send-certificate`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//         },
//         body: JSON.stringify(payload),
//       });

//       const result = await response.json();
//       if (!response.ok) throw new Error(result.message || 'Gagal mengirim sertifikat');
//       return result;
//     } catch (error) {
//       // console.error("[Model] Gagal mengirim sertifikat:", error);
//       throw error;
//     }
//   },
//   async notifyStudent(payload) {
//     const response = await fetch(`${CONFIG.BASE_URL}/teacher/notify-student`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${localStorage.getItem('token')}`,
//       },
//       body: JSON.stringify(payload),
//     });

//     const result = await response.json();
//     if (!response.ok) throw new Error(result.message || 'Gagal mengirim notifikasi');
//     return result;
//   }
// };

// export default TeacherGradeModel;
// // FILE: model.js
// import CONFIG from "../../../config.js";
// import Api from "../../../data/api.js";

// const TeacherGradeModel = {
//   async getClasses() {
//     try {
//       return await Api.getTeacherClasses();
//     } catch (error) {
//       // console.error("[Model] Gagal mengambil kelas:", error);
//       throw error;
//     }
//   },

//   async getStudentsByClass(classId) {
//     try {
//       return await Api.getTeacherGrades(classId); // endpoint ambil nilai
//     } catch (error) {
//       // console.error("[Model] Gagal mengambil siswa:", error);
//       throw error;
//     }
//   },

//   async sendStudentCertificateByTeacher(payload) {
//     try {
//       const response = await fetch(`${CONFIG.BASE_URL}/teacher/send-certificate`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//         },
//         body: JSON.stringify(payload),
//       });

//       const result = await response.json();
//       if (!response.ok) throw new Error(result.message || 'Gagal mengirim sertifikat');
//       return result;
//     } catch (error) {
//       // console.error("[Model] Gagal mengirim sertifikat:", error);
//       throw error;
//     }
//   },
//   async notifyStudent(payload) {
//     const response = await fetch(`${CONFIG.BASE_URL}/teacher/notify-student`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${localStorage.getItem('token')}`,
//       },
//       body: JSON.stringify(payload),
//     });

//     const result = await response.json();
//     if (!response.ok) throw new Error(result.message || 'Gagal mengirim notifikasi');
//     return result;
//   }
// };

// export default TeacherGradeModel;

// FILE: model.js
import CONFIG from "../../../config.js";
import Api from "../../../data/api.js";

const TeacherGradeModel = {
  /**
   * Get teacher classes with error handling
   */
  async getClasses() {
    try {
      console.log('📚 Fetching teacher classes...');
      const classes = await Api.getTeacherClasses();
      console.log(`✅ Found ${classes?.length || 0} classes`);
      return classes || [];
    } catch (error) {
      console.error('❌ [Model] Failed to fetch classes:', error);
      throw new Error(error.message || 'Gagal mengambil data kelas');
    }
  },

  /**
   * Get students by class ID with error handling
   */
  async getStudentsByClass(classId) {
    try {
      console.log(`👥 Fetching students for class: ${classId}`);
      const students = await Api.getTeacherGrades(classId);
      console.log(`✅ Found ${students?.length || 0} students`);
      return students || [];
    } catch (error) {
      console.error('❌ [Model] Failed to fetch students:', error);
      throw new Error(error.message || 'Gagal mengambil data siswa');
    }
  },

  /**
   * Send certificate to student by teacher
   */
  async sendStudentCertificateByTeacher(payload) {
    try {
      console.log('📜 Sending certificate...', payload);

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

      console.log('✅ Certificate sent successfully');
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
      console.log('📧 Sending notification...', payload);

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

      console.log('✅ Notification sent successfully');
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
  }
};

export default TeacherGradeModel;