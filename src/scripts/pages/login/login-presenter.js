import LoginModel from "../login/login-model.js";

const LoginPresenter = {
  async handleLogin(email, password, onSuccess, onError) {
    try {
      const result = await LoginModel.login(email, password);
      if (onSuccess) onSuccess(result.message); // kirim pesan
    } catch (error) {
      if (onError) onError(error.message);
    }
  },
};

export default LoginPresenter;
