const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function getUser(email) {
  const response = await fetch(`${BACKEND_URL}/users?email=${email}`);

  if (response.status !== 200 && response.status !== 404) {
    throw new Error("Server error");
  }
  if (response.status === 404) {
    return null;
  }

  const data = await response.json();
  return data;
}

export async function getUserById(id) {
  const response = await fetch(`${BACKEND_URL}/users/${id}`); //RESTful endpoint, Path parameter, access the specific user whose ID is 123

  if (response.status !== 200 && response.status !== 404) {
    throw new Error("Server error");
  }
  if (response.status === 404) {
    return null;
  }

  const data = await response.json();
  return data;
}

// export async function getUserProfile(token) {
//   const response = await fetch(`${BACKEND_URL}/users/me/profile`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
//   if (!response.ok) {
//     throw new Error("Failed to fetch user profile");
//   }
//   return response.json();
// }