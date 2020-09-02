import React from "react";
import axios from "axios";

function Index(props) {
  function doit() {
    axios
      .all([
        axios.put("http://localhost:5000/speakers/1124", {
            "bioFull": "I'm a developer, technical lead and development manager, interested in software design, architecture and continuous deployment. I'm passionate about building quality software and like to write and speak about technology when I can.\n\nNorthern Ireland native now happily based in San Francisco.",
            "twitterHandle": "@shaunabram",
            "company": "LendingClub",
            "id": 777,
            "bio": "Test obsessed developer who loves to write and speak about technology.",
            "name": "Shaun Abram",
            "favorite": true
        }),
        axios.put("http://localhost:5000/speakers/5443", {
            "bioFull": "Mark Abramson is Founder & CEO of Printform Corporation. He has particular technical expertise in digital workflow, industrial printing and complex global supply chains for high-growth companies.  He's also a dad, collects antique woodworking machines and mentors on Lean Startup methods.",
            "twitterHandle": "@mark__a",
            "company": "Printform Corporation",
            "id": 5443,
            "bio": "Mark is a globally recognized expert on digital printing for industrial and packaging applications.",
            "name": "Mark Abramson",
            "favorite": true
        }),
      ])
      .then(
        axios.spread((obj1, obj2) => {
          // Both requests are now complete
          console.log("done1");
          console.log("done2");
        })
      );
  }

  return (
    <div>
      Hello
      <button
        onClick={() => {
          doit();
        }}
      >
        DoIT
      </button>
    </div>
  );
}

export default Index;
