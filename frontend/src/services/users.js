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

export async function getUserByName(name) {
  const response = await fetch(`${BACKEND_URL}/users/search?name=${name}`);

  if (response.status !== 200 && response.status !== 404) {
    throw new Error("Server error");
  }
  if (response.status === 404) {
    return null;
  }

  const data = await response.json();
  return data;
}
