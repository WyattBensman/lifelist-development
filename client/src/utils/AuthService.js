import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";
import { decode as atob } from "base-64";

global.atob = atob;

class AuthService {
  // Store the token upon login
  async saveToken(token) {
    await SecureStore.setItemAsync("authToken", token);
  }

  // Retrieve the token from storage
  async getToken() {
    return await SecureStore.getItemAsync("authToken");
  }

  // Remove the token and handle logout
  async logout() {
    await SecureStore.deleteItemAsync("authToken");
  }

  // Check if the user is logged in by checking the token existence and its expiration
  async loggedIn() {
    const token = await this.getToken();
    if (!token) return false;
    return !(await this.isTokenExpired(token));
  }

  // Decode the token to get user data
  async getUser() {
    const token = await this.getToken();
    return token ? jwtDecode(token) : null;
  }

  // Check if the token is expired
  async isTokenExpired(token) {
    try {
      const decoded = jwtDecode(token);
      return decoded.exp < Date.now() / 1000;
    } catch (error) {
      console.error("Failed to decode token", error);
      return true;
    }
  }
}

export default new AuthService();
