import React, { useState, useEffect } from "react";
// import DateFnsUtils from "@date-io/date-fns";
// import 'date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import Moment from "react-moment";
import DeleteBtn from "../components/DeclineBtn";
import Jumbotron from "../components/Jumbotron";
import API from "../utils/API";
import { Link } from "react-router-dom";
import { Col, Row, Container } from "../components/Grid";
import { List, ListItem } from "../components/List";
import { makeStyles } from "@material-ui/core/styles";
import {
  InputWithIcon,
  BasicTextFields,
  TextArea,
  FormBtn,
} from "../components/Form";
import {
  Input,
  TextField,
  MenuItem,
  Button,
  Checkbox,
  FormControlLabel,
} from "@material-ui/core/";

import "./drive.css";

function Drive() {
  // Setting our component's initial state

  const [trips, setTrip] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [formObject, setFormObject] = useState({});
  const [carryPackage, setCarryPackage] = useState(false);

  const useStyles = makeStyles((theme) => ({
    root: {
      "& .MuiTextField-root": {
        margin: theme.spacing(1),
        width: "25ch",
      },
    },
    container: {
      display: "flex",
      flexWrap: "wrap",
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 200,
    },
  }));
  const classes = useStyles();
  let uniqueRouteList = [];

  // TODO Initialise and Load Requests from database, to be displayed in newfeed
  useEffect(() => {
    loadTrips();
    loadRoutes();
  }, []);

  // TODO Loads recent Requests with status = 'complete' and sets them to trips
  function loadTrips() {
    API.getTrips()
      .then(function (res) {
        setTrip(res.data);
        console.log("My Trips  ", res.data);
      })
      .catch((err) => console.log(err));
  }
  function loadRoutes() {
    let routeList = [];

    API.getRoutes()
      .then(function (res) {
        res.data.map((route) => {
          routeList.push(route.from, route.to);
          console.log("Response of getroutes=", route.from);
        });
        uniqueRouteList = [...new Set(routeList)]; // removes duplicate elements in array
        setRoutes(uniqueRouteList);
        console.log("Preset routes all  ", routeList);
        console.log("Preset routes unique  ", uniqueRouteList);
      })
      .catch((err) => console.log(err));
  }
  console.log("loggin uniue routes =", uniqueRouteList);
  // console.log("loggin uniue routes =",routeList)

  // Handles updating component state when the user types into the input field
  function handleInputChange(event) {
    const { name, value } = event.target;
    setFormObject({ ...formObject, [name]: value });
  }

  function handleCarryPackageChange(e) {
    const checked = e.target.checked;
    console.log("carryPackage checked:", checked);
    setCarryPackage(checked); // sets DOM checkbox
    setFormObject({ ...formObject, carryPackage: checked }); // sets formObject
  }

  // When the form is submitted, use the API.saveTrip method to save the trip data
  // Then reload trips from the database
  function handleFormSubmit(event) {
    event.preventDefault();
    console.log("FormObject carryPackage= ", formObject.carryPackage);
    // if (formObject.from && formObject.to) {
    // From: and To: fields are mandatory.
    API.saveTrip({
      from: formObject.from,
      to: formObject.to,
      departTime: formObject.time,
      departDate: formObject.date,
      freeSeats: formObject.freeSeats,
      carryPackage: formObject.carryPackage,
      tripNote: formObject.tripNote,
      // user_id: req.user,
    })
      // .then((res) => loadTrips())
      .then((res) => alert(JSON.stringify(res.data)))
      .catch((err) => console.log(err));
    // }
  }

  return (
    <Container fluid>
      <Row>
        <Col size="md-12">
          <Jumbotron>
            <h1>Drive</h1>
          </Jumbotron>
          <form className={classes.root}>
            <TextField
              id="from"
              select
              label="From (required)"
              onChange={handleInputChange}
              name="from"
              helperText="Please select your start location"
              variant="outlined"
            >
              {routes.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              id="to"
              select
              label="To (required)"
              onChange={handleInputChange}
              name="to"
              helperText="Please select your end location"
              variant="outlined"
            >
              {routes.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
            <br />
            {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                disableToolbar
                variant="inline"
                format="dd/MM/yyyy"
                margin="normal"
                id="date-picker-inline"
                label="Select departure date"
                onChange={handleInputChange}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
            </MuiPickersUtilsProvider> */}

            <TextField
              id="departDate"
              type="date"
              name="date"
              label="Start Date"
              variant="outlined"
              onChange={handleInputChange}
              helperText="Date you'll be leaving..."
              InputLabelProps={{
                // removes the header from inside the input box
                shrink: true,
              }}
            />

            <TextField
              id="departTime"
              label="Start Time"
              variant="outlined"
              onChange={handleInputChange}
              type="time"
              name="time"
              helperText="Time you'll be leaving..."
              InputLabelProps={{
                // removes the header from inside the input box
                shrink: true,
              }}
            />
            <br />
            <TextField
              id="outlined-basic"
              label="Free Seats?"
              variant="outlined"
              onChange={handleInputChange}
              type="number"
              name="freeSeats"
              helperText="Number of seats available..."
            />
            <br />
            <TextField
              id="tripNote"
              label="Trip Note"
              multiline
              rows={4}
              variant="outlined"
              helperText="Enter note about your trip..."
            />

            {/* <TextArea
              onChange={handleInputChange}
              name="tripNote"
              helperText="Enter note about your trip..."
            /> */}
            <br />
            <FormControlLabel
              control={
                <Checkbox
                  checked={carryPackage}
                  onChange={handleCarryPackageChange}
                  name="carryPackage"
                  inputProps={{ "aria-label": "primary checkbox" }}
                />
              }
              label="Able to carry package"
            />
            <br/>


            {/* 
              <input
                type="checkbox"
                name="carryPackage"
                onChange={handleCarryPackageChange}
                checked={carryPackage}
              />
      
            </label> */}

            <FormBtn
              disabled={!(formObject.from && formObject.to)}
              onClick={handleFormSubmit}
            >
              Post Trip
            </FormBtn>
          </form>
        </Col>
      </Row>
      <Row>
        <Col size="md-2">
          <Link to="/ride">Go to Ride</Link>
        </Col>
      </Row>
    </Container>
  );
}

export default Drive;
