// src/scripts/data/api.js - Main API entry point (modular version)
import adminAPI from './admin.js';
import CONFIG from './config.js';
import coreAPI from './core.js';
import studentAPI from './student.js';
import teacherAPI from './teacher.js';
import utilsAPI from './utils.js';

/**
 * Main API class that combines all API modules
 * This provides a unified interface while maintaining modular structure
 */
class MainAPI {
    constructor() {
        // Initialize all API modules
        this.core = coreAPI;
        this.student = studentAPI;
        this.teacher = teacherAPI;
        this.admin = adminAPI;
        this.utils = utilsAPI;

        // Expose CONFIG for backward compatibility
        this.CONFIG = CONFIG;

        //console.log('🚀 Modular API initialized successfully');
    }

    // ============================================
    // BACKWARD COMPATIBILITY METHODS
    // These methods provide compatibility with the old API structure
    // ============================================

    // Authentication methods (delegated to core)
    async login(credentials) {
        return this.core.login(credentials);
    }

    async register(userData) {
        return this.core.register(userData);
    }

    async forgotPassword(email) {
        return this.core.forgotPassword(email);
    }

    async postVerifyEmail(data) {
        return this.core.postVerifyEmail(data);
    }

    async getVerifyEmail(params) {
        return this.core.getVerifyEmail(params);
    }

    async postSendMagicLink(data) {
        return this.core.postSendMagicLink(data);
    }

    async postResetPassword(data) {
        return this.core.postResetPassword(data);
    }

    async sendMagicLink(email) {
        return this.core.sendMagicLink(email);
    }

    async verifyOtp(data) {
        return this.core.verifyOtp(data);
    }

    async resendOtp(data) {
        return this.core.resendOtp(data);
    }

    async postSetupTeacherPassword(data) {
        return this.core.postSetupTeacherPassword(data);
    }

    async postResendTeacherSetupLink(data) {
        return this.core.postResendTeacherSetupLink(data);
    }

    // Profile methods (delegated to core)
    async getProfile(forceRefresh = false) {
        return this.core.getProfile(forceRefresh);
    }

    async updateProfile(data) {
        return this.core.updateProfile(data);
    }

    // Student methods (delegated to student)
    async getStudentProfile(forceRefresh = false) {
        return this.student.getStudentProfile(forceRefresh);
    }

    async createStudentProfile(data) {
        return this.student.createStudentProfile(data);
    }

    async updateStudentProfile(data) {
        return this.student.updateStudentProfile(data);
    }

    async getStudentCourses() {
        return this.student.getStudentCourses();
    }

    async createCourse(data) {
        return this.student.createCourse(data);
    }

    async updateStudentCheckpoint(courseId) {
        return this.student.updateStudentCheckpoint(courseId);
    }

    async getCourseRecommendations() {
        return this.student.getCourseRecommendations();
    }

    async getStudentCourseStatus(courseId) {
        return this.student.getStudentCourseStatus(courseId);
    }

    async getStudentCourseContent(courseId) {
        return this.student.getStudentCourseContent(courseId);
    }

    async joinStudentClass(classCode) {
        return this.student.joinStudentClass(classCode);
    }

    async leaveStudentClass(className) {
        return this.student.leaveStudentClass(className);
    }

    // Flashcards methods (delegated to student)
    async getFlashcards(courseId) {
        return this.student.getFlashcards(courseId);
    }

    async generateFlashcards(courseId) {
        return this.student.generateFlashcards(courseId);
    }

    async getFlashcardStatus(courseId) {
        return this.student.getFlashcardStatus(courseId);
    }

    // Quiz methods (delegated to student)
    async generateQuiz(courseId, sessionNumber) {
        return this.student.generateQuiz(courseId, sessionNumber);
    }

    async getQuiz(courseId, sessionNumber, forceRefresh = false) {
        return this.student.getQuiz(courseId, sessionNumber, forceRefresh);
    }

    async getQuizResult(courseId, sessionNumber, forceRefresh = false) {
        return this.student.getQuizResult(courseId, sessionNumber, forceRefresh);
    }

    async submitQuiz(courseId, sessionNumber, answers, retry = false) {
        return this.student.submitQuiz(courseId, sessionNumber, answers, retry);
    }

