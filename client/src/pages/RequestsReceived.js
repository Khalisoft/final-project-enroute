import React, { useState, useEffect } from "react";
import NotificationsActiveIcon from "@material-ui/icons/NotificationsActive";
import LocalTaxiIcon from "@material-ui/icons/LocalTaxi";
import PersonPinCircleIcon from "@material-ui/icons/PersonPinCircle";
import EmojiPeopleRoundedIcon from "@material-ui/icons/EmojiPeopleRounded";
import MessageIcon from "@material-ui/icons/Message";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import InteractiveListMatches from "../components/InteractiveListMatches";
import Jumbotron from "../components/Jumbotron";
import API from "../utils/API";
import { Container, Col, Row } from "../components/Grid"; // removed container
import Typography from "@material-ui/core/Typography";
import {
  makeStyles,
  ThemeProvider,
  createMuiTheme,
} from "@material-ui/core/styles";
import { Box, Grid } from "@material-ui/core/";

import "./drive.css";

import moment from "moment";
import { useParams } from "react-router-dom";
import AlertDialog from "../components/AlertDialog";

function RequestsReceived({ checkNotificationStatus }) {
  // Setting our component's initial state
  const [selectedTrip, setSelectedTrip] = useState({});
  const [matchingRequests, setMatchingRequests] = useState([]);
  const [page, setPage] = React.useState("ride");
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [alertMsg, setAlertMsg] = React.useState();

  const theme = createMuiTheme({
    palette: {
      primary: {
        light: "#FF9057",
        main: "#E64500",
        dark: "#259CBB",
        contrastText: "#fff",
      },
      secondary: {
        light: "#78849E",
        main: "#259CBB",
        dark: "#168387",
        contrastText: "#000",
      },
      // type: 'dark', // dark theme
      typography: {
        fontFamily: "Montserrat",
      },
    },
  });

  const useStyles = makeStyles((theme) => ({
    root: {
      container: {
        // display: "flex",
        // flexWrap: "wrap",
        width: "90vw",
      },
    },
  }));

  const classes = useStyles();

  // When this component mounts, grab the trip with the _id of props.match.params.id
  // e.g. localhost:3000/trips/599dcb67f0f16317844583fc
  const { id } = useParams();

  useEffect(() => {
    getMatchesbyTripId(id);
  }, []);

  function getMatchesbyTripId(id) {
    API.getTrip(id)
      .then((res) => {
        findMatchingRequests(res.data); // use trip data to find matching requests
        setSelectedTrip(res.data);
      })
      .catch((err) => console.log(err));
  }

  // Find matching Requests using Trip Data
  function findMatchingRequests(tripData) {
    API.findMatchingRequests(tripData)
      .then((res) => {
        setMatchingRequests(res.data); // re-renders matching requests
      })
      .catch((err) => console.log(err));
  }

  // Accept a matching request from the loaded list with a given id, then reloads matching requests from the db
  function acceptRequest(id, trip_idObject) {
    API.acceptRequest(id, trip_idObject)
      .then((res) => {
        setAlertMsg("accept");
        handleOpenAlertDialog();
        findMatchingRequests(selectedTrip); //re-renders matching requests
      })
      .catch((err) => console.log(err));
  }

  // Undo the accept matching request action
  function undoAcceptRequest(id, trip_idObject) {
    // request_id
    console.log("id = ", id, "trip_idObject = ", trip_idObject);
    API.undoAcceptRequest(id, trip_idObject)
      .then(() => {
        setAlertMsg("cancel");
        handleOpenAlertDialog();
        findMatchingRequests(selectedTrip);
      })
      .catch((err) => console.log(err));
  }

  function handleOpenAlertDialog() {
    setAlertDialogOpen(true);
  }

  function handleCloseAlertDialog() {
    setAlertDialogOpen(false);
  }

  return (
    <Box
      style={{
        paddingBottom: "90px", // ensures content is not hidden by footer
      }}
    >
      <Container fluid maxWidth="100vw">
          <Row>
        <ThemeProvider theme={theme}>
            <Col size="md-12">
              {alertDialogOpen && alertMsg === "accept" ? (
                <AlertDialog
                  dialogOpen={true}
                  btnOpenTxt="accept"
                  dialogTitle="Booking Confirmed"
                  dialogContentTxt="Notification sent to requestor"
                  btnOKTxt="OK"
                  handleClose={handleCloseAlertDialog}
                />
              ) : alertDialogOpen && alertMsg === "cancel" ? (
                <AlertDialog
                  dialogOpen={true}
                  btnOpenTxt="cancel"
                  dialogTitle="Booking Cancelled"
                  dialogContentTxt="Notification sent to requestor"
                  btnOKTxt="OK"
                  handleClose={handleCloseAlertDialog}
                />
              ) : null}
             
                <Jumbotron>
                  <Grid
                    container
                    direction="row"
                    justify="center"
                    alignItems="center"
                  >
                    <NotificationsActiveIcon fontSize="large" />
                    <Typography variant="outline" component="h3">
                      Drive - Requests Received
                    </Typography>
                  </Grid>
                </Jumbotron>
              

              <Grid container justify="center" alignItems="center">
                <div>
                  <h2>
                    {selectedTrip.from} - {selectedTrip.to}
                  </h2>

                  <h3>
                    {moment(selectedTrip.departDate).format("DD-MMM-YYYY")}{" "}
                    {selectedTrip.departTime}
                  </h3>
                  <h4>
                    {matchingRequests.length} Matching ride request(s) for this
                    trip!
                  </h4>
                </div>
              </Grid>

              {matchingRequests.length ? (
                <Grid
                  container
                  justify="center"
                  alignItems="center"
                  direction="column"
                >
                  {/* <List> */}
                  {matchingRequests.map((match) => (
                    <div>
                      <InteractiveListMatches
                        {...(match.trip_id = selectedTrip._id)} // spread syntax - bind trip_id to the matched request
                        props={match}
                        undoAcceptRequest={undoAcceptRequest}
                        acceptRequest={acceptRequest}
                      />
                    </div>
                  ))}
                  {/* </List> */}
                </Grid>
              ) : (
                <Grid
                  container
                  direction="row"
                  justify="space-evenly"
                  alignItems="center"
                >
                  <div>
                    <h4>
                      Hang in there...😁 <br />
                      Someone will evetually request a ride!
                    </h4>
                    <br />
                  </div>
                </Grid>
              )}

              <div
                style={{
                  position: "fixed",
                  left: "0",
                  bottom: "0",
                  height: "50px",
                  width: "100%",
                  maxWidth: "100%",
                  textAlign: "center",
                }}
              >
                <BottomNavigation
                  value={page}
                  onChange={(event, newValue) => {
                    setPage(newValue);
                  }}
                  showLabels
                  style={{
                    paddingRight: "30px", // TODO fix padding
                  }}
                >
                  <BottomNavigationAction
                    label="Ride"
                    icon={<EmojiPeopleRoundedIcon />}
                    href="/ride"
                  />
                  <BottomNavigationAction
                    label="My Trips"
                    icon={<PersonPinCircleIcon />}
                    href="/myTrips"
                  />
                  <BottomNavigationAction
                    label="Drive"
                    icon={<LocalTaxiIcon />}
                    href="/drive"
                  />
                  <BottomNavigationAction
                    label="Newsfeed"
                    icon={<MessageIcon />}
                    href="/newsfeed"
                  />
                </BottomNavigation>
                <br />
              </div>
            </Col>
        </ThemeProvider>
          </Row>
      </Container>
    </Box>
  );
}

export default RequestsReceived;
