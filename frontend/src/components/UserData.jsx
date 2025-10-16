import { capitalise } from "../utils/capitalise";

export function UserData(props) { 

    return (
        <div className="card w-96 bg-base-100 shadow-xl">
            <figure className="px-10 pt-10">
                <img
                    src={props.userData.image.startsWith('data:') 
                ? props.userData.image 
                : `data:image/jpeg;base64,${props.userData.image}`
              } 
              alt="User profile"
                    className="rounded-full w-24 h-24 object-cover"
                     
                />
            </figure>
            <div className="card-body items-center text-center">
                <h2 className="card-title">
                    {capitalise(props.userData.firstname)} {capitalise(props.userData.lastname)}
                </h2>
                <p>{props.userData.email}</p>
            </div>
        </div>
    )
}