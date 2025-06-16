import RegisterModel from "./register-model.js";

const RegisterPresenter = {
  async handleRegister(name, email, password, onSuccess, onError) {
    try {
      const result = await RegisterModel.register(name, email, password);
      if (onSuccess) onSuccess(result.message); // kirim pesan ke UI
    } catch (error) {
      if (onError) onError(error.message);
    }
  },
};

export default RegisterPresenter;
