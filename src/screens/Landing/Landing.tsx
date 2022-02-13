import { useEffect } from "react";
import { useNavigate } from "react-router";

import Logo from "../../components/Logo/Logo";
import Header from "../../components/Header/Header";
import AnalysisPNG from "../../assets/image/analysis.png";
import AnonymourPNG from "../../assets/image/anonymous.png";
import BackintimePNG from "../../assets/image/back-in-time.png";
import CensorshipPNG from "../../assets/image/censorship.png";
import CryptovaultPNG from "../../assets/image/crypto-vault.png";
import DetectivePNG from "../../assets/image/detective.png";
import PrivatePNG from "../../assets/image/private.png";
import OpensourcePNG from "../../assets/image/open-source.png";
import OwnershipPNG from "../../assets/image/ownership.png";
import Footer from "../../components/Footer/Footer";
import LoginModal from "../../components/Modal/LoginModal/LoginModal";

const Landing: React.FC = () => {
  const appDetailsGridList = [
    {
      image: OwnershipPNG,
      content: "Owenerless",
    },
    {
      image: CensorshipPNG,
      content: "Censorship Resistant",
    },
    {
      image: AnonymourPNG,
      content: "Anonymous",
    },
    {
      image: CryptovaultPNG,
      content: "Encrypted",
    },
    {
      image: BackintimePNG,
      content: "Zero Downtime",
    },
    {
      image: AnalysisPNG,
      content: "Data Integrity",
    },
    {
      image: PrivatePNG,
      content: "Private",
    },
    {
      image: OpensourcePNG,
      content: "Open Source",
    },
    {
      image: DetectivePNG,
      content: "No Tracking",
    },
  ];
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("tkn")) {
      navigate("/dashboard");
    }
  }, []);

  return (
    <>
      <div className="w-screen h-screen bg-white text-gray-800 overflow-hidden">
        <Header>
          <Logo textClass="text-gray-400" />
          <LoginModal>
            <div className="px-4 py-2 cursor-pointer bg-yellow-200 rounded">
              <p>Login</p>
            </div>
          </LoginModal>
        </Header>
        <div className="w-full h-[calc(100%-96px)] flex flex-row mobile:flex-col mobile:overflow-y-auto bg-gray-100">
          <div className="w-2/5 mobile:w-full h-full pl-12 mobile:px-4 mobile:mt-2 flex flex-col justify-center">
            <p className="text-6xl mobile:text-4xl font-semibold">Cloud Box</p>
            <p className="text-4xl mobile:text-2xl">
              Your personal cloud storage
            </p>
            <p className="mt-2 text-xl mobile:text-base">
              Open source dapp Powered by Gunjs & Web3.Storage, You can keep
              notes, files, images, videos and anything without control of
              anyone.
            </p>
          </div>
          <div className="pl-6 mobile:pl-4 pr-4 py-4 w-3/5 mobile:w-full h-full grid grid-cols-3 grid-rows-3 gap-2">
            {appDetailsGridList.map((detail, index) => {
              return (
                <div
                  key={index}
                  className="mobile:text-xs border rounded shadow flex flex-col justify-center items-center bg-white hover:bg-yellow-200"
                >
                  <img
                    src={detail.image}
                    alt="ownership"
                    className="w-16 h-16 mobile:w-12 mobile:h-12 opacity-75"
                  />
                  <p className="mt-2 text-center">{detail.content}</p>
                </div>
              );
            })}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Landing;
