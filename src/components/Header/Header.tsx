interface IHeader {
  children?: any;
}

const Header: React.FC<IHeader> = (props) => {
  return (
    <div className="w-full h-14 px-6 mobile:px-4 py-2 flex flex-row justify-between items-center">
      {props.children}
    </div>
  );
};

export default Header;
