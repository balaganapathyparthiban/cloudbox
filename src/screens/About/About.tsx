import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const About: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="w-screen h-screen overflow-hidden">
      <div className="w-full h-12 bg-white border-b flex flex-row items-center px-4">
        <IoArrowBack className="text-xl" onClick={() => navigate(-1)} />
        <p className="text-lg px-4">About</p>
      </div>
      <div className="w-full h-[calc(100%-3rem)] bg-white px-4 py-2 font-thin overflow-y-auto">
        <p className="mt-4">
          Cloud Box is an open source D-APP(Decentralized application) where the
          data is stored in peer network instead of drive in cloud This
          application helps to store Documents, Images, Videos, Audios and even
          Notes in secure way. The files are store in peer network in encrypted
          format using Web3.Storage & Gun.js.
        </p>
      </div>
    </div>
  );
};

export default About;
