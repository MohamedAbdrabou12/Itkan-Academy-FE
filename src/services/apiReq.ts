import { useAuthStore } from "@/stores/auth";
import { UserRole } from "@/types/Roles";

const API_BASE_URL =
  import.meta.env.VITE_APP_API_URL || "http://127.0.0.1:8000/api/v1";

const apiReq = async (method: string, endpoint: string, body?: unknown) => {
  const options: RequestInit = {
    method,
  };
  const accessToken = useAuthStore.getState().access_token;
  if (accessToken) {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    };
  }

  const userRole = useAuthStore.getState().user?.role_name;
  const activeBranch = useAuthStore.getState().activeBranch;
  if (userRole != UserRole.STUDENT && activeBranch?.id) {
    options.headers = {
      ...options.headers,
      "X-Branch-ID": activeBranch?.id,
    };
  }
  if (body) {
    if (body instanceof FormData) {
      // The browser will automatically set Content-Type to 'multipart/form-data'

      options.body = body;
    } else {
      options.headers = {
        ...options.headers,
        "Content-Type": "application/json",
      };
      options.body = JSON.stringify(body);
    }
  }

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, options);

    // Attempt to parse JSON, gracefully handle non-JSON responses.
    const data = await res.json();

    if (!res.ok) {
      if (res.status === 422 && Array.isArray(data?.detail)) {
        // FastAPI validation error
        const firstError = data.detail[0];
        const errorMessage = `${firstError.loc.join(" -> ")}: ${firstError.msg}`;
        throw new Error(errorMessage);
      } else if (data?.message) {
        // Custom JSON response with a "message" key
        throw new Error(data.message);
      } else if (data?.detail) {
        // Standard FastAPI HTTPException
        if (typeof data.detail === "string") {
          throw new Error(data.detail);
        }
        // If detail is an object, stringify it
        throw new Error(JSON.stringify(data.detail));
      } else {
        // Fallback for unknown error formats
        throw new Error(`An error occurred with status code ${res.status}`);
      }
    }

    return data;
  } catch (err) {
    console.error("API Request Error:", err);
    throw err;
  }
};

export default apiReq;
