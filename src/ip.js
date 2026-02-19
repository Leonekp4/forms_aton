// Alterando de process.env para import.meta.env (padrão do Vite)
const apiBaseUrl = import.meta.env.VITE_API_URL || "localhost";

export default apiBaseUrl;
