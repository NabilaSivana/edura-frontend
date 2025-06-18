import CONFIG from "../../config.js";

const CreateCourseModel = {
    async getRecommendation() {
        const response = await fetch(`${CONFIG.BASE_URL}/student/course/recommendations`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });

        if (!response.ok) throw new Error("Gagal fetch rekomendasi");

        return response.json(); // format: { message, titles: [ { title, is_verified } ] }
    },

    async submitCourse(payload) {
        console.log("Payload yang dikirim:", payload); // <--- tambahkan ini
        const response = await fetch(`${CONFIG.BASE_URL}/student/course/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error("Gagal submit course");

        return response.json();
    }
    ,
};

export default CreateCourseModel;
