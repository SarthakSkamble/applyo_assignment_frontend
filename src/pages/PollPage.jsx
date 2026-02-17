import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import socket from "../socket";

function PollPage() {
  const { pollId } = useParams();

  const [poll, setPoll] = useState(null);
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState("");

  
  let voterToken = localStorage.getItem("voterToken");
  const link = `http://localhost:5174/poll/${pollId}`;
  if (!voterToken) {
    voterToken = crypto.randomUUID();
    localStorage.setItem("voterToken", voterToken);
  }

  
  useEffect(() => {
    async function fetchPoll() {
      try {
        const res = await fetch(
          `https://applyo-assignment-backend.onrender.com/api/v1/vote/${pollId}`
        );

        const data = await res.json();

        if (!res.ok) {
          setMessage(data.message);
          return;
        }

        setPoll(data);
      } catch (err) {
        console.error(err);
        setMessage("Failed to load poll");
      }
    }

    fetchPoll();
  }, [pollId]);

  
  useEffect(() => {
    socket.emit("joinPoll", pollId);

    socket.on("pollUpdated", (data) => {
      setPoll(data);
    });

    return () => {
      socket.off("pollUpdated");
    };
  }, [pollId]);

  
  async function handleVote() {
    if (!selected) return;

    try {
      const res = await fetch(
        `https://applyo-assignment-backend.onrender.com/api/v1/vote/voteforpoll/${pollId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            optionId: selected,
            voterToken,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message);
        return;
      }

      
      setPoll(data);
      setMessage("Vote submitted");

    } catch (err) {
      console.error(err);
      setMessage("Server error");
    }
  }

  if (!poll) return <div className="p-6 center">Loading...</div>;

  return (
    <div className="p-6 text-black w-[400px] shadow-2xl bg-white relative left-[450px] top-[130px]">
      <h1 className="text-2xl font-bold pb-[10px]">
        {poll.question}
      </h1>

      {poll.options.map((opt) => (
        <div key={opt.option_id} className="mb-2">
          <label className="cursor-pointer">
            <input
              type="radio"
              name="option"
              onChange={() => setSelected(opt.option_id)}
            />
            <span className="ml-2">
              {opt.text} — {opt.votes} votes
            </span>
          </label>
        </div>
      ))}

      <button
        onClick={handleVote}
        className="bg-black text-white px-4 py-2 rounded mt-4"
      >
        Vote
      </button>

      <div>{message}</div>
      <div> Sharable link:- {link}</div>
    </div>
  );
}

export default PollPage;