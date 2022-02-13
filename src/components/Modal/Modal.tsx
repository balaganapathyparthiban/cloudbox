import { ReactChild, ReactElement, useEffect, useState } from "react";
import { VscChromeClose } from "react-icons/vsc";

interface IModal {
  title?: string;
  close?: boolean;
  children?: ReactChild[] | ReactElement[];
}

const Modal: React.FC<IModal> = (props) => {
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    setShowModal(!props.close ? false : true);
  }, [props.close]);

  return (
    <>
      <div className="w-auto h-auto" onClick={() => setShowModal(true)}>
        {props.children && props.children[0]}
      </div>
      {showModal ? (
        <div className="absolute top-0 left-0 right-0 w-screen h-screen z-10 flex flex-col items-center justify-center">
          <div className="absolute top-0 left-0 right-0 w-full h-full bg-gray-800 opacity-25 z-0"></div>
          <div className="w-auto mobile:w-full h-auto mobile:h-full bg-white z-10 rounded">
            <div
              className="w-full h-12 px-4 py-2 flex flex-row items-center justify-between"
              onClick={() => setShowModal(false)}
            >
              <p className="text-2xl">{props.title}</p>
              <VscChromeClose className="text-xl" />
            </div>
            <div className="px-4 w-full h-[calc(100%-3rem)]">
              {props.children && props.children[1]}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Modal;
