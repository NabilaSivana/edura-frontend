// File: routes/class/teacher-class-model.js
import Api from '../../../data/api.js';

const TeacherClassModel = {
  async getClasses() {
    return Api.getTeacherClasses();
  },

  async createClass(data) {
    return Api.createTeacherClass(data);
  },

  async updateClass(classId, data) {
    return Api.updateTeacherClass(classId, data);
  },

  async deleteClass(classId) {
    return Api.deleteTeacherClass(classId);
  },

  async getClassStudents(classId) {
    return Api.getClassStudents(classId);
  },

  async removeStudent(classId, studentId) {
    return Api.removeStudentFromClass(classId, studentId);
  },
};

export default TeacherClassModel;
