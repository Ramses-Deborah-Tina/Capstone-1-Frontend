import React from "react";

const Toast = () => {
  return (
    <ToastContainer
      position="top-right"
      autoClose={3000} //meaning when you get the notification it will close after 3 seconds
      hideProgressBar={false}
      closeOnClick //it'll close when you click on it
      draggable //this will just let you click and rag the notification anywhere over the user interface
      pauseOnHover
      theme="dark"
    />
  );
};

export default Toast;

/*
  This component wraps the ToastContainer from react-toastify.
  It should be included once in your app (e.g., in App.jsx) to enable toast notifications.
  Toasts can then be triggered anywhere using toast.success(), toast.error(), etc.
*/