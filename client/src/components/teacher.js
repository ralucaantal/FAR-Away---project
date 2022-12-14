import React, { useState } from "react";
import IPv4 from "../index";
import "./css/teacher.css";

export default function Teacher() {
  // const navigate=useNavigate();
  const [errorDataRegisterActivity, setErrorDataRegisterActivity] = useState({
    message: "",
  });

  const [idUser, setIdUser] = useState({ idUser: "" });
  const [username, setUsername] = useState({ username: "" });
  const [password, setPassword] = useState({ password: "" });
  const [type, setType] = useState({ type: "" });
  const [token, setToken] = useState({ token: localStorage.getItem("token") });

  function decodeJWT() {
    if (localStorage.getItem("token")) {
      console.log("am intrat in decodeJWT");
      const data = {
        jwt: localStorage.getItem("token"),
      };
      const requestOptions = {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      };

      console.log(requestOptions);
      let input = IPv4 + ":5000/decodeJWT";

      fetch(input, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          if (data.message) {
            console.log(data.message);
          } else {
            console.log(data);
            setIdUser({ idUser: data.id });
            setUsername({ username: data.username });
            setPassword({ password: data.password });
            setType({ type: data.type });
          }
          // setErrorDataRegisterActivity({ message: data.message });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  React.useEffect(() => {
    decodeJWT();

    window.addEventListener("storage", () => {
      // When local storage changes, dump the list to
      // the console.
      //setToken({token: localStorage.getItem("token")})
      decodeJWT();
    });
  }, [token.token]);

  const handleNewActivityClick = (e) => {
    console.log("Am dat click");
    document.getElementById("newActivity").style.display = "block";
  };

  const handleMyActivitiesClick = (e) => {
    console.log("Am dat click");
    document.getElementById("myActivities").style.display = "block";
  };

  const handleLogout = (e) => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const activityData = {
    description: "",
    start: "",
    final: "",
    owner: idUser.idUser,
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(
      "Descriere: " +
        activityData.description +
        " " +
        "Inceput: " +
        activityData.start +
        " " +
        "Final: " +
        activityData.final
    );

    if (
      activityData.description !== "" &&
      activityData.start !== "" &&
      activityData.final !== ""
    ) {
      Array.from(document.querySelectorAll("input")).forEach(
        (input) => (input.value = "")
      );

      const requestOptions = {
        method: "POST",
        body: JSON.stringify(activityData),
        headers: { "Content-Type": "application/json" },
      };

      console.log(requestOptions);
      let input = IPv4 + ":5000/addActivity";

      fetch(input, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          console.log(data.message);
          setErrorDataRegisterActivity({ message: data.message });
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      console.log("Date invalide!");
      setErrorDataRegisterActivity({ message: "Date invalide!" });
      activityData.description = "";
      activityData.start = "";
      activityData.final = "";
      Array.from(document.querySelectorAll("input")).forEach(
        (input) => (input.value = "")
      );
    }
  };

  return (
    <div>
      <nav>
        <label className="pagProfesor">Pagina profesorului</label>
        <ul>
          <li>
            <a onClick={handleNewActivityClick}>Adauga activitate</a>
          </li>
          <li>
            <a onClick={handleMyActivitiesClick}>Activitatile mele</a>
          </li>
          <li>
            <a onClick={handleLogout}>Logout</a>
          </li>
        </ul>
      </nav>
      <div className="content">
        <div
          className="addActivityForm"
          id="newActivity"
          style={{ display: "none" }}
        >
          <form onSubmit={handleSubmit}>
            <div className="coverteacher">
              <h3>Adauga activitate</h3>

              <input
                type="descriere"
                placeholder="descriere activitate"
                onChange={(e) => (activityData.description = e.target.value)}
              />

              <h5>Incepe la: </h5>
              <input
                type="datetime-local"
                onChange={(e) => (activityData.start = e.target.value)}
              />
              <h5>Se termina la: </h5>
              <input
                type="datetime-local"
                onChange={(e) => (activityData.final = e.target.value)}
              />

              <div className="inscriere-btn">
                <button className="btn1">Login</button>
              </div>
              <div>{errorDataRegisterActivity.message}</div>
            </div>
          </form>
        </div>
        <div className="myActivities" id="myActivities" style={{ display: "none" }}>
          <h3>Activitatile mele</h3>
        </div>
      </div>
    </div>
  );
}
