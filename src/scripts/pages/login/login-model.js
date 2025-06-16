import Api from "../../data/api";
const LoginModel = {
  async login(email, password) {
    try {
      const response = await Api.login({ email, password });

      return response;
    } catch (error) {
      throw new Error(error.message);
    }
  },
};

export default LoginModel;
