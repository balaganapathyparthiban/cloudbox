import { RiSearch2Line, RiLogoutCircleRLine, RiAddFill } from "react-icons/ri";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Web3Storage } from "web3.storage";
import SHA256 from "crypto-js/sha256";
import { MdDelete, MdFileDownload } from "react-icons/md";
import { toast } from "react-toastify";
import axios from "axios";
import {
  FaRegFileAudio,
  FaRegFileVideo,
  FaRegFileImage,
  FaRegFileArchive,
} from "react-icons/fa";
import { SiMicrosoftonenote } from "react-icons/si";

import Logo from "../../components/Logo/Logo";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import { makeStorageClient } from "../../utils/storage";
import { db, SEA } from "../../utils/db";
import Loader from "../../components/Loader/Loader";
import NoteModal from "../../components/Modal/NoteModal/NoteModal";
import { LocaleContext } from "../../store/store";

const Dashboard: React.FC = () => {
  const locale = useContext(LocaleContext);
  const userName = localStorage.getItem("userName");
  const menuList = [
    {
      name: "document",
      accept:
        ".7z,.xz,.rar,.tar,.gz,.iso,application/*,text/*,font/*,model/*,multipart/*,message/*",
    },
    { name: "image", accept: "image/*" },
    { name: "video", accept: "video/*" },
    { name: "audio", accept: "audio/*" },
    { name: "note", accept: "" },
  ];

  const navigate = useNavigate();
  const [selected, setSelected] = useState(0);
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [downloading, setDownloading] = useState<any>({});
  const [filter, setFilter] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("tkn")) {
      navigate("/");
      return;
    }
    const searchParams = new URLSearchParams(window.location.search);
    const tab =
      searchParams.get("tab") !== null
        ? parseInt(searchParams.get("tab") as string)
        : 0;

    updateSelectedTab(tab);
    fetchFileData(menuList[tab].name);
  }, []);

  const getDBCollection = async () => {
    if (!localStorage.getItem("userName")) {
      logout();
      return "";
    }

    const collection = SHA256(
      JSON.stringify({
        data: localStorage.getItem("userName") || "",
        secret: import.meta.env.VITE_DB_HASH
          ? import.meta.env.VITE_DB_HASH.toString()
          : "",
      })
    );

    return collection.toString();
  };

  const fetchFileData = async (tab: string) => {
    setLoading(true);

    const collection = await getDBCollection();
    Promise.race([(db.get(collection).get("files").get(tab) as any).then()])
      .then(async (data) => {
        if (!data) return;

        try {
          delete data["_"];
          let filesData: any[] = await Promise.all(
            Object.keys(data).map(async (key) => {
              if (!data[key]) return null;

              const decryptData: any = await SEA.decrypt(
                data[key],
                import.meta.env.VITE_DB_HASH
                  ? import.meta.env.VITE_DB_HASH.toString()
                  : ""
              );
              return { key: key.toString(), ...decryptData };
            })
          );

          filesData = filesData.filter((d) => d);
          setFiles(filesData);
        } catch (e) {
          console.log(e);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const storeWithProgress = async (
    file: File,
    progressCallback?: (progress: number) => void
  ) => {
    let uploaded = 0;
    const fileName = file.name;
    const fileSize = file.size;
    const fileType = file.type;
    const client = makeStorageClient() as Web3Storage;

    const toBase64 = () =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);

        reader.readAsDataURL(file);
      });

    const encryptedData = new File(
      [
        await SEA.encrypt(
          await toBase64(),
          import.meta.env.VITE_DB_HASH
            ? import.meta.env.VITE_DB_HASH.toString()
            : ""
        ),
      ],
      `${fileName}.encrypt`,
      {
        type: "text/plain",
      }
    );

    const cid = await client.put([encryptedData], {
      onStoredChunk: (size: number) => {
        uploaded += size;
        const progress = Math.round((fileSize / uploaded) * 100);
        progressCallback && progressCallback(progress);
      },
    });

    return {
      name: fileName,
      extension: fileName.substring(fileName.lastIndexOf(".") + 1),
      type: fileType,
      size: fileSize,
      content: cid,
      createdAt: new Date().toLocaleString(),
    };
  };

  const fileUploadHandler = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    if (event.target.files[0].size / 1000000 > 5) {
      toast.error("File size limited to 5MB.");
      return;
    }

    setIsUploading(true);

    const uploadedData = await storeWithProgress(
      event.target.files[0],
      (progress: number) => {
        console.log(progress);
      }
    );

    const collection = await getDBCollection();
    const encryptedData = await SEA.encrypt(
      uploadedData,
      import.meta.env.VITE_DB_HASH
        ? import.meta.env.VITE_DB_HASH.toString()
        : ""
    );

    db.get(collection)
      .get("files")
      .get(menuList[selected].name)
      .put({ [new Date().getTime()]: encryptedData });

    setFiles([uploadedData, ...files]);
    setIsUploading(false);
    toast.success(`${uploadedData.name} is uploaded.`);
  };

  const fileDownloadHandler = async (file: any) => {
    setDownloading({ ...downloading, [file.key]: true });
    const response = await axios.get(
      `https://${file.content}.ipfs.dweb.link/${file.name}.encrypt`
    );

    const deCryptedFile = await SEA.decrypt(
      response.data,
      import.meta.env.VITE_DB_HASH
        ? import.meta.env.VITE_DB_HASH.toString()
        : ""
    );

    const a: any = document.createElement("a");
    a.href = deCryptedFile;
    a.download = file.name;
    a.click();
    setDownloading({ ...downloading, [file.key]: false });
  };

  const fileDeleteHandler = async (file: any) => {
    const client = makeStorageClient() as Web3Storage;
    const collection = await getDBCollection();

    db.get(collection)
      .get("files")
      .get(menuList[selected].name)
      .put({ [file.key]: null });

    setFiles(files.filter((f) => f.key != file.key));
    toast.error(`${file.name} is deleted.`);

    await client.delete(file.ontentId);
  };

  const logout = () => {
    localStorage.removeItem("userName");
    localStorage.removeItem("tkn");
    navigate("/");
  };

  const calculateFileSize = (size: number) => {
    if (size >= 1000000000) {
      return `${size / 1000000000} GB`;
    } else if (size >= 1000000) {
      return `${size / 1000000} MB`;
    } else if (size >= 1000) {
      return `${size / 1000} KB`;
    } else {
      return `${size} bytes`;
    }
  };

  const submitNoteHandler = async (note: any) => {
    let isNew = true;
    let key = new Date().getTime();
    if (!note.key) {
      note.createdAt = new Date().toLocaleString();
    } else {
      isNew = false;
      key = note.key;
      delete note.key;
    }

    const collection = await getDBCollection();
    const encryptedData = await SEA.encrypt(
      note,
      import.meta.env.VITE_DB_HASH
        ? import.meta.env.VITE_DB_HASH.toString()
        : ""
    );

    db.get(collection)
      .get("files")
      .get(menuList[selected].name)
      .put({ [key]: encryptedData });

    if (isNew) {
      setFiles([note, ...files]);
    } else {
      setFiles(
        files.map((file) => {
          if (file.key == key) {
            file = note;
          }
          return file;
        })
      );
    }
  };

  const deleteNoteHandler = async (note: any) => {
    const collection = await getDBCollection();

    db.get(collection)
      .get("files")
      .get(menuList[selected].name)
      .put({ [note.key]: null });

    setFiles(files.filter((f) => f.key != note.key));
    toast.error(`${note.title} is deleted.`);
  };

  const updateSelectedTab = (tab: number) => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("tab", `${tab}`);
    const newRelativePathQuery = `${
      window.location.pathname
    }?${searchParams.toString()}`;
    history.pushState(null, "", newRelativePathQuery);

    setFiles([]);
    setSelected(tab);
    fetchFileData(menuList[tab].name);
  };

  return (
    <div className="w-screen h-screen bg-white text-gray-800 overflow-hidden">
      <div className="border-b">
        <Header>
          <Logo textClass="text-gray-400" hideTitleInMobile />
          <div className="w-2/4 h-full mx-6 mobile:mx-0 relative">
            <div className="absolute left-3 top-3">
              <RiSearch2Line className="text-lg" />
            </div>
            <input
              type="text"
              className="mobile:text-sm w-full h-full outline-none bg-gray-100 focus:bg-white border rounded shadow pl-12 mobile:pl-10 pr-4"
              placeholder="Search in box"
              onChange={(event) => setFilter(event.target.value)}
            />
          </div>
          <div className="flex flex-row items-center">
            <div className="mr-4 flex flex-row items-center">
              <div className="w-8 h-8 bg-gray-200 flex flex-row justify-center items-center rounded-full">
                <span>{userName && userName[0].toUpperCase()}</span>
              </div>
              <p className="ml-2 text-sm capitalize mobile:hidden">
                {userName}
              </p>
            </div>
            <div className="cursor-pointer" onClick={logout}>
              <RiLogoutCircleRLine className="text-2xl" />
            </div>
          </div>
        </Header>
      </div>
      <div className="w-full h-[calc(100%-96px)] overflow-hidden bg-white flex flex-row">
        <div className="w-1/5 h-full border-r px-2 py-4 overflow-hidden">
          <div className="flex flex-col">
            <div
              className={`flex flex-row items-center px-4 py-2 my-2 rounded cursor-pointer ${
                selected === 0 ? "bg-yellow-200" : ""
              }`}
              onClick={() => updateSelectedTab(0)}
            >
              <FaRegFileArchive className="text-xl" />
              <p className="ml-2 mobile:hidden">
                {locale.dashboard?.documents}
              </p>
            </div>
            <div
              className={`flex flex-row items-center px-4 py-2 my-2 rounded cursor-pointer ${
                selected === 1 ? "bg-yellow-200" : ""
              }`}
              onClick={() => updateSelectedTab(1)}
            >
              <FaRegFileImage className="text-xl" />
              <p className="ml-2 mobile:hidden">{locale.dashboard?.images}</p>
            </div>
            <div
              className={`flex flex-row items-center px-4 py-2 my-2 rounded cursor-pointer ${
                selected === 2 ? "bg-yellow-200" : ""
              }`}
              onClick={() => updateSelectedTab(2)}
            >
              <FaRegFileVideo className="text-xl" />
              <p className="ml-2 mobile:hidden">{locale.dashboard?.videos}</p>
            </div>
            <div
              className={`flex flex-row items-center px-4 py-2 my-2 rounded cursor-pointer ${
                selected === 3 ? "bg-yellow-200" : ""
              }`}
              onClick={() => updateSelectedTab(3)}
            >
              <FaRegFileAudio className="text-xl" />
              <p className="ml-2 mobile:hidden">{locale.dashboard?.audios}</p>
            </div>
            <div
              className={`flex flex-row items-center px-4 py-2 my-2 rounded cursor-pointer ${
                selected === 4 ? "bg-yellow-200" : ""
              }`}
              onClick={() => updateSelectedTab(4)}
            >
              <SiMicrosoftonenote className="text-xl mobile:scale-125" />
              <p className="ml-2 mobile:hidden">{locale.dashboard?.notes}</p>
            </div>
          </div>
        </div>
        {loading ? (
          <div className="w-full h-full flex flex-row justify-center items-center">
            <Loader />
          </div>
        ) : (
          <div className="w-4/5 h-full p-4 flex flex-col overflow-hidden">
            <div className="w-auto h-auto">
              {selected === 4 ? (
                <NoteModal submitNote={submitNoteHandler}>
                  <div className="w-48 mobile:w-full mt-2 flex flex-row items-center justify-center py-2 rounded cursor-pointer bg-yellow-200">
                    <RiAddFill />
                    <p className="pl-1 text-sm capitalize">
                      {locale.dashboard?.add_note}
                    </p>
                  </div>
                </NoteModal>
              ) : (
                <label
                  htmlFor="fileUpload"
                  className="w-48 mobile:w-full mt-2 flex flex-row items-center justify-center py-2 rounded cursor-pointer bg-yellow-200"
                >
                  {isUploading ? (
                    <p>uploading...</p>
                  ) : (
                    <>
                      <RiAddFill />
                      <p className="pl-1 text-sm capitalize">
                        {selected === 0
                          ? locale.dashboard?.upload_document
                          : selected === 1
                          ? locale.dashboard?.upload_image
                          : selected === 2
                          ? locale.dashboard?.upload_video
                          : selected === 3
                          ? locale.dashboard?.upload_audio
                          : ""}
                      </p>
                    </>
                  )}
                  <input
                    id="fileUpload"
                    type="file"
                    className="w-0 h-0 opacity-0"
                    onChange={fileUploadHandler}
                    accept={menuList[selected].accept}
                    disabled={isUploading}
                  />
                </label>
              )}
            </div>
            {files.length === 0 ? (
              <div className="w-full h-full flex flex-row justify-center items-center">
                <p className="text-gray-400">
                  {locale.dashboard?.no_files_found}
                </p>
              </div>
            ) : null}
            <div
              className="grid grid-cols-4 tablet:grid-cols-2 mobile:grid-cols-1 gap-6 mt-6 overflow-x-hidden overflow-y-auto"
              style={{ gridColumn: "auto", gridRow: "auto" }}
            >
              {selected == 4 &&
                files
                  .reverse()
                  .filter((file) => {
                    if (!filter) return true;
                    if (file.title.includes(filter)) {
                      return true;
                    }
                    return false;
                  })
                  .map((file, index) => {
                    return (
                      <NoteModal
                        data={file}
                        key={[file.title, index].join("_")}
                        submitNote={submitNoteHandler}
                        deleteNote={deleteNoteHandler}
                      >
                        <div
                          className="w-auto h-auto border bg-white rounded shadow p-2 cursor-pointer"
                          style={{ background: file.background }}
                        >
                          <p className="text-lg break-words">{file.title}</p>
                          <p className="text-sm break-words">{file.content}</p>
                          <p className="text-xs text-gray-400">
                            {file.createdAt}
                          </p>
                        </div>
                      </NoteModal>
                    );
                  })}
              {selected !== 4 &&
                files
                  .reverse()
                  .filter((file) => {
                    if (!filter) return true;
                    if (file.name.includes(filter)) {
                      return true;
                    }
                    return false;
                  })
                  .map((file, index) => {
                    return (
                      <div
                        className="border bg-white rounded shadow p-2"
                        key={[file.fileName, index].join("_")}
                      >
                        <div className="flex flex-col">
                          <div className="w-full flex flex-row items-center justify-between">
                            <p className="text-xl text-gray-400">
                              {file.extension}
                            </p>
                            <div className="flex flex-row">
                              {downloading[file.key] ? (
                                <span>...</span>
                              ) : (
                                <MdFileDownload
                                  className="mx-2 text-xl cursor-pointer"
                                  onClick={() => fileDownloadHandler(file)}
                                />
                              )}
                              <MdDelete
                                className="text-red-400 text-xl cursor-pointer"
                                onClick={() => fileDeleteHandler(file)}
                              />
                            </div>
                          </div>
                          <p className="text-lg">{file.name}</p>
                          <p className="text-xs text-gray-400">
                            {calculateFileSize(file.size)}
                          </p>
                          <p className="text-xs text-gray-400">
                            {file.createdAt}
                          </p>
                        </div>
                      </div>
                    );
                  })}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
