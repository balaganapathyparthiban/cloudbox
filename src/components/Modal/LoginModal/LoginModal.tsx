import { ReactChild, useContext, useRef } from "react";
import { useNavigate } from "react-router";

import { LocaleContext } from "../../../store/store";
import { user } from "../../../utils/db";
import Modal from "../Modal";

interface ILoginModal {
  children: ReactChild;
}

const LoginModal: React.FC<ILoginModal> = (props) => {
  const locale = useContext(LocaleContext);

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
      if (createAck.err) {
        user.auth(username, password, (authAck: any) => {
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
    <Modal title={locale.landing?.login}>
      {props.children}
      <div className="w-full h-full flex flex-col">
        <div className="mt-2">
          <input
            ref={userNameRef}
            type="text"
            className="w-full h-12 px-4 outline-none border rounded"
            placeholder={locale.landing?.username}
          />
        </div>
        <div className="mt-4">
          <input
            ref={passwordRef}
            type="password"
            className="w-full h-12 px-4 outline-none border rounded"
            placeholder={locale.landing?.password}
          />
        </div>
        <div
          className="w-full h-12 my-6 bg-yellow-200 rounded flex flex-row items-center justify-center cursor-pointer"
          onClick={loginHandler}
        >
          <p className="text-center">{locale.landing?.login}</p>
        </div>
      </div>
    </Modal>
  );
};

export default LoginModal;
