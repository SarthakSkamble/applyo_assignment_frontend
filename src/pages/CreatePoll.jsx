import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreatePoll() {
  const [question, setquestion] = useState("");
  const [options, setoptions] = useState([]);
  const [inputvalue, setinputvalue] = useState("");
  const [valid, setvalid] = useState("");

  const navigate = useNavigate();

  async function Handleinput(e) {
    e.preventDefault();

    if (question.trim() === "" || options.length < 2) {
      setvalid("Question and minimum 2 options are required");
      return;
    }

    try {
      const response = await fetch(
        "https://applyo-assignment-backend.onrender.com/api/v1/pollcreate/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question,
            options,
          }),
        }
      );

      const data = await response.json();
      const pollId = data.poll_id;
      console.log(data);

      if (!response.ok) {
        setvalid(data.message || "Something went wrong");
        return;
      }

      setquestion("");
      setoptions([]);
      setinputvalue("");
      setvalid("");

      navigate(`/poll/${pollId}`);
    } catch (error) {
      setvalid("Server error");
    }
  }

  function Handleoption(e) {
    e.preventDefault();

    if (inputvalue.trim() === "") return;

    setoptions((prev) => [...prev, inputvalue]);
    setinputvalue("");
  }

  function handleDelete(indexToDelete) {
    setoptions(options.filter((_, index) => index !== indexToDelete));
  }

  return (
    <>
      <div className="flex flex-col items-center mt-16">

        <div className="h-auto w-[442px] shadow-2xl bg-white rounded-3xl p-4">

          <div className="text-center underline text-black italic font-serif text-4xl">
            Create Poll
          </div>

          <div className="text-black pt-4 pl-2 pb-2 text-xl font-semibold">
            Question
          </div>

          <input
            placeholder="Question"
            value={question}
            className="w-[400px] border p-2 border-black ml-2 text-black"
            onChange={(e) => setquestion(e.target.value)}
          />

          <div className="text-black p-2">Input Option</div>

          <input
            placeholder="Option"
            className="w-[400px] border p-2 border-black ml-2 text-black"
            value={inputvalue}
            onChange={(e) => setinputvalue(e.target.value)}
          />

          <div className="flex justify-center pt-6">
            <button
              className="bg-black rounded w-[110px] h-[30px] text-white"
              onClick={Handleoption}
            >
              ADD OPTION
            </button>
          </div>

          <div className="text-black mt-4 ml-2">
            Options added:
            {options.map((opt, index) => (
              <div key={index} className="flex items-center gap-2 mt-1">
                <span>+ {opt}</span>
                <button
                  className="bg-red-500 text-white px-2 rounded"
                  onClick={() => handleDelete(index)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-6">
            <button
              className="bg-black rounded w-[110px] h-[30px] text-white"
              onClick={Handleinput}
            >
              Add Poll
            </button>
          </div>

          <div className="text-red-500 text-center mt-3">
            {valid}
          </div>
        </div>

        
        <p className="text-sm text-black mt-4 text-center max-w-[442px]">
          Note: Response after clicking the button may take a few seconds because
          this web application is deployed on a free instance.
        </p>
      </div>
    </>
  );
}

export default CreatePoll;
