import { toast } from "react-toastify";

export const notify = (message, err = true) =>
    err ? toast.error(`${message}`) : toast.success(`${message}`);