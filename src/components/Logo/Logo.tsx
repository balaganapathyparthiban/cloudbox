import KeepPNG from "/images/keep.png";
import { LocaleContext } from "../../store/store";
import { useContext } from "react";

interface ILogo {
  textClass?: string;
  hideTitleInMobile?: boolean;
}

const Logo: React.FC<ILogo> = (props) => {
  const locale = useContext(LocaleContext);

  return (
    <div className="w-auto h-full flex flex-row items-center">
      <div className="w-12 mobile:w-10 h-full">
        <img className="w-full h-full" src={KeepPNG} alt="logo" />
      </div>
      <div className={`mx-2 ${props.hideTitleInMobile ? "mobile:hidden" : ""}`}>
        <p
          className={`text-xl mobile:text-lg ${
            props.textClass ? props.textClass : "text-gray-800"
          }`}
        >
          Cloud Box
        </p>
      </div>
    </div>
  );
};

export default Logo;