    async submitQuizAndGetFreshResult(courseId, sessionNumber, answers, retry = false) {
        return this.student.submitQuizAndGetFreshResult(courseId, sessionNumber, answers, retry);
    }

    async clearAllQuizRelatedCache(courseId, sessionNumber) {
        return this.student.clearAllQuizRelatedCache(courseId, sessionNumber);
    }

    // Final exam methods (delegated to student)
    async checkFinalExam(courseId) {
        return this.student.checkFinalExam(courseId);
    }

    async getFinalExam(courseId) {
        return this.student.getFinalExam(courseId);
    }

    async generateFinalExam(courseId) {
        return this.student.generateFinalExam(courseId);
    }

    async checkFinalExamStatus(courseId) {
        return this.student.checkFinalExamStatus(courseId);
    }

    async submitFinalExam(courseId, answers) {
        return this.student.submitFinalExam(courseId, answers);
    }

    async getFinalExamResult(courseId) {
        return this.student.getFinalExamResult(courseId);
    }

    async getFinalExamLeaderboard(courseId, classId) {
        return this.student.getFinalExamLeaderboard(courseId, classId);
    }

    async checkFinalExamWithRetry(courseId) {
        return this.student.checkFinalExamWithRetry(courseId);
    }

    async submitFinalExamSafe(courseId, answers) {
        return this.student.submitFinalExamSafe(courseId, answers);
    }

    // Course generation helpers (delegated to student)
    async getPendingGenerations() {
        return this.student.getPendingGenerations();
    }

    async checkCourseGenerationStatus(courseId) {
        return this.student.checkCourseGenerationStatus(courseId);
    }

    // Teacher methods (delegated to teacher)
    async getTeacherProfile(forceRefresh = false) {
        return this.teacher.getTeacherProfile(forceRefresh);
    }

    async createTeacherProfile(data) {
        return this.teacher.createTeacherProfile(data);
    }

    async updateTeacherProfile(data) {
        return this.teacher.updateTeacherProfile(data);
    }

    async getTeacherUnverifiedCourses() {
        return this.teacher.getTeacherUnverifiedCourses();
    }

    async getTeacherVerifiedCourses() {
        return this.teacher.getTeacherVerifiedCourses();
    }

    async getTeacherCourseDetail(courseId) {
        return this.teacher.getTeacherCourseDetail(courseId);
    }

    async verifyTeacherCourse(courseId) {
        return this.teacher.verifyTeacherCourse(courseId);
    }

    async editTeacherCourse(courseId, data) {
        return this.teacher.editTeacherCourse(courseId, data);
    }

    async revertTeacherCourse(courseId, data) {
        return this.teacher.revertTeacherCourse(courseId, data);
    }

    async deleteTeacherCourseSession(courseId, sessionNumber) {
        return this.teacher.deleteTeacherCourseSession(courseId, sessionNumber);
    }

    async editTeacherCourseSession(courseId, sessionNumber, data) {
        return this.teacher.editTeacherCourseSession(courseId, sessionNumber, data);
    }

    async deleteTeacherSession(courseId, sessionNumber) {
        return this.teacher.deleteTeacherSession(courseId, sessionNumber);
    }

    // Teacher class management (delegated to teacher)
    async getTeacherClasses() {
        return this.teacher.getTeacherClasses();
    }

    async createTeacherClass(data) {
        return this.teacher.createTeacherClass(data);
    }

    async updateTeacherClass(classId, data) {
        return this.teacher.updateTeacherClass(classId, data);
    }

    async deleteTeacherClass(classId) {
        return this.teacher.deleteTeacherClass(classId);
    }

    async getClassStudents(classId) {
        return this.teacher.getClassStudents(classId);
    }

    async removeStudentFromClass(classId, studentId) {
        return this.teacher.removeStudentFromClass(classId, studentId);
    }

    async getTeacherGrades(classId) {
        return this.teacher.getTeacherGrades(classId);
    }

    // Teacher request methods (delegated to teacher)
    async submitTeacherRequest(data) {
        return this.teacher.submitTeacherRequest(data);
    }

    async checkTeacherRequestStatusByNIDN(nidn) {
        return this.teacher.checkTeacherRequestStatusByNIDN(nidn);
    }

    async checkTeacherRequestStatusByNIP(nip) {
        return this.teacher.checkTeacherRequestStatusByNIP(nip);
    }

