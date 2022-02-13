import Logo from "../Logo/Logo";

interface ILoader {
  backgroundClass?: string;
}

const Loader: React.FC<ILoader> = (props) => {
  return (
    <div className="w-screen h-screen absolute top-0 left-0 right-0 flex flex-row items-center justify-center">
      <div
        className={`w-full h-full z-10 absolute top-0 left-0 right-0 ${
          props.backgroundClass ? props.backgroundClass : "bg - white"
        }`}
      ></div>
      <div className="flex flex-col items-center justify-center z-20">
        <Logo />
        <div className="lds-ring">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
