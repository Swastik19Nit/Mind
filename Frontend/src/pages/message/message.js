<<<<<<< Updated upstream
import { useNavigate } from "react-router-dom";
import { Logo } from "../../svgs/logoSVG";
import styles from "./message.module.css";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
=======
import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { FaMicrophone } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Logo } from "../../svgs/logoSVG";
import styles from "./message.module.css";
>>>>>>> Stashed changes
import axios from "axios";
import Markdown from "react-markdown";
import LoginContext from "../../context/context";
import { LuLogIn, LuLogOut } from "react-icons/lu";

function Chat({ text, own, isLoading = false }) {
  return (
    <div className={`${styles.chat} ${own && styles.own}`}>
      <Markdown>{text}</Markdown>
      {isLoading && <div className={styles.loadCursor}></div>}
    </div>
  );
}

function LoaderRipple() {
  return (
    <div className={styles["lds-ripple"]}>
      <div></div>
      <div></div>
    </div>
  );
}

function Message() {
  const [chatId, setChatId] = useState(null);
  const navigate = useNavigate();
  const { logout, loggedIn } = useContext(LoginContext);
  const mainRef = useRef();
  const [chat, setChat] = useState([]);
  const [chatState, setChatState] = useState("busy");
  const [chatInit, setChatInit] = useState(false);
  const [message, setMessage] = useState("");
  let ws = useRef(null);

  useEffect(() => {
    if (mainRef.current) {
      const container = mainRef.current;
      container.scrollTop = container.scrollHeight;
    }
  }, [chat]);
  useEffect(() => {
    async function fetchData() {
      try {
        const data = await axios.get(process.env.REACT_APP_API_LINK + "/chat", {
          withCredentials: true,
        });
        setChatId(data.data.chatId);
        console.log(data);
      } catch (error) {
        console.log("Error Fetching Data");
      }
    }
    fetchData();
  }, []);
  useEffect(() => {
    if (chatId !== null) {
      //make a websocket connection here
      let wss = new WebSocket(`wss://mindmate-ws.onrender.com?id=${chatId}`);
      wss.addEventListener("open", () => {
        console.log("Websocket connected");
        ws.current.send(JSON.stringify({ type: "client:connected" }));
        ws.current.send(JSON.stringify({ type: "client:chathist" }));
      });
      wss.addEventListener("message", (event) => {
        // console.log(event.data);
        const data = JSON.parse(event.data);

        if (data?.type === "server:chathist") {
          // console.log(data.data);
          const histdata = data?.data;
          if (!histdata) return;

          for (let conv of histdata) {
            if (conv.prompt) {
              setChat((prevchat) => [
                ...prevchat,
                { message: conv.prompt, own: true },
              ]);
            }
            if (conv.response) {
              setChat((prevchat) => [
                ...prevchat,
                { message: conv.response, own: false },
              ]);
            }
          }

          setChatState("idle");
          setChatInit(true);
          // promptBut.disabled = false;
        } else if (data?.type === "server:response:start") {
          // setChat((prevchat) => [
          //   ...prevchat,
          //   { message: "", own: false, isLoading: true },
          // ]);
        } else if (data?.type === "server:response:chunk") {
          setChat((prevchat) => {
<<<<<<< Updated upstream
            // prevchat.at(-1).message += data.chunk;
            // console.log("!!!", prevchat);
            // console.log("!!!", prevchat.slice(-1));
            return [
              ...prevchat.slice(0, -1),
              {
                message: `${prevchat.at(prevchat.length - 1).message}${
                  data.chunk
                }`,
                own: false,
                isLoading: true,
              },
            ];
=======
            const lastMessageIndex = prevchat.length - 1;
            const lastMessage = prevchat[lastMessageIndex];

            
            if (lastMessage && lastMessage.own) {
              return [
                ...prevchat,
                { message: data.chunk, own: false, isLoading: true },
              ];
            } else if (lastMessage && !lastMessage.isLoading) {
              
              const updatedMessage = {
                ...lastMessage,
                message: lastMessage.message + data.chunk,
              };
              return [...prevchat.slice(0, lastMessageIndex), updatedMessage];
            } else {
              
              const updatedMessage = {
                ...lastMessage,
                message: lastMessage.message + data.chunk,
              };
              return [...prevchat.slice(0, lastMessageIndex), updatedMessage];
            }
>>>>>>> Stashed changes
          });
          // console.log("@text", data.chunk);
        } else if (data?.type === "server:response:end") {
          // response = "";
          // promptBut.disabled = false;
          setChat((prevchat) => {
<<<<<<< Updated upstream
            return [
              ...prevchat.slice(0, -1),
              {
                message: prevchat.at(prevchat.length - 1).message,
                own: false,
                isLoading: false,
              },
            ];
=======
            const lastMessageIndex = prevchat.length - 1;
            const lastMessage = prevchat[lastMessageIndex];
            if (lastMessage && lastMessage.isLoading) {
              const updatedMessage = { ...lastMessage, isLoading: false };
              return [...prevchat.slice(0, lastMessageIndex), updatedMessage];
            }
            return prevchat;
>>>>>>> Stashed changes
          });
          setChatState("idle");
        }
      });
      ws.current = wss;
    }
  }, [chatId]);

  const handleClick = () => {
    setChat((prevchat) => [...prevchat, { message, own: true }]);
    console.log(message);
    ws.current?.send(
      JSON.stringify({
        type: "client:prompt",
        prompt: message,
      })
    );
    setMessage("");
    setChatState("busy");
    setChat((prevchat) => [
      ...prevchat,
      { message: "", own: false, isLoading: true },
    ]);
  };

  const logoutUser = async () => {
    try {
      const { data } = await axios.get(
        process.env.REACT_APP_API_LINK + "/logout",
        {
          withCredentials: true,
        }
      );
      console.log(data);
      if (data?.msg === "loggedout") {
        logout();
      }
    } catch (error) {
      console.log("Err in logout");
    }
  };

<<<<<<< Updated upstream
=======
  const handleSpeechRecognition = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error("Speech Recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    let recognitionTimeout;

    const stopRecognition = () => {
      clearTimeout(recognitionTimeout);
      recognition.stop();
      setIsListening(false);
    };

    recognition.start();
    setIsListening(true);

    recognition.onresult = (event) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        }
      }

      if (finalTranscript) {
        setChat((prevchat) => [...prevchat, { message: finalTranscript, own: true }]);
        if (ws.current) {
          ws.current.send(JSON.stringify({ type: "client:prompt", prompt: finalTranscript }));
        }
        setChatState("busy");
        setChat((prevchat) => [
          ...prevchat,
          { message: "", own: false, isLoading: true },
        ]);
        clearTimeout(recognitionTimeout);
        recognitionTimeout = setTimeout(stopRecognition, 2000);
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech Recognition Error:", event.error);
      stopRecognition();
    };
    recognition.onend = stopRecognition;
  };
