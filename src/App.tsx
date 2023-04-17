import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import LoginBtn from "./components/LoginBtn";
import { useAuth0 } from "@auth0/auth0-react";

interface Chat {
  user: string;
  message: string;
}

function App() {
  const { user, isAuthenticated } = useAuth0();
  const [time, setTime] = useState<string | Date>("fetching..");
  const [message, setMessage] = useState("");
  const [sentMessages, setSentMessages] = useState<Chat[]>([]);
  const socketRef = useRef<Socket | null>(null);
  const colors = ["bg-red-500", "bg-blue-500", "bg-green-500"];
  const color = colors[Math.floor(Math.random() * colors.length)];

  useEffect(() => {
    socketRef.current = io("http://localhost:3000");

    socketRef.current.on("connect", () => console.log(socketRef.current!.id));
    socketRef.current.on("connect_error", () => {
      setTimeout(() => socketRef.current!.connect(), 5000);
    });

    socketRef.current.on("message", (data) => {
      setSentMessages((prevData) => [...prevData, data]);
    });

    socketRef.current.on("disconnect", () => setTime("server disconnected"));

    return () => {
      socketRef.current!.disconnect();
    };
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isAuthenticated) {
      return alert("Please login before you send a message");
    }

    socketRef.current!.emit("message", { message: message, user: user?.name });
    setMessage("");
  };

  return (
    <div className="App">
      <nav className="flex justify-between items-center p-4 h-20">
        <h1 className="text-center laptop:text-6xl text-xl font-bold">
          ChatApp
        </h1>
        <LoginBtn />
      </nav>
      <main className="bg-slate-100 min-h-screen">
        <form onSubmit={handleSubmit} className="p-4 flex justify-center">
          <div className="form-control">
            <div className="input-group">
              <input
                type="text"
                placeholder="message"
                className="input input-bordered"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
              />
              <button type="submit" className="btn btn-square">
                Send
              </button>
            </div>
          </div>
        </form>
        <div className="flex flex-col gap-6 w-[350px] mx-auto bg-slate-50 shadow-xl p-6">
          {sentMessages.map((message, index) => (
            <p key={index}>
              <span className="font-semibold">{message.user}:</span>{" "}
              <span
                className={`${
                  message.user == user?.name ? "bg-blue-500" : "bg-red-500"
                } p-2 rounded-xl`}
              >
                {message.message}
              </span>
            </p>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
