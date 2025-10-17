import { capitalise } from "../utils/capitalise";

export function UserData(props) {
    const user = props?.userData || {};

    // Safe image handling: ensure we only call startsWith on strings
    const rawImage = user.image;
    const hasImage = typeof rawImage === "string" && rawImage.length > 0;
    const imageSrc = hasImage
        ? rawImage.startsWith("data:")
            ? rawImage
            : `data:image/jpeg;base64,${rawImage}`
        : null;

    const initials = `${(user.firstname || "").charAt(0).toUpperCase()}${(
        user.lastname || ""
    ).charAt(0).toUpperCase()}`;

    return (
        <div className="card w-full max-w-xl bg-base-100 shadow-lg border border-[#E7F5A9]">
            <div className="card-body items-center text-center p-6">
                <div className="avatar mb-4">
                    <div className="w-30 h-30 rounded-full overflow-hidden flex items-center justify-center">
                        {imageSrc ? (
                            <img src={imageSrc} alt={`${user.firstname} ${user.lastname}`} className="object-cover w-full h-full" />
                        ) : (
                            <span className="text-white text-xl font-semibold">{initials || "?"}</span>
                        )}
                    </div>
                </div>

                <h2 className="text-lg md:text-xl font-bold m-0 text-[#2B98BA]">
                    {capitalise(user.firstname || "")} {capitalise(user.lastname || "")}
                </h2>

                <p className="text-sm text-gray-500 break-words m-0">{user.email}</p>

                {user.bio && (
                    <p className="mt-3 text-sm text-gray-700">{user.bio}</p>
                )}
            </div>
        </div>
    );
}
