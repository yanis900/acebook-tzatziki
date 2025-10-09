// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { getUserById } from "../../services/users";

// export function Profile() {
//     const [user, setUser] = useState([]);
//     const navigate = useNavigate();

//     useEffect(() => {
//         const token = localStorage.getItem("token");
//         const loggedIn = token !== null;
//         if (loggedIn) {
//             getUserById(token)
//                 .then((data) => {
//                 setUser(data.user);
//                 localStorage.setItem("token", data.token);
//                 })
//                 .catch((err) => {
//                 console.error(err);
//                 navigate("/login");
//                 });
//             }
//         }, [navigate]);
        
//     const token = localStorage.getItem("token");
//     if (!token) {
//         navigate("/login");
//         return;
//     }

//     return (
//         <>
//         <h2>Profile Page</h2>
//             <p><strong>First Name:</strong> {user.firstname}</p>
//             <p><strong>Last Name:</strong> {user.lastname}</p>
//             <p><strong>Email:</strong> {user.email}</p>
//         </>
//     );
// }
// export default Profile;