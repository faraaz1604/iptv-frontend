// ============== API UTILITIES ==============
// At the top of the file
const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';
const API = `${API_BASE}/api/channels`;
const AUTH_API = `${API_BASE}/api/auth`;

console.log("🌍 API BASE URL:", process.env.REACT_APP_API_BASE_URL);


// ================= BASE64URL DECODER =================
function base64UrlDecode(str) {
  let output = str.replace(/-/g, "+").replace(/_/g, "/");

  switch (output.length % 4) {
    case 0:
      break;
    case 1:
      output += "===";
      break;
    case 2:
      output += "==";
      break;
    case 3:
      output += "=";
      break;
  }

  return atob(output);
}

// ================= AUTH HEADER =================
function authHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ================= SAFE FETCH =================
async function safeFetch(url, options = {}) {
  try {
    const res = await fetch(url, options);

    if (res.status === 401) {
      console.warn("401 Unauthorized - clearing auth data");
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      window.location.href = "/login";
      throw new Error("Session expired. Please login again.");
    }

    if (res.status === 403) {
      console.warn("403 Forbidden - clearing auth data");
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      window.location.reload();
      throw new Error("Access denied. Please login again.");
    }

    if (res.status >= 500) {
      throw new Error("Server error. Please try again later.");
    }

    if (res.status >= 400) {
      throw new Error(`Request failed with status ${res.status}`);
    }

    return res;
  } catch (error) {
    console.error("Fetch error:", error);
    if (error instanceof TypeError) {
      throw new Error("Network error. Check your connection.");
    }
    throw error;
  }
}

// ================= HELPER: Extract Data from ApiResponse =================
function extractDataFromResponse(response) {
  if (!response) {
    throw new Error("Empty response from server");
  }

  if (response.success) {
    return response.data;
  } else {
    const errorMsg = response.message || response.error || "API Error";
    throw new Error(errorMsg);
  }
}

// ================= GENERATE UNIQUE GUEST ID =================
function generateGuestId() {
  // Create unique ID: guest_timestamp_random
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `guest_${timestamp}_${random}`;
}

// ================= AUTH API =================
export async function login(userId) {
  try {
    if (!userId || typeof userId !== "string") {
      throw new Error("Username must be a valid string");
    }

    if (userId.trim() === "") {
      throw new Error("Username cannot be empty");
    }

    if (userId.trim().length < 2) {
      throw new Error("Username must be at least 2 characters");
    }

    console.log("Attempting login for user:", userId);

    // ✅ NEW: If guest login, generate unique guest ID
    let loginUserId = userId.trim();
    if (loginUserId.toLowerCase() === "guest") {
      loginUserId = generateGuestId();
      console.log("Generated unique guest ID:", loginUserId);
    }

    const res = await safeFetch(
      `${AUTH_API}/login?userId=${encodeURIComponent(loginUserId)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      if (res.status === 400) {
        throw new Error("Invalid username format");
      } else if (res.status === 401) {
        throw new Error("Authentication failed");
      } else {
        throw new Error(`Login failed with status ${res.status}`);
      }
    }

    let response;
    try {
      response = await res.json();
    } catch (parseError) {
      throw new Error("Invalid response from server");
    }

    const data = extractDataFromResponse(response);

    if (!data.token) {
      throw new Error("No authentication token received from server");
    }

    if (!data.userId) {
      throw new Error("No user ID received from server");
    }

    // ✅ Store the token as-is (NO JSON.stringify)
    localStorage.setItem("token", data.token);
    localStorage.setItem("userId", data.userId);
    localStorage.setItem("loginTime", new Date().toISOString());

    console.log("✅ Login successful for user:", data.userId);
    return data.token;
  } catch (error) {
    console.error("❌ Login error:", error.message);

    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("loginTime");

    throw new Error(error.message || "Failed to login. Please try again.");
  }
}

// ================= GET TOKEN =================
export function getToken() {
  const token = localStorage.getItem("token");

  if (token && !isValidJWT(token)) {
    console.warn("Invalid token format detected");
    localStorage.removeItem("token");
    return null;
  }

  return token;
}

// ================= GET USER ID =================
export function getUserId() {
  return localStorage.getItem("userId");
}

// ================= LOGOUT =================
export function logout() {
  try {
    console.log("Logging out...");

    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("loginTime");

    window.location.href = "/login";
  } catch (error) {
    console.error("Logout error:", error);
    window.location.reload();
  }
}

// ================= TOKEN VALIDATION =================
export function isLoggedIn() {
  const token = getToken();
  const userId = getUserId();

  return !!token && !!userId;
}

// ================= CHECK IF TOKEN IS EXPIRED =================
export function isTokenExpired() {
  try {
    const token = getToken();

    if (!token) {
      return true;
    }

    const parts = token.split(".");

    if (parts.length !== 3) {
      console.error("Invalid token structure");
      return true;
    }

    const payloadStr = base64UrlDecode(parts[1]);
    const payload = JSON.parse(payloadStr);

    const expiryTime = payload.exp * 1000;
    const currentTime = Date.now();

    const isExpired = currentTime >= expiryTime;

    if (isExpired) {
      console.warn("Token has expired");
      logout();
    }

    return isExpired;
  } catch (error) {
    console.error("Error checking token expiry:", error);
    logout();
    return true;
  }
}

// ================= VALIDATE JWT FORMAT =================
function isValidJWT(token) {
  try {
    if (typeof token !== "string") {
      return false;
    }

    const parts = token.split(".");

    if (parts.length !== 3) {
      return false;
    }

    base64UrlDecode(parts[0]); // Header
    base64UrlDecode(parts[1]); // Payload
    base64UrlDecode(parts[2]); // Signature

    return true;
  } catch (error) {
    console.error("Invalid JWT format:", error);
    return false;
  }
}

// ================= GET LOGIN TIME =================
export function getLoginTime() {
  const loginTime = localStorage.getItem("loginTime");
  return loginTime ? new Date(loginTime) : null;
}

// ================= CLEAR ALL AUTH DATA =================
export function clearAuthData() {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("loginTime");
}

// ================= GET DISPLAY NAME =================
export function getDisplayName() {
  const userId = getUserId();
  
  if (!userId) {
    return null;
  }
  
  // Check if it's a guest user (format: guest_timestamp_random)
  if (userId.startsWith('guest_')) {
    return 'Guest';
  }
  
  // Return the actual username for regular users
  return userId;
}

// ================= GET SHORT DISPLAY NAME (for small screens) =================
export function getShortDisplayName() {
  const displayName = getDisplayName();
  
  if (!displayName) {
    return null;
  }
  
  // If guest, return as-is
  if (displayName === 'Guest') {
    return 'Guest';
  }
  
  // For long usernames, truncate for mobile
  if (displayName.length > 10) {
    return displayName.substring(0, 10) + '...';
  }
  
  return displayName;
}
