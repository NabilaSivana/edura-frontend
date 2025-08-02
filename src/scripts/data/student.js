// src/scripts/data/student.js - Student-specific APIs
import coreAPI, { CACHE_TTL } from './core.js';
import CONFIG from './config.js';

export class StudentAPI extends coreAPI.constructor {
    constructor() {
        super();
    }

    // ============================================
    // STUDENT PROFILE APIs
    // ============================================

    async getStudentProfile(forceRefresh = false) {
        // Check memory cache first
        const now = Date.now();
        if (this.profileCache.student && (now - this.profileCache.timestamp < this.CACHE_DURATION)) {
            return this.profileCache.student;
        }

        try {
            const data = await this._getWithCache('/student/profile', {}, CACHE_TTL.PROFILE, forceRefresh);
            return data;
        } catch (error) {
            if (error.message.includes('404')) return null;
            throw error;
        }
    }

    async createStudentProfile(data) {
        const response = await this._fetchWithOfflineSupport(`${CONFIG.BASE_URL}/student/profile`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(data),
        });

        const responseBody = await response.json();

        // Invalidate cache
        await this._invalidateCache('student/profile');
        this.profileCache.student = null;

        return responseBody;
    }

    // Direct student profile update
    async _updateStudentProfileDirect(data) {
        try {
            const response = await this._fetchWithOfflineSupport(`${CONFIG.BASE_URL}/student/profile`, {
                method: 'PUT',
                headers: this._getHeaders(),
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (error) {
            console.error('❌ Direct student profile update failed:', error);
            throw error;
        }
    }

    async updateStudentProfile(data) {
        try {
            if (navigator.onLine) {
                // Try direct execution first
                const result = await this._updateStudentProfileDirect(data);
                await this._invalidateCache('student/profile');
                return result;
            } else {
                // Queue for offline execution
                const { default: offlineManager } = await import('../utils/offline-manager.js');
                return await offlineManager.safeWriteOperation('update_student_profile', data, 2);
            }
        } catch (error) {
            // If online but failed, try to queue for retry
            if (navigator.onLine) {
                console.warn('⚠️ Student profile update failed, queuing for retry:', error);
                const { default: offlineManager } = await import('../utils/offline-manager.js');
                return await offlineManager.safeWriteOperation('update_student_profile', data, 2);
            }
            throw error;
        }
    }

    async joinStudentClass(classCode) {
        const response = await this._fetchWithOfflineSupport(`${CONFIG.BASE_URL}/student/profile`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ class_code: classCode }),
        });

        const result = await response.json();

        // Invalidate cache
        await this._invalidateCache('student/profile');
        this.profileCache.student = null;

        return result;
    }

    async leaveStudentClass(className) {
        const response = await this._fetchWithOfflineSupport(`${CONFIG.BASE_URL}/student/profile/leave-class`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ class_name: className }),
        });

        const result = await response.json();

        // Invalidate cache
        await this._invalidateCache('student/profile');
        this.profileCache.student = null;

        return result;
    }

    // ============================================
    // STUDENT COURSES APIs
    // ============================================

    async getStudentCourses() {
        try {
            const data = await this._getWithCache('/student/courses', {}, CACHE_TTL.COURSES);

            // Ensure data is array
            const courses = Array.isArray(data) ? data : [];

            // Enrich courses with verification data
            return courses.map((course) => {
                const isVerified = course.is_verified === true;
                return {
                    ...course,
                    is_verified: isVerified,
                    verified_by: isVerified ? course.verified_by : null,
                };
            });
        } catch (error) {
            // Try offline-first approach if failed
            if (!this._isOnline()) {
                try {
                    const { default: offlineManager } = await import('../utils/offline-manager.js');
                    return await offlineManager.getCoursesOfflineFirst();
                } catch (offlineError) {
                    console.error('❌ Offline courses fetch failed:', offlineError);
                }
            }

            if (error.message.includes('404')) {
                return []; // No courses yet
            }
            throw error;
        }
    }

    // Direct course creation - never queue
    async createCourse({ subject, level, from_recommendation = false, recommendation_id = null }) {
        // Always check if online first - course creation requires internet
        if (!navigator.onLine) {
            throw new Error('Membuat course baru memerlukan koneksi internet');
        }

        try {
            const payload = { subject, level };

            // Add recommendation flags if provided
            if (from_recommendation && recommendation_id) {
                payload.from_recommendation = true;
                payload.recommendation_id = recommendation_id;
                console.log(`🔄 Creating course from recommendation ID: ${recommendation_id}`);
            } else {
                console.log(`🌐 Creating new course: ${subject} (${level})`);
            }

            console.log('📡 DIRECT API call to /student/course/create:', payload);

            // Call API directly - NO OFFLINE MANAGER
            const response = await this._fetchWithOfflineSupport(`${CONFIG.BASE_URL}/student/course/create`, {
                method: 'POST',
                headers: this._getHeaders(),
                body: JSON.stringify(payload),
            });

            const responseData = await response.json();

            // Clear courses cache after successful creation/reuse
            await this._invalidateCache('student/courses');

            // Enhanced logging
            if (responseData.reused) {
                console.log(`✅ Course reused successfully: ${responseData.course_id}`);
            } else {
                console.log(`✅ New course created: ${responseData.course_id}`);
            }

            return responseData;
        } catch (error) {
            console.error('❌ Create course failed:', error);
            throw this._enhanceError(error);
        }
    }

    async getCourseRecommendations() {
        return this._getWithCache('/student/course/recommendations', {}, CACHE_TTL.RECOMMENDATIONS);
    }

    async getStudentCourseStatus(courseId) {
        return this._getWithCache(`/student/courses/${courseId}/status`, {}, CACHE_TTL.COURSES);
    }

    async getStudentCourseContent(courseId) {
        return this._getWithCache(`/student/courses/${courseId}/content`, {}, CACHE_TTL.COURSE_CONTENT);
    }

    async updateStudentCheckpoint(courseId) {
        try {
            if (navigator.onLine) {
                // Try direct execution first
                const response = await this._fetchWithOfflineSupport(`${CONFIG.BASE_URL}/student/courses/${courseId}/checkpoint`, {
                    method: 'PUT',
                    headers: this._getHeaders(),
                    body: JSON.stringify({})
                });

                const result = await response.json();
                await this._invalidateCache(`student/courses/${courseId}`);
                return result;
            } else {
                // Queue for offline execution
                const { default: offlineManager } = await import('../utils/offline-manager.js');
                return await offlineManager.safeWriteOperation('update_checkpoint', { courseId }, 3);
            }
        } catch (error) {
            // If online but failed, try to queue for retry
            if (navigator.onLine) {
                console.warn('⚠️ Checkpoint update failed, queuing for retry:', error);
                const { default: offlineManager } = await import('../utils/offline-manager.js');
                return await offlineManager.safeWriteOperation('update_checkpoint', { courseId }, 3);
            }
            throw error;
        }
    }

    // Method to get pending generations
    async getPendingGenerations() {
        try {
            const courses = await this.getStudentCourses();
            const pendingCourses = courses.filter(course => course.is_generating === true);

            console.log(`📋 Found ${pendingCourses.length} pending course generations`);
            return pendingCourses;
        } catch (error) {
            console.warn('⚠️ Failed to get pending generations:', error);
            return [];
        }
    }

    // Helper method to check if a course generation is in progress
    async checkCourseGenerationStatus(courseId) {
        try {
            const courses = await this.getStudentCourses();
            const course = courses.find(c => c.id === parseInt(courseId));

            if (course) {
                return {
                    complete: !course.is_generating,
                    generating: course.is_generating || false,
                    course_id: course.id,
                    subject: course.subject
                };
            }

            return { complete: true, generating: false };
        } catch (error) {
            console.warn('⚠️ Failed to check generation status:', error);
            return { complete: true, generating: false }; // Assume complete if we can't check
        }
    }

    // ============================================
    // FLASHCARDS APIs
    // ============================================

    async getFlashcards(course_id) {
        return this._getWithCache('/student/flashcards', {
            params: { course_id }
        }, CACHE_TTL.COURSES);
    }

    // Direct flashcard generation - never queue
    async generateFlashcards(courseId) {
        if (!navigator.onLine) {
            throw new Error('Membuat flashcards memerlukan koneksi internet');
        }

        try {
            console.log('📡 DIRECT: Generating flashcards for course:', courseId);

            const response = await this._fetchWithOfflineSupport(`${CONFIG.BASE_URL}/student/flashcards/generate`, {
                method: 'POST',
                headers: this._getHeaders(),
                body: JSON.stringify({ course_id: courseId }),
            });

            const result = await response.json();

            // Invalidate flashcards cache on success
            await this._invalidateCache('student/flashcards');

            console.log('✅ Flashcards generated successfully:', result);
            return result;
        } catch (error) {
            console.error('❌ Generate flashcards failed:', error);
            throw error;
        }
    }

    async getFlashcardStatus(course_id) {
        return this._getWithCache('/student/flashcards/status', {
            params: { course_id }
        }, CACHE_TTL.COURSES);
    }

    // ============================================
    // QUIZ APIs
    // ============================================

    async generateQuiz(courseId, sessionNumber) {
        try {
            const token = localStorage.getItem("token");

            const response = await this._fetchWithOfflineSupport(`${CONFIG.BASE_URL}/student/quiz/generate`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    course_id: courseId,
                    session_number: sessionNumber,
                }),
            });

            const result = await response.json();

            // Invalidate quiz cache
            await this._invalidateCache('student/quiz');

            return result;
        } catch (error) {
            console.error("❌ Error generateQuiz:", error);
            throw new Error("Gagal generate quiz: " + error.message);
        }
    }

    // Enhanced invalidate cache dengan lebih spesifik dan comprehensive
    async _invalidateQuizCache(courseId, sessionNumber) {
        console.log(`🧹 Invalidating quiz cache for course ${courseId}, session ${sessionNumber}`);

        const patterns = [
            // Cache patterns untuk quiz questions
            `api_student/quiz_course_id=${courseId}&session_number=${sessionNumber}`,
            `api_student/quiz_course_id=${courseId}&session_number=${sessionNumber}&_t=`,

            // Cache patterns untuk quiz results
            `api_student/quiz/result_course_id=${courseId}&session_number=${sessionNumber}`,

            // Cache patterns yang lebih luas
            `api_student/quiz_course_id=${courseId}`,
            `api_student/quiz/result_course_id=${courseId}`,

            // Cache patterns dengan force refresh timestamp
            `student/quiz`,
            `student/quiz/result`
        ];

        for (const pattern of patterns) {
            try {
                const Cache = (await import('./cache.js')).default;
                await Cache.remove(pattern);
                console.log(`✅ Removed cache: ${pattern}`);
            } catch (error) {
                console.warn(`⚠️ Failed to remove cache: ${pattern}`, error);
            }
        }

        // Also clear broader patterns using clearPattern
        try {
            const Cache = (await import('./cache.js')).default;
            await Cache.clearPattern('student/quiz');
            await Cache.clearPattern('api_student/quiz');
            console.log('✅ Cleared quiz cache patterns');
        } catch (error) {
            console.warn('⚠️ Error clearing quiz cache patterns:', error);
        }
    }

    // Improved getQuiz method with better force refresh
    async getQuiz(courseId, sessionNumber, forceRefresh = false) {
        try {
            if (forceRefresh) {
                console.log(`🔄 Force refreshing quiz for course ${courseId}, session ${sessionNumber}`);
                // Clear cache first
                await this._invalidateQuizCache(courseId, sessionNumber);
            }

            const params = {
                course_id: courseId,
                session_number: sessionNumber
            };

            // Add timestamp untuk bypass cache jika force refresh
            if (forceRefresh) {
                params._t = Date.now();
            }

            const data = await this._getWithCache('/student/quiz', {
                params: params
            }, CACHE_TTL.COURSES);

            const questions = data.data?.questions || data.questions || [];

            if (forceRefresh) {
                console.log(`✅ Force refreshed quiz: ${questions.length} questions`);
            }

            return questions;
        } catch (error) {
            console.error("❌ Error getQuiz:", error);
            throw new Error("Gagal mengambil quiz: " + error.message);
        }
    }

    // Improved getQuizResult method with force refresh option
    async getQuizResult(courseId, sessionNumber, forceRefresh = false) {
        try {
            if (forceRefresh) {
                console.log(`🔄 Force refreshing quiz result for course ${courseId}, session ${sessionNumber}`);
                // Clear result cache specifically
                const Cache = (await import('./cache.js')).default;
                const resultCacheKeys = [
                    `api_student/quiz/result_course_id=${courseId}&session_number=${sessionNumber}`,
                    `api_student/quiz/result_course_id=${courseId}`
                ];

                for (const key of resultCacheKeys) {
                    await Cache.remove(key);
                }
            }

            const params = {
                course_id: courseId,
                session_number: sessionNumber
            };

            if (forceRefresh) {
                params._t = Date.now();
            }

            const data = await this._getWithCache('/student/quiz/result', {
                params: params
            }, CACHE_TTL.COURSES);

            if (forceRefresh) {
                console.log(`✅ Force refreshed quiz result: score ${data.data?.score}`);
            }

            return data;
        } catch (error) {
            console.error("❌ Error getQuizResult:", error);
            throw error;
        }
    }

    // Direct quiz submission - never queue
    async submitQuiz(courseId, sessionNumber, answers, retry = false) {
        if (!navigator.onLine) {
            throw new Error('Submit quiz memerlukan koneksi internet');
        }

        const data = {
            course_id: courseId,
            session_number: sessionNumber,
            answers: answers,
            retry: retry,
        };

        try {
            console.log(`📡 DIRECT: Submitting quiz (retry: ${retry}) for course ${courseId}, session ${sessionNumber}`);

            const response = await this._fetchWithOfflineSupport(`${CONFIG.BASE_URL}/student/quiz/submit`, {
                method: 'PUT',
                headers: this._getHeaders(),
                body: JSON.stringify(data)
            });

            const result = await response.json();

            // Clear cache setelah submit berhasil
            await this._invalidateQuizCache(courseId, sessionNumber);

            console.log(`✅ Quiz submitted successfully (retry: ${retry}):`, result);
            return result;

        } catch (error) {
            console.error('❌ Error submitting quiz:', error);
            throw error;
        }
    }

    // New method: submitQuizAndGetFreshResult  
    async submitQuizAndGetFreshResult(courseId, sessionNumber, answers, retry = false) {
        try {
            console.log(`🎯 Submit quiz and get fresh result (retry: ${retry})`);

            // 1. Submit quiz
            const submitResponse = await this.submitQuiz(courseId, sessionNumber, answers, retry);

            // 2. Clear result cache specifically
            await this._invalidateQuizCache(courseId, sessionNumber);

            // 3. Wait untuk processing
            await new Promise(resolve => setTimeout(resolve, 500));

            // 4. Get fresh result
            const result = await this.getQuizResult(courseId, sessionNumber, true);

            return {
                submitResponse,
                result
            };

        } catch (error) {
            console.error('❌ Error in submitQuizAndGetFreshResult:', error);
            throw error;
        }
    }

    // New method: clearAllQuizRelatedCache
    async clearAllQuizRelatedCache(courseId, sessionNumber) {
        try {
            console.log(`🧹 Clearing ALL quiz-related cache for course ${courseId}, session ${sessionNumber}`);

            // Clear specific quiz cache
            await this._invalidateQuizCache(courseId, sessionNumber);

            // Clear broader cache patterns
            const broadPatterns = [
                'student/quiz',
                'student/quiz/result',
                'api_student/quiz',
                'student/courses'
            ];

            for (const pattern of broadPatterns) {
                try {
                    await this._invalidateCache(pattern);
                } catch (error) {
                    console.warn(`⚠️ Failed to clear pattern ${pattern}:`, error);
                }
            }

            console.log('✅ All quiz-related cache cleared');
        } catch (error) {
            console.error('❌ Error clearing all quiz cache:', error);
        }
    }

    // ============================================
    // FINAL EXAM APIs
    // ============================================

    async retryWithBackoff(fn, maxRetries = 3, delay = 1000) {
        for (let i = 0; i < maxRetries; i++) {
            try {
                return await fn();
            } catch (error) {
                if (i === maxRetries - 1) throw error;
                await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
            }
        }
    }

    async checkFinalExamWithRetry(courseId) {
        return this.retryWithBackoff(() => this.checkFinalExam(courseId));
    }

    async submitFinalExamSafe(courseId, answers) {
        // Validate answers format
        if (!Array.isArray(answers) || answers.length === 0) {
            throw new Error('Invalid answers format');
        }

        // Validate each answer
        for (const answer of answers) {
            if (!answer.question || answer.answer === null || answer.answer === undefined) {
                throw new Error('Invalid answer format');
            }
        }

        return this.submitFinalExam(courseId, answers);
    }

    async checkFinalExam(courseId) {
        return this._getWithCache('/student/final-exam', {
            params: { course_id: courseId }
        }, CACHE_TTL.COURSES);
    }

    async getFinalExam(courseId) {
        return this._getWithCache('/student/final-exam/', {
            params: { course_id: courseId }
        }, CACHE_TTL.COURSES);
    }

    // Direct final exam generation - never queue
    async generateFinalExam(courseId) {
        if (!navigator.onLine) {
            throw new Error('Membuat final exam memerlukan koneksi internet');
        }

        try {
            console.log('📡 DIRECT: Generating final exam for course:', courseId);

            const response = await this._fetchWithOfflineSupport(`${CONFIG.BASE_URL}/student/final-exam/generate`, {
                method: 'POST',
                headers: this._getHeaders(),
                body: JSON.stringify({ course_id: courseId }),
            });

            const result = await response.json();

            // Invalidate final exam cache
            await this._invalidateCache('student/final-exam');

            console.log('✅ Final exam generated successfully:', result);
            return result;
        } catch (error) {
            console.error('❌ Generate final exam failed:', error);
            throw error;
        }
    }

    async checkFinalExamStatus(courseId) {
        return this._getWithCache('/student/final-exam/status', {
            params: { course_id: courseId }
        }, CACHE_TTL.COURSES);
    }

    // Direct final exam submission - never queue
    async submitFinalExam(courseId, answers) {
        if (!navigator.onLine) {
            throw new Error('Submit final exam memerlukan koneksi internet');
        }

        const data = {
            course_id: courseId,
            answers: answers
        };

        try {
            console.log('📡 DIRECT: Submitting final exam for course:', courseId);

            const response = await this._fetchWithOfflineSupport(`${CONFIG.BASE_URL}/student/final-exam/submit`, {
                method: 'PUT',
                headers: this._getHeaders(),
                body: JSON.stringify(data)
            });

            const result = await response.json();

            // Invalidate cache on success
            await this._invalidateCache('student/final-exam');

            console.log('✅ Final exam submitted successfully:', result);
            return result;
        } catch (error) {
            console.error('❌ Submit final exam failed:', error);
            throw error;
        }
    }

    async getFinalExamResult(courseId) {
        return this._getWithCache('/student/final-exam/result', {
            params: { course_id: courseId }
        }, CACHE_TTL.COURSES);
    }

    async getFinalExamLeaderboard(courseId, classId) {
        return this._getWithCache('/student/final-exam/leaderboard', {
            params: { course_id: courseId, class_id: classId }
        }, CACHE_TTL.STUDENTS);
    }
}

// Create singleton instance
const studentAPI = new StudentAPI();

export default studentAPI;