    async checkTeacherRequestStatusByEmail(email) {
        return this.teacher.checkTeacherRequestStatusByEmail(email);
    }

    async getMyTeacherRequestStatus() {
        return this.teacher.getMyTeacherRequestStatus();
    }

    // Admin methods (delegated to admin)
    async getUserById(userId) {
        return this.admin.getUserById(userId);
    }

    async createUser(userData) {
        return this.admin.createUser(userData);
    }

    async updateUser(userId, updateData) {
        return this.admin.updateUser(userId, updateData);
    }

    async deleteUser(userId) {
        return this.admin.deleteUser(userId);
    }

    async resetUserPassword(userId, options = {}) {
        return this.admin.resetUserPassword(userId, options);
    }

    async exportUsers(role = 'all') {
        return this.admin.exportUsers(role);
    }

    async getAllstudent(page = 1, limit = 10, search = "") {
        return this.admin.getAllstudent(page, limit, search);
    }

    async getAllteacher(page = 1, limit = 10, search = "") {
        return this.admin.getAllteacher(page, limit, search);
    }

    async getAlladmin(page = 1, limit = 10, search = "") {
        return this.admin.getAlladmin(page, limit, search);
    }

    async importUsers(file) {
        return this.admin.importUsers(file);
    }

    // Admin teacher request management (delegated to admin)
    async getTeacherRequests() {
        return this.admin.getTeacherRequests();
    }

    async updateTeacherRequestStatus(id, status, rejectReason = null) {
        return this.admin.updateTeacherRequestStatus(id, status, rejectReason);
    }

    // Admin class management (delegated to admin)
    async getAllClasses(options = {}) {
        return this.admin.getAllClasses(options);
    }

    async getAllTeachers(options = {}) {
        return this.admin.getAllTeachers(options);
    }

    async createAdminClass(classData) {
        return this.admin.createAdminClass(classData);
    }

    async updateAdminClass(classId, classData) {
        return this.admin.updateAdminClass(classId, classData);
    }

    async deleteAdminClass(classId) {
        return this.admin.deleteAdminClass(classId);
    }

    async transferClassOwnership(classId, newTeacherId) {
        return this.admin.transferClassOwnership(classId, newTeacherId);
    }

    async getAdminClassStudents(classId) {
        return this.admin.getAdminClassStudents(classId);
    }

    async removeStudentFromClassAdmin(classId, studentId) {
        return this.admin.removeStudentFromClassAdmin(classId, studentId);
    }

    async getAdminClassStatistics() {
        return this.admin.getAdminClassStatistics();
    }

    // Admin course management (delegated to admin)
    async getAdminCourses(options = {}) {
        return this.admin.getAdminCourses(options);
    }

    async getAdminCourseDetail(courseId) {
        return this.admin.getAdminCourseDetail(courseId);
    }

    async updateAdminCourse(courseId, updateData) {
        return this.admin.updateAdminCourse(courseId, updateData);
    }

    async deleteAdminCourse(courseId) {
        return this.admin.deleteAdminCourse(courseId);
    }

    async exportAdminCourses() {
        return this.admin.exportAdminCourses();
    }

    async getAdminCourseStatistics() {
        return this.admin.getAdminCourseStatistics();
    }

    async getAllCourses() {
        return this.admin.getAllCourses();
    }

    // Utility methods (delegated to utils)
    async getSnapToken() {
        return this.utils.getSnapToken();
    }

    async getCurrentUser() {
        return this.utils.getCurrentUser();
    }

    async getEnums() {
        return this.utils.getEnums();
    }

    async getClassCodeInfo(code) {
        return this.utils.getClassCodeInfo(code);
    }

    async checkClassCode(code) {
        return this.utils.checkClassCode(code);
    }

    // Offline-first methods (delegated to utils)
    async getProfileOfflineFirst() {
        return this.utils.getProfileOfflineFirst();
    }

    async getCoursesOfflineFirst() {
        return this.utils.getCoursesOfflineFirst();
    }

    async safeWriteOperation(action, data, priority = 1) {
        return this.utils.safeWriteOperation(action, data, priority);
    }

    // Cache utilities (delegated to utils)
    async clearAllCache() {
        return this.utils.clearAllCache();
    }

    async clearCachePattern(pattern) {
        return this.utils.clearCachePattern(pattern);
    }

