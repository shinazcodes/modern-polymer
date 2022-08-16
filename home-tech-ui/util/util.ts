import { confirmAlert } from "react-confirm-alert";

export const showErrorAlert = (message: string = "something went wrong") => {
  confirmAlert({
    buttons: [
      {
        label: "ok",
      },
    ],
    closeOnClickOutside: false,
    title: "An Error Occurred!",
    message,
  });
};
