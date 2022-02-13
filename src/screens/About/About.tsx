import { useContext } from "react";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

import { LocaleContext } from "../../store/store";

const About: React.FC = () => {
  const locale = useContext(LocaleContext);
  const navigate = useNavigate();

  return (
    <div className="w-screen h-screen overflow-hidden">
      <div className="w-full h-12 bg-white border-b flex flex-row items-center px-4">
        <IoArrowBack className="text-xl" onClick={() => navigate(-1)} />
        <p className="text-lg px-4">{locale.footer.about}</p>
      </div>
      <div className="w-full h-[calc(100%-3rem)] bg-white px-4 py-2 font-thin overflow-y-auto">
        <p className="mt-4">{locale.about.content}</p>
      </div>
    </div>
  );
};

export default About;
