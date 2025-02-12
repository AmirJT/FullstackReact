import { JwtPayload, jwtDecode } from "jwt-decode";

class AuthService {
  // ✅ Get the user profile from the token
  getProfile() {
    const token = this.getToken();
    return token ? jwtDecode<JwtPayload>(token) : null;
  }

  // ✅ Check if the user is logged in
  loggedIn(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  // ✅ Check if the token is expired
  isTokenExpired(token: string): boolean {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      if (!decoded.exp) return true;
      return decoded.exp * 1000 < Date.now();
    } catch (error) {
      return true; // If decoding fails, assume the token is expired
    }
  }

  // ✅ Get the JWT token from localStorage
  getToken(): string | null {
    return localStorage.getItem("token");
  }

  // ✅ Store the token in localStorage & redirect user
  login(idToken: string) {
    localStorage.setItem("token", idToken);
    window.location.assign("/"); // Redirect to home
  }

  // ✅ Remove the token from localStorage & redirect to login
  logout() {
    localStorage.removeItem("token");
    window.location.assign("/login"); // Redirect to login page
  }
}

export default new AuthService();