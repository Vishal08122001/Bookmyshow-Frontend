import React, { useEffect, useState } from "react";
import axios from 'axios';
import './App.css'
import Navbar from "./components/navbar";
import { v4 as uuid } from "uuid";




const App = () => {

  const [movie, setMovie] = useState(null);
  const [slot, setSlot] = useState(null);
  const [seats, setSeats] = useState({});
  const [display, setdisplay] = useState([])






  //// For making a post call to our backend
  useEffect(() => {
    axios.get('https://mushy-gear-frog.cyclic.app/').then((res) => {
      setdisplay(res.data)
    }).catch((err) => {
      console.log(err)
    })
  }, [])



  // for storing divs in variable to change the background color on click
  var MovieDiv = document.getElementsByClassName("movie-column");
  var SlotDiv = document.getElementsByClassName("slot-column")





  // for setting the movie and changing the background color to "lightblue"
  const handleMovie = (e) => {
    function clear() {
      for (var i = 0; i < MovieDiv.length; i++) {
        var item = MovieDiv[i];
        item.style.backgroundColor = 'white';
      }
    }
    clear()
    e.target.style.backgroundColor = "#ADD8E6"
    setMovie(e.target.innerText);
  }






  // for setting up the slot value changing the background color to "lightblue"
  const handleSlot = (e) => {
    function clearSlot() {
      for (var i = 0; i < SlotDiv.length; i++) {
        var item = SlotDiv[i];
        item.style.backgroundColor = 'white';
      }
    }
    clearSlot()
    e.target.style.backgroundColor = "#ADD8E6"
    setSlot(e.target.innerText)
  }








  // for setting the seats count and type
  const handleSeat = (event) => {
    const { name, value } = event.target;
    setSeats((prevSeats) => ({ ...prevSeats, [name]: value }));
  };





  // Here we are storing our data to the Object
  const MovieData = [{
    movie: movie,
    slot: slot,
    seats: seats,
    uid: uuid()
  }]









  /////// Function to save the data to the DataBase.

  /* In this function first we are saving the data in our Database(MongoDB) and in localstorage also
  so that, we can get the data of last booking */

  function saveData() {
    if (!movie) {
      if (!window.confirm("Please select a Movie")) return;
      return
    }
    if (!slot) {
      if (!window.confirm("Please select a Slot")) return;
      return
    }
    if (Object.values(seats).filter(value => value).length === 0) {
      if (!window.confirm("Please select a Seats")) return;
      return;
    }

    axios.post("https://mushy-gear-frog.cyclic.app/api/booking", MovieData).then((res) => {
      localStorage.setItem('LastOrder', JSON.stringify(MovieData))
      console.log(res)
      window.location.reload()
    }).catch((err) => {
      // catching the error if any-
      console.log(err)
    })
  }



  /* In below code we are getting the data from localstorage so that we can compare its UID 
  while geeting the data from Database*/
  var previousBookingDetails = localStorage.getItem("LastOrder")
  if (previousBookingDetails) {
    var [uid] = JSON.parse(previousBookingDetails)
    var previousBookingUID = uid.uid

  }



  //  This is a function to delete the saved movie data :- this will send a delete request to the backend and then backend will 
  // delete that data from the database and this function will also clear the localstorage data.
  function handleclear() {
    axios.delete(`https://mushy-gear-frog.cyclic.app/${previousBookingUID}`).then((res) => {
      window.location.reload()
      localStorage.clear()
      console.log(res)
    }).catch((err) => {
      console.log(err)
    })
  }


  return (
    <>
      <div className="Main-boxx">
        <Navbar />
        <div className="Main-box">
          <h5 style={{ fontWeight: 'bold' }}>Book That Show!!</h5>
          <div className=" main" >
            <div className="container ">

              <div className=" movie-row">
                <p className="d-flex " style={{ width: "70vw" }}>Select A Movie</p>
                <p className="movie-column" onClick={handleMovie}>Fast And Furious</p>
                <p className="movie-column" onClick={handleMovie}>Men In Black</p>
                <p className="movie-column" onClick={handleMovie}>Avenger Endgame</p>
                <p className="movie-column" onClick={handleMovie}>Bahubali-2</p>
                <p className="movie-column" onClick={handleMovie}>Circus</p>
                <p className="movie-column" onClick={handleMovie}>Stuart Little</p>
              </div>

              <div className=" slot-row">
                <p className="d-flex " >Select A Slot</p>
                <p className="slot-column" onClick={handleSlot}>10:00 AM</p>
                <p className="slot-column" onClick={handleSlot} >12:00 PM</p>
                <p className="slot-column" onClick={handleSlot}>13:30 PM</p>
                <p className="slot-column" onClick={handleSlot}>18:00 PM</p>
                <p className="slot-column" onClick={handleSlot}>19:30 PM</p>
                <p className="slot-column" onClick={handleSlot}>21:00 PM</p>
              </div>

              <div className=" slot-row" id='input-group' >
                <p className="d-flex " >Select Seats</p>
                <p className="seat"> <label htmlFor="">Type A1</label>
                  <input onChange={handleSeat} name="A1" type="number" />
                </p>
                <p className="seat"> <label htmlFor="" >Type A2</label>
                  <input onChange={handleSeat} name="A2" type="number" />
                </p>
                <p className="seat"> <label htmlFor="">Type A3</label>
                  <input onChange={handleSeat} name="A3" type="number" />
                </p>
                <p className="seat"> <label htmlFor="">Type A4</label>
                  <input onChange={handleSeat} name="A4" type="number" />
                </p>
                <p className="seat"> <label htmlFor="">Type D1</label>
                  <input onChange={handleSeat} name="D1" type="number" />
                </p>
                <p className="seat"> <label htmlFor="">Type D2</label>
                  <input onChange={handleSeat} name="D2" type="number" />
                </p>
              </div>


              <div className="last-order">
                <div className="displayNav"><h6 className="heading">Last Booking Details </h6></div>

                {/* This previousBookingUID refers to the saved local storage's uid */}
                {previousBookingUID ? display.map(function (item, index) {
                  // Here we are fetching the data whose localstorage UID === database UID  if there is no match then return "No Booking"
                  if (previousBookingUID == item.uid) {
                    return (
                      <div key={index} >
                        <div className="displayData">
                          <p>Movie - {item.movie}</p>
                          <p>Slot - {item.slot}</p>
                          <p>Seats :- </p>
                          <p>A1 - {item.seats.A1 > 0 ? item.seats.A1 : 0} </p>
                          <p>A2 - {item.seats.A2 > 0 ? item.seats.A2 : 0} </p>
                          <p>A3 - {item.seats.A3 > 0 ? item.seats.A3 : 0} </p>
                          <p>A4 - {item.seats.A4 > 0 ? item.seats.A4 : 0} </p>
                          <p>D1 - {item.seats.D1 > 0 ? item.seats.D1 : 0} </p>
                          <p>D2 - {item.seats.D2 > 0 ? item.seats.D2 : 0} </p>
                          <button className="deleteButton" onClick={handleclear}>Delete</button>
                        </div>
                      </div>
                    )
                  }
                }) : <h6 className="noBooking">No Previous Booking</h6>}
              </div>
            </div>
          </div>
          <button className="book-button" onClick={saveData}>Book Now</button>
        </div>
      </div>
    </>
  );
}

export default App;
