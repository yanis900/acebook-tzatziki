// docs: https://vitejs.dev/guide/env-and-mode.html
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function getPosts(token) {
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await fetch(`${BACKEND_URL}/posts`, requestOptions);

  if (response.status !== 200) {
    throw new Error("Unable to fetch posts");
  }

  const data = await response.json();
  return data;
}

export async function getUserPosts(token, user_id) {
 const requestOptions = { 
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({user_id: user_id})
  };

  const response = await fetch(`${BACKEND_URL}/posts`, requestOptions);

  if (response.status !== 200) {
    throw new Error("Unable to fetch posts");
  }

  const data = await response.json();
  return data;
}


export async function createPost(token, message) {
  const requestOptions = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: message }),
  };
  const response = await fetch(`${BACKEND_URL}/posts`, requestOptions);

  if (response.status !== 201) {
    throw new Error("Unable to create post");
  }

  const data = await response.json();
  console.log(data);
  return data;
}

export async function deletePost(token, postId) {
  const requestOptions = {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await fetch(
    `${BACKEND_URL}/posts/${postId}`,
    requestOptions
  );

  if (response.status !== 200) {
    throw new Error("Unable to delete post");
  }

  const data = await response.json();
  console.log(data);
  return data;
}
