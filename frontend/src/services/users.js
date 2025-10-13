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

export async function getMe(token) {
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await fetch(`${BACKEND_URL}/users/me`, requestOptions);
  if (response.status !== 200) {
    throw new Error("Unable to fetch authenticated user");
  }

  const data = await response.json();
  return data;
}

export async function getUserBySlug(token, slug) {
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await fetch(`${BACKEND_URL}/users/${slug}`, requestOptions);

  if (response.status !== 200) {
    throw new Error("Unable to fetch authenticated user");
  }

  const data = await response.json();
  return data;
}

export async function friendUser(token, myId, otherId) {
  const requestOptions = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ myId: myId, otherId: otherId }),
  };
  const response = await fetch(`${BACKEND_URL}/users/friend`, requestOptions);

  if (response.status !== 201) {
    throw new Error("Unable to friend user");
  }

  const data = await response.json();
  console.log(data);
  return data;
}

export async function unFriendUser(token, myId, otherId) {
  const requestOptions = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ myId: myId, otherId: otherId }),
  };
  const response = await fetch(`${BACKEND_URL}/users/unfriend`, requestOptions);

  if (response.status !== 201) {
    throw new Error("Unable to unfriend user");
  }

  const data = await response.json();
  console.log(data);
  return data;
}