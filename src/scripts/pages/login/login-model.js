import Api from "../../data/api";
const LoginModel = {
  async login(email, password) {
    try {
      const response = await Api.login({ email, password });

      // Hanya simpan token jika ada
      if (response.token) {
        localStorage.setItem("authToken", response.token);
      }

      return response;
    } catch (error) {
      throw new Error(error.message);
    }
  },
};

export default LoginModel;
