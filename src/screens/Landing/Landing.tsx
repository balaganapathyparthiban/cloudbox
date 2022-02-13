import { useContext, useEffect } from "react";
import { useNavigate } from "react-router";

import Logo from "../../components/Logo/Logo";
import Header from "../../components/Header/Header";
import AnalysisPNG from "/images/analysis.png";
import AnonymourPNG from "/images/anonymous.png";
import BackintimePNG from "/images/back-in-time.png";
import CensorshipPNG from "/images/censorship.png";
import CryptovaultPNG from "/images/crypto-vault.png";
import DetectivePNG from "/images/detective.png";
import PrivatePNG from "/images/private.png";
import OpensourcePNG from "/images/open-source.png";
import OwnershipPNG from "/images/ownership.png";
import Footer from "../../components/Footer/Footer";
import LoginModal from "../../components/Modal/LoginModal/LoginModal";
import { LocaleContext } from "../../store/store";

const Landing: React.FC = () => {
  const locale = useContext(LocaleContext);

  const appDetailsGridList = [
    {
      image: OwnershipPNG,
      content: locale.landing?.grid_1,
    },
    {
      image: CensorshipPNG,
      content: locale.landing?.grid_2,
    },
    {
      image: AnonymourPNG,
      content: locale.landing?.grid_3,
    },
    {
      image: CryptovaultPNG,
      content: locale.landing?.grid_4,
    },
    {
      image: BackintimePNG,
      content: locale.landing?.grid_5,
    },
    {
      image: AnalysisPNG,
      content: locale.landing?.grid_6,
    },
    {
      image: PrivatePNG,
      content: locale.landing?.grid_7,
    },
    {
      image: OpensourcePNG,
      content: locale.landing?.grid_8,
    },
    {
      image: DetectivePNG,
      content: locale.landing?.grid_9,
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
              <p>{locale.landing?.login}</p>
            </div>
          </LoginModal>
        </Header>
        <div className="w-full h-[calc(100%-96px)] flex flex-row mobile:flex-col mobile:overflow-y-auto bg-gray-100">
          <div className="w-2/5 mobile:w-full h-full mobile:h-auto pl-12 mobile:px-4 mobile:mt-4 flex flex-col justify-center">
            <p className="text-6xl mobile:text-4xl font-semibold">
              {locale.landing?.title}
            </p>
            <p className="text-4xl mobile:text-2xl">
              {locale.landing?.sub_quote}
            </p>
            <p className="mt-2 text-xl mobile:text-base">
              {locale.landing?.description}
            </p>
          </div>
          <div className="pl-6 mobile:pl-4 pr-4 py-4 w-3/5 mobile:w-full h-full mobile:h-auto grid grid-cols-3 grid-rows-3 gap-2">
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