>>>>>>> Stashed changes
  return (
    <div className={styles.messageContainer}>
      <header>
        <div className={styles.logoContainer} onClick={()=>{
          navigate('/')
        }}>
          <Logo />
          <div className={styles.headerText}>
            <h4>MindMate</h4>
            <h6>A mental health chat assistance</h6>
          </div>
        </div>

        <div className="flex flex-row gap-4">
          <button
            onClick={() => {
              if (!loggedIn) navigate("/login");
              else {
                navigate("/analysis");
              }
            }}
          >
            Analyse
          </button>

          <button
            onClick={() => {
              if (!loggedIn) navigate("/login");
              else {
                logoutUser();
              }
            }}
          >
            {!loggedIn ? <LuLogIn /> : <LuLogOut />}
          </button>
        </div>
      </header>
      <main
        ref={mainRef}
        style={
          !chatInit || chat.length === 0
            ? {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }
            : {}
        }
      >
        {!chatInit && (
          <div className={styles.loadingChatInit}>
            <LoaderRipple />
          </div>
        )}
        {chatInit && chat.length === 0 && (
          <div className={styles.emptyChat}>
            No Previous Chat History!
            <br />
            Chat with me now.
          </div>
        )}
        {chatInit &&
          chat &&
          chat.map((x, i) => {
            return (
              <Chat
                text={x.message}
                own={x.own}
                key={i}
                isLoading={x.isLoading ? true : false}
              />
            );
          })}
      </main>
      <footer>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            type="submit"
            onClick={() => {
              handleClick();
            }}
            disabled={chatState === "busy" ? true : false}
          >
            <span className="material-symbols-outlined">send</span>
          </button>
        </form>
      </footer>
    </div>
  );
}

export default Message;
