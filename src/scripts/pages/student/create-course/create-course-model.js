// create-course-model.js
import Api from "../../../data/api.js";

const CreateCourseModel = {
  // State untuk tracking
  currentRecommendation: null,
  pendingGeneration: null,

  // Reset state
  reset() {
    this.currentRecommendation = null;
    this.pendingGeneration = null;
  },

  // Get course recommendations
  async getRecommendations() {
    try {
      //console.log('📋 Fetching course recommendations...');
      const result = await Api.getCourseRecommendations();
      
      // Ensure we return array
      const recommendations = result?.recommendations || result?.data || result || [];
      //console.log(`✅ Got ${recommendations.length} recommendations`);
      
      return { recommendations: Array.isArray(recommendations) ? recommendations : [] };
    } catch (error) {
      console.error('❌ Failed to get recommendations:', error);
      return { recommendations: [] };
    }
  },

  // Set selected recommendation
  selectRecommendation(recommendation) {
    this.currentRecommendation = recommendation;
    //console.log('✅ Recommendation selected:', recommendation);
  },

  // Clear selected recommendation
  clearRecommendation() {
    this.currentRecommendation = null;
    //console.log('🧹 Recommendation cleared');
  },

  // Check for pending course generation
  async checkPendingGeneration() {
    try {
      //console.log('⏳ Checking for pending course generation...');
      const pendingCourses = await Api.getPendingGenerations();
      
      if (pendingCourses && pendingCourses.length > 0) {
        this.pendingGeneration = pendingCourses[0];
        //console.log('⚠️ Found pending generation:', this.pendingGeneration);
        return this.pendingGeneration;
      }
      
      this.pendingGeneration = null;
      //console.log('✅ No pending generation found');
      return null;
    } catch (error) {
      console.warn('⚠️ Failed to check pending generation:', error);
      this.pendingGeneration = null;
      return null;
    }
  },

  // Main course creation method
  async createCourse({ subject, level }) {
    try {
      //console.log(`🚀 Starting course creation: "${subject}" (${level})`);

      // Validate input
      const validation = this.validateInput({ subject, level });
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      // Check if online (course creation requires internet)
      if (!navigator.onLine) {
        throw new Error('Membuat course baru memerlukan koneksi internet');
      }

      // Prepare payload
      const payload = {
        subject: subject.trim(),
        level: level
      };

      // Add recommendation data if available
      if (this.currentRecommendation) {
        payload.from_recommendation = true;
        payload.recommendation_id = this.currentRecommendation.id;
        //console.log(`🔄 Creating from recommendation ID: ${this.currentRecommendation.id}`);
      }

      // Call API directly (no offline manager)
      //console.log('📡 Calling API.createCourse directly:', payload);
      const result = await Api.createCourse(payload);
      
      //console.log('✅ Course creation response:', result);

      // Process result based on type
      return this.processCreationResult(result);

    } catch (error) {
      console.error('❌ Course creation failed:', error);
      return this.handleCreationError(error);
    }
  },

  // Validate input data
  validateInput({ subject, level }) {
    if (!subject || !subject.trim()) {
      return { isValid: false, error: 'Subject tidak boleh kosong' };
    }

    if (subject.trim().length < 3) {
      return { isValid: false, error: 'Subject minimal 3 karakter' };
    }

    if (subject.trim().length > 500) {
      return { isValid: false, error: 'Subject maksimal 500 karakter' };
    }

    if (!level) {
      return { isValid: false, error: 'Level harus dipilih' };
    }

    if (!['beginner', 'intermediate', 'expert'].includes(level)) {
      return { isValid: false, error: 'Level tidak valid' };
    }

    return { isValid: true };
  },

  // Process successful creation result
  processCreationResult(result) {
    const response = {
      success: true,
      courseId: result.course_id,
      message: result.message,
      isReused: result.reused || false,
      needsGeneration: !result.reused
    };

    if (result.reused) {
      //console.log('🔄 Course reused successfully');
      response.type = 'reused';
      response.redirectTo = '#/course';
    } else {
      //console.log('🆕 New course created, will be generated');
      response.type = 'created';
      response.redirectTo = '#/course';
      
      // Store generation info for tracking
      this.storeGenerationInfo(result.course_id, result.message);
    }

    return response;
  },

  // Handle creation errors with specific responses
  handleCreationError(error) {
    const response = {
      success: false,
      error: error.message,
      type: 'error'
    };

    // Classify error types based on message content
    if (error.message.includes('sedang digenerate') || error.message.includes('generation_in_progress')) {
      response.type = 'generation_in_progress';
      response.canRetry = false;
      response.suggestion = 'Tunggu course yang sedang dibuat selesai atau gunakan rekomendasi';
      
      // Extract course ID if available
      if (error.courseId) {
        response.existingCourseId = error.courseId;
      }
      
    } else if (error.message.includes('kuota') || error.message.includes('upgrade')) {
      response.type = 'quota_exceeded';
      response.canRetry = false;
      response.suggestion = 'Upgrade ke akun premium atau hapus course yang tidak digunakan';
      response.showUpgrade = true;
      
    } else if (error.message.includes('overload') || error.message.includes('429')) {
      response.type = 'server_overload';
      response.canRetry = true;
      response.suggestion = 'Server sedang penuh. Coba gunakan rekomendasi atau tunggu beberapa menit';
      
    } else if (error.message.includes('internet') || error.message.includes('network')) {
      response.type = 'network_error';
      response.canRetry = true;
      response.suggestion = 'Periksa koneksi internet Anda';
      
    } else if (error.message.includes('401')) {
      response.type = 'auth_error';
      response.canRetry = false;
      response.suggestion = 'Silakan login ulang';
      response.redirectTo = '#/login';
      
    } else {
      response.type = 'general_error';
      response.canRetry = true;
      response.suggestion = 'Terjadi kesalahan. Silakan coba lagi';
    }

    return response;
  },

  // Store generation info for tracking
  storeGenerationInfo(courseId, message) {
    try {
      localStorage.setItem('course_generating', 'true');
      localStorage.setItem('generating_course_id', courseId);
      localStorage.setItem('generating_course_message', message);
      localStorage.setItem('generating_timestamp', Date.now().toString());
      //console.log('📦 Generation info stored for tracking');
    } catch (error) {
      console.warn('⚠️ Failed to store generation info:', error);
    }
  },

  // Clear stored generation info
  clearGenerationInfo() {
    try {
      localStorage.removeItem('course_generating');
      localStorage.removeItem('generating_course_id');
      localStorage.removeItem('generating_course_message');
      localStorage.removeItem('generating_timestamp');
      //console.log('🧹 Generation info cleared');
    } catch (error) {
      console.warn('⚠️ Failed to clear generation info:', error);
    }
  },

  // Get stored generation info
  getStoredGenerationInfo() {
    try {
      const isGenerating = localStorage.getItem('course_generating') === 'true';
      if (!isGenerating) return null;

      return {
        isGenerating: true,
        courseId: localStorage.getItem('generating_course_id'),
        message: localStorage.getItem('generating_course_message'),
        timestamp: parseInt(localStorage.getItem('generating_timestamp')) || Date.now()
      };
    } catch (error) {
      console.warn('⚠️ Failed to get generation info:', error);
      return null;
    }
  },

  // Check if a generation is too old (over 10 minutes)
  isGenerationStale() {
    const info = this.getStoredGenerationInfo();
    if (!info) return false;

    const tenMinutes = 10 * 60 * 1000;
    return (Date.now() - info.timestamp) > tenMinutes;
  },

  // Auto-cleanup stale generation info
  cleanupStaleGeneration() {
    if (this.isGenerationStale()) {
      //console.log('🧹 Cleaning up stale generation info');
      this.clearGenerationInfo();
      return true;
    }
    return false;
  },

  // Helper method to check similarity with existing recommendations
  findSimilarRecommendation(subject, level, recommendations) {
    if (!recommendations || recommendations.length === 0) return null;

    const normalizedSubject = this.normalizeSubject(subject);
    
    for (const rec of recommendations) {
      const normalizedRec = this.normalizeSubject(rec.subject);
      const similarity = this.calculateSimilarity(normalizedSubject, normalizedRec);
      
      if (similarity > 0.8 && rec.level === level) {
        //console.log(`🎯 Found similar recommendation: ${rec.subject} (similarity: ${similarity.toFixed(2)})`);
        return rec;
      }
    }
    
    return null;
  },

  // Normalize subject for comparison
  normalizeSubject(subject) {
    return subject
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  },

  // Simple similarity calculation
  calculateSimilarity(str1, str2) {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;

    if (longer.length === 0) return 1.0;

    const editDistance = this.levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  },

  // Levenshtein distance calculation
  levenshteinDistance(str1, str2) {
    const matrix = Array(str2.length + 1).fill().map(() => Array(str1.length + 1).fill(0));

    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j - 1][i] + 1,     // deletion
          matrix[j][i - 1] + 1,     // insertion
          matrix[j - 1][i - 1] + cost // substitution
        );
      }
    }

    return matrix[str2.length][str1.length];
  },

  // Format recommendation for display
  formatRecommendation(rec) {
    const cleanSubject = rec.subject.replace(/^\*\*\s*/, '').trim();
    return {
      ...rec,
      displaySubject: cleanSubject,
      displayText: `${cleanSubject} (${rec.level})`,
      isVerified: rec.is_verified || false
    };
  }
};

export default CreateCourseModel;