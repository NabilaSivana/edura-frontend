// src/scripts/pages/admin/manage-user/manage-user-model.js
import Api from "../../../data/api.js";

const ManageUserModel = {
  async getAllstudent({ page = 1, limit = 10, search = "" }) {
    return await Api.getAllstudent(page, limit, search);
  },

  async getAllteacher({ page = 1, limit = 10, search = "" }) {
    return await Api.getAllteacher(page, limit, search);
  },

  async getAlladmin({ page = 1, limit = 10, search = "" }) {
    return await Api.getAlladmin(page, limit, search);
  },

  async getAllUsers({ page = 1, limit = 10, search = "" }) {
    const [student, teacher, admin] = await Promise.all([
      Api.getAllstudent(page, limit, search),
      Api.getAllteacher(page, limit, search),
      Api.getAlladmin(page, limit, search),
    ]);
    return { student, teacher, admin };
  },
};

export default ManageUserModel;
