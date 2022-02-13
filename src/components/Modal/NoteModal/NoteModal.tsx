import { useState } from "react";

import Modal from "../Modal";

interface INoteModal {
  submitNote?: ({}) => void;
  deleteNote?: ({}) => void;
  data?: {
    title: string;
    content: string;
    background: string;
  };
  children: any;
}

const NoteModal: React.FC<INoteModal> = (props) => {
  const colors = [
    "#ffffff",
    "#f28b82",
    "#fbbc04",
    "#fff475",
    "#ccff90",
    "#a7ffeb",
    "#cbf0f8",
    "#aecbfa",
    "#d7aefb",
    "#fdcfe8",
    "#e6c9a8",
    "#e8eaed",
  ];
  const [title, setTitle] = useState(
    props.data?.title ? props.data?.title : ""
  );
  const [content, setContent] = useState(
    props.data?.content ? props.data?.content : ""
  );
  const [background, setBackground] = useState(
    props.data?.background ? props.data?.background : colors[0]
  );
  const [closeModal, setCloseModal] = useState(false);

  const saveNote = () => {
    setCloseModal(true);
    const note: any = {
      ...props.data,
      title,
      content,
      background,
    };

    props.submitNote && props.submitNote(note);
    setTimeout(() => {
      setCloseModal(false);
    }, 500);
  };

  const deleteNote = () => {
    setCloseModal(true);

    props.deleteNote && props.deleteNote(props.data as any);
    setTimeout(() => {
      setCloseModal(false);
    }, 500);
  };

  return (
    <Modal title="Note" close={closeModal}>
      {props.children}
      <div className="w-full h-full py-4 flex flex-col mobile:justify-between">
        <div>
          <input
            className="w-full h-12 border rounded outline-none px-4"
            type="text"
            placeholder="Title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>
        <div className="mobile:h-3/4">
          <textarea
            className="w-full h-36 mobile:h-full outline-none border rounded mt-4 px-4 py-2 resize-none"
            placeholder="Content"
            value={content}
            onChange={(event) => setContent(event.target.value)}
          />
        </div>
        <div className="flex flex-row mobile:flex-col items-center mobile:items-stretch justify-between mobile:justify-end mt-4 mobile:h-16">
          <div className="flex flex-row items-center">
            <div className="flex flex-row items-center">
              {colors.map((color) => (
                <div
                  key={color}
                  className={`w-6 mobile:w-4 h-6 mobile:h-4 mx-1 rounded-full border-2 ${
                    background === color ? "border-black" : "border-gray-200"
                  }`}
                  style={{ background: color }}
                  onClick={() => setBackground(color)}
                ></div>
              ))}
            </div>
          </div>
          <div className="mobile:w-full flex flex-row pl-2 mobile:pl-0 mobile:mt-2">
            {props.data ? (
              <div
                className="mr-2 mobile:mr-0.5 w-16 mobile:w-full h-8 bg-red-200 rounded flex flex-row items-center justify-center cursor-pointer"
                onClick={deleteNote}
              >
                <p>Delete</p>
              </div>
            ) : null}
            <div
              className="ml-2 mobile:ml-0.5 w-16 mobile:w-full h-8 bg-yellow-200 rounded flex flex-row items-center justify-center cursor-pointer"
              onClick={saveNote}
            >
              <p>Save</p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default NoteModal;
