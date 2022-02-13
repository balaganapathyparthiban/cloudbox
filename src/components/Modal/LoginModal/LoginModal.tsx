import { ReactChild, useContext, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

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
  const [loading, setLoading] = useState(false)

  const setToken = (token: string, username: string) => {
    localStorage.setItem("userName", username);
    localStorage.setItem("tkn", token);
    navigate("/dashboard");
  };

  const loginHandler = () => {
    if (!userNameRef.current?.value || !passwordRef.current?.value) return;

    const username = userNameRef.current?.value;
    const password = passwordRef.current?.value;

    setLoading(true)
    user.create(username, password, (createAck: any) => {
      if (createAck.err === "User already created!") {
        user.auth(username, password, (authAck: any) => {
          if (authAck.err) {
            toast.error(authAck.err);
            setLoading(false)
            return;
          }
          setToken(authAck.get, username);
          setLoading(false)
          return;
        });
      } else {
        setToken(createAck.pub, username);
        setLoading(false)
      }
    });
  };

  return (
    <Modal title={locale.landing?.login}>
      {props.children}
      <div className="w-72 mobile:w-full h-72 mobile:h-full flex flex-col mobile:justify-start justify-between">
        <div className="mt-6">
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
        </div>
        <div
          className="w-full h-12 my-6 bg-yellow-200 rounded flex flex-row items-center justify-center cursor-pointer"
          onClick={loading ? () => { } : loginHandler}
        >
          <p className="text-center">{loading ? 'loading...' : locale.landing?.login}</p>
        </div>
      </div>
    </Modal>
  );
};

export default LoginModal;
