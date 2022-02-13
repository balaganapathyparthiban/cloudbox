import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <div className="mobile:text-xs w-full h-10 px-6 py-2 border-t bg-white fixed bottom-0 flex flex-row items-center justify-between">
      <div className="flex flex-row items-center">
        <p className="text-gray-400">Open Source</p>
        <a
          href="https://github.com/balaganapathyparthiban/cloudbox"
          target="_blank"
        >
          <p className="mx-4">Github</p>
        </a>
      </div>
      <div className="flex flex-row items-center">
        <Link to="/about">
          <p className="mx-2">About</p>
        </Link>
        <a href="https://bginnovate.com" target="_blank">
          <p className="mx-2">@bginnovate</p>
        </a>
      </div>
    </div>
  );
};

export default Footer;
