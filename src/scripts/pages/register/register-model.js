import Api from "../../data/api";

const RegisterModel = {
  async register(full_name, email, password) {
    try {
      const response = await Api.register({
        full_name,
        email,
        password,
        role: "student",
      });
      return response;
    } catch (error) {
      throw new Error(error.message);
    }
  },
};

export default RegisterModel;
