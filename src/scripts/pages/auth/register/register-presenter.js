// src/scripts/pages/auth/register/register-presenter.js

import RegisterModel from "./register-model.js";

const RegisterPresenter = {
  async handleRegister(fullName, email, password, onSuccess, onError) {
    try {
      const result = await RegisterModel.register(fullName, email, password);
      if (onSuccess) {
        // Mengirim pesan sukses dari backend ke view
        onSuccess(result.message);
      }
    } catch (error) {
      if (onError) {
        // Mengirim pesan error dari backend ke view
        onError(error.message);
      }
    }
  },
};

export default RegisterPresenter;