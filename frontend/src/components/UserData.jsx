
export function UserData(props) { 
    const capitalize = (str) => {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    return (
        <div className="card w-96 bg-base-100 shadow-xl">
            <figure className="px-10 pt-10">
                <img
                    src={props.userData.image}
                    alt="Profile"
                    className="rounded-full w-24 h-24 object-cover"
                />
            </figure>
            <div className="card-body items-center text-center">
                <h2 className="card-title">
                    {capitalize(props.userData.firstname)} {capitalize(props.userData.lastname)}
                </h2>
                <p>{props.userData.email}</p>
            </div>
        </div>
    )
}