import { ReactChild, useRef } from "react";
import { useNavigate } from "react-router";

import { user } from "../../../utils/db";
import Modal from "../Modal";

interface ILoginModal {
  children: ReactChild;
}

const LoginModal: React.FC<ILoginModal> = (props) => {
  const navigate = useNavigate();
  const userNameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const setToken = (token: string, username: string) => {
    localStorage.setItem("userName", username);
    localStorage.setItem("tkn", token);
    navigate("/dashboard");
  };

  const loginHandler = () => {
    if (!userNameRef.current?.value || !passwordRef.current?.value) return;

    const username = userNameRef.current?.value;
    const password = passwordRef.current?.value;

    user.create(username, password, (createAck: any) => {
      console.log(createAck, "createAck");
      if (createAck.err) {
        user.auth(username, password, (authAck: any) => {
          console.log(authAck, "authAck");
          if (authAck.err) {
            alert(authAck.err);
            return;
          }
          setToken(authAck.sol, username);
          return;
        });
        return;
      }
      setToken(createAck.pub, username);
    });
  };

  return (
    <Modal title="Login">
      {props.children}
      <div className="w-full h-full flex flex-col">
        <div className="mt-2">
          <input
            ref={userNameRef}
            type="text"
            className="w-full h-12 px-4 outline-none border rounded"
            placeholder="Username"
          />
        </div>
        <div className="mt-4">
          <input
            ref={passwordRef}
            type="password"
            className="w-full h-12 px-4 outline-none border rounded"
            placeholder="Password"
          />
        </div>
        <div
          className="w-full h-12 my-6 bg-yellow-200 rounded flex flex-row items-center justify-center cursor-pointer"
          onClick={loginHandler}
        >
          <p className="text-center">Login</p>
        </div>
      </div>
    </Modal>
  );
};

export default LoginModal;