    async getCacheStats() {
        return this.utils.getCacheStats();
    }

    // Validation helpers (delegated to utils)
    validateEmail(email) {
        return this.utils.validateEmail(email);
    }

    validateNIDN(nidn) {
        return this.utils.validateNIDN(nidn);
    }

    validateNIP(nip) {
        return this.utils.validateNIP(nip);
    }

    validatePhone(phone) {
        return this.utils.validatePhone(phone);
    }

    // Format helpers (delegated to utils)
    formatPhone(phone) {
        return this.utils.formatPhone(phone);
    }

    formatDate(date, options = {}) {
        return this.utils.formatDate(date, options);
    }

    formatCurrency(amount, currency = 'IDR') {
        return this.utils.formatCurrency(amount, currency);
    }

    // Network utilities (delegated to utils)
    getNetworkStatus() {
        return this.utils.getNetworkStatus();
    }

    async waitForNetwork(timeout = 30000) {
        return this.utils.waitForNetwork(timeout);
    }

    // Error handling (delegated to utils)
    handleAPIError(error, context = '') {
        return this.utils.handleAPIError(error, context);
    }

    // Retry utilities (delegated to utils)
    async retryWithBackoff(fn, maxRetries = 3, baseDelay = 1000, context = '') {
        return this.utils.retryWithBackoff(fn, maxRetries, baseDelay, context);
    }

    // Performance utilities (delegated to utils)
    debounce(func, wait, immediate = false) {
        return this.utils.debounce(func, wait, immediate);
    }

    throttle(func, limit) {
        return this.utils.throttle(func, limit);
    }

    // Logging (delegated to utils)
    log(level, message, data = null) {
        return this.utils.log(level, message, data);
    }

    // ============================================
    // LEGACY COMPATIBILITY METHODS
    // These methods are kept for backward compatibility
    // ============================================

    // Clear cache methods (backward compatibility)
    clearUserCache(userType) {
        return this.core.clearUserCache(userType);
    }

    // Validation methods (backward compatibility with teacher API)
    validateTeacherRequestData(data) {
        return this.teacher.validateTeacherRequestData(data);
    }

    validateAdminClassData(data) {
        return this.admin.validateAdminClassData(data);
    }

    // ============================================
    // MODULE ACCESS METHODS
    // For advanced users who want direct access to specific modules
    // ============================================

    // Get specific module
    getModule(moduleName) {
        const modules = {
            core: this.core,
            student: this.student,
            teacher: this.teacher,
            admin: this.admin,
            utils: this.utils
        };

        if (!modules[moduleName]) {
            console.warn(`Module '${moduleName}' not found. Available modules:`, Object.keys(modules));
            return null;
        }

        return modules[moduleName];
    }

    // Get all modules
    getAllModules() {
        return {
            core: this.core,
            student: this.student,
            teacher: this.teacher,
            admin: this.admin,
            utils: this.utils
        };
    }

    // ============================================
    // SYSTEM INFORMATION METHODS
    // ============================================

    // Get API version info
    getVersion() {
        return {
            version: '2.0.0',
            type: 'modular',
            modules: ['core', 'student', 'teacher', 'admin', 'utils'],
            features: [
                'offline-first',
                'caching',
                'retry-logic',
                'modular-architecture',
                'backward-compatibility'
            ],
            timestamp: Date.now()
        };
    }

    // Get system status
    async getSystemStatus() {
        const networkStatus = this.getNetworkStatus();
        let cacheStats = null;

        try {
            cacheStats = await this.getCacheStats();
        } catch (error) {
            console.warn('Failed to get cache stats:', error);
        }

        return {
            network: networkStatus,
            cache: cacheStats,
            modules: {
                core: !!this.core,
                student: !!this.student,
                teacher: !!this.teacher,
                admin: !!this.admin,
                utils: !!this.utils
            },
            version: this.getVersion(),
            timestamp: Date.now()
        };
    }
}

// Create and export singleton instance
const Api = new MainAPI();

// Also export individual modules for direct access if needed
export {
    adminAPI as AdminAPI, CONFIG, coreAPI as CoreAPI,
    studentAPI as StudentAPI,
    teacherAPI as TeacherAPI, utilsAPI as UtilsAPI
};

// Export main API as default
export default Api;