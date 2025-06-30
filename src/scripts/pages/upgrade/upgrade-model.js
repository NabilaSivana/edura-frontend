import Api from "../../data/api.js";

const paymentModel = {
    async getSnapToken() {
        return await Api.getSnapToken(); // return { token, redirect_url }
    },
    async getCurrentUser() {
        return await Api.getCurrentUser();
    },
};

export default paymentModel;
