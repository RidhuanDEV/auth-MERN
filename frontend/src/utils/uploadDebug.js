/**
 * Debug helper untuk upload issues
 * Run ini di browser console untuk test
 */

const API_URL = "http://localhost:5000/api";

// Test 1: Check API connection
export const testApiConnection = async () => {
  try {
    console.log("Testing API connection...");
    const response = await fetch(`${API_URL}/auth/check`, {
      credentials: "include",
    });
    console.log("API Response:", response);
    return response.ok;
  } catch (error) {
    console.error("API connection failed:", error);
    return false;
  }
};

// Test 2: Check token
export const checkToken = () => {
  const cookies = document.cookie;
  console.log("Cookies:", cookies);
  const tokenMatch = cookies.match(/token=([^;]+)/);
  if (tokenMatch) {
    console.log("Token found:", tokenMatch[1].slice(0, 20) + "...");
    return true;
  } else {
    console.warn("No token found in cookies");
    return false;
  }
};

// Test 3: Test file upload
export const testFileUpload = async (file) => {
  try {
    if (!file) {
      console.error("No file provided");
      return;
    }

    console.log("Testing file upload...");
    console.log("File:", file.name, file.size, file.type);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "test");

    const response = await fetch(`${API_URL}/upload`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    const data = await response.json();
    console.log("Upload response:", data);
    return data;
  } catch (error) {
    console.error("Upload test failed:", error);
  }
};

// Test 4: List all exports
export const showDebugHelp = () => {
  console.log("Upload Debug Helpers:");
  console.log("1. testApiConnection() - Test API connection");
  console.log("2. checkToken() - Check if token exists");
  console.log("3. testFileUpload(file) - Test file upload");
  console.log("4. showDebugHelp() - Show this help");
};
