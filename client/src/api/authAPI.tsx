import { UserLogin } from "../interfaces/UserLogin";

const login = async (userInfo: UserLogin) => {
  try {
    const response = await fetch("http://localhost:3001/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userInfo),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    return { success: true, token: data.token };
  } catch (error) {
    console.error("Login error:", (error as Error).message); // ✅ Explicitly cast as `Error`
    return { success: false, message: (error as Error).message };
  }
};

export { login };