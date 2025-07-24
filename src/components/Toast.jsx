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

//This component is like a billboard where all your toast notifications appear.
//It handles rendering and positioning of all toast messages globally.
//The file is technically a wrapper component for the ToastContainer from the react-toastify library.
