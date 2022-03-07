import { useContext } from "react";
import { AiOutlineCode } from "react-icons/ai";

import { LocaleContext } from "../../store/store";

const Footer: React.FC = () => {
  const locale = useContext(LocaleContext);

  return (
    <div className="mobile:text-xs w-full h-10 px-6 py-2 border-t bg-white fixed bottom-0 flex flex-row items-center justify-between">
      <div className="flex flex-row items-center">
        <a href={locale.footer?.github_url} target="_blank">
          <div className="flex items-center">
            <AiOutlineCode className="text-lg mr-2" />
            <p>{locale.footer?.github}</p>
          </div>
        </a>
      </div>
      <div className="flex flex-row items-center">
        <p className="text-gray-800">{locale.footer?.open_source}</p>
        <a href={locale.footer?.bginnovate_url} target="_blank">
          <p className="mx-2">{locale.footer?.bginnovate}</p>
        </a>
      </div>
    </div>
  );
};

export default Footer;
