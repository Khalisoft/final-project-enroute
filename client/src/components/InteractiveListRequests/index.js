import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import FolderIcon from "@material-ui/icons/Folder";
import DeleteIcon from "@material-ui/icons/Delete";
import Divider from "@material-ui/core/Divider";
import AccountBoxRoundedIcon from "@material-ui/icons/AccountBoxRounded";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import NotInterestedIcon from "@material-ui/icons/NotInterested";
import Button from "@material-ui/core/Button";
import EventBusyIcon from "@material-ui/icons/EventBusy";
import PhoneIcon from "@material-ui/icons/Phone";
import CancelIcon from "@material-ui/icons/Cancel";
import MessageIcon from "@material-ui/icons/Message";
import EditIcon from "@material-ui/icons/Edit";
import NotificationsActiveIcon from "@material-ui/icons/NotificationsActive";
import moment from "moment";
import AirlineSeatReclineExtraIcon from "@material-ui/icons/AirlineSeatReclineExtra";
import EmojiPeopleRoundedIcon from "@material-ui/icons/EmojiPeopleRounded";
import MyLocationIcon from "@material-ui/icons/MyLocation";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Box from "@material-ui/core/Box";
import API from "../../utils/API";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 400, // limits display across very wide screens / desktops
    minWidth: 280,
    width: "95vw",
    border: `2px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    borderRadius: theme.spacing(3),

    "& svg": {
      margin: theme.spacing(0.25),
      "& hr": {},
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
    },
  },

  dropdown: {
    position: "absolute",
    top: 60,
    right: 0,
    left: 0,
    zIndex: 1,
    border: "1px solid",
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    borderRadius: theme.spacing(3),
    overflowWrap: "breakWord",
  },
  title: {
    margin: theme.spacing(4, 0, 2),
  },
}));

function generate(element) {
  return [0].map((value) =>
    React.cloneElement(element, {
      key: value,
    })
  );
}

export default function InteractiveListRequests({
  props,
  editRequest,
  deleteRequest,
}) {
  const classes = useStyles();
  const [formObject, setFormObject] = useState({});
  const [dense, setDense] = React.useState(false);
  const [secondary, setSecondary] = React.useState(true);
  const [open, setOpen] = React.useState(false);
  let phoneLink = "tel:" + "" || props.driver_id.phone;
  let smsLink = "sms:" + "" || props.driver_id.phone;
  // let tempTrip_id = props.trip_id;

  const handleClick = () => {
    setOpen((prev) => !prev);
  };

  const handleClickAway = () => {
    setOpen(false);
  };
  const handleClickEditRequest = () => {
    //TO DO call modal form here
    // editRequest(props._id, requestData)
  };
  const handleClickDeleteRequest = () => {
    deleteRequest(props._id);
  };

  function handleFormSubmit(event) {
    event.preventDefault();
    alert("Updating request..."); // TODO use Modal instead of alert
    console.log("FormObject= ", formObject);
    // if (formObject.from && formObject.to) {
    // From: and To: fields are mandatory.
    API.requestRide({
      from: formObject.from,
      to: formObject.to,
      departTime: formObject.time,
      departDate: formObject.date,
      isTransportVehicle: formObject.isTransportVehicle,
      hasPackage: formObject.hasPackage,
      requestNote: formObject.requestNote,
      seatsRequired: formObject.seatsRequired,
    })

      .then(function (res) {
        alert(JSON.stringify("Request updated..."));
      })

      .catch((err) => console.log(err));
  }
  return (
    <List>
      <Grid container justify="center" direction="column" alignItems="center">
        {generate(
          <div className={classes.root}>
            <ListItem>
              {/* <ListItemAvatar>
                <Avatar>
                  {props.status === "Confirmed" ? (
                    <AccountBoxRoundedIcon /> // TODO adopt Drivers avator
                  ) : (
                    <EmojiPeopleRoundedIcon />
                  )}
                </Avatar>
              </ListItemAvatar> */}

              <ListItemText
                primary={
                  <Grid container alignItems="center">
                    <MyLocationIcon />
                    {props.from}
                  </Grid>
                }
                secondary={
                  <Grid container alignItems="center">
                    <LocationOnIcon />
                    {props.to}
                  </Grid>
                }
              />

              {/* <ListItemText primary="Status" secondary={props.status} /> */}

              <ListItemText
                primary={moment(props.departDate).format("DD MMM")}
                secondary={props.departTime}
              />

              {/* <Divider variant="middle" /> */}
              {(() => {
                switch (props.status) {
                  case "Pending":
                    return (
                      <Grid
                        direction="row"
                        justify="center"
                        alignItems="center"
                      >
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => {
                            handleClickEditRequest();
                          }}
                          startIcon={<EditIcon />}
                          fontSize="large"
                        >
                          Edit
                        </Button>
                      </Grid>
                    );

                  case "Confirmed":
                    return (
                      <Grid
                        direction="row"
                        justify="center"
                        alignItems="center"
                      >
                        <DeleteIcon
                          color="disabled"
                          fontSize="large"
                          onClick={
                            () => handleClickDeleteRequest() // todo delete request
                          }
                        />

                        <a href={phoneLink}>
                          <PhoneIcon color="secondary" fontSize="large" />
                        </a>

                        <ClickAwayListener onClickAway={handleClickAway}>
                          <span>
                            {open ? (
                              <ExpandLess
                                fontSize="large"
                                onClick={handleClick}
                              />
                            ) : (
                              <ExpandMore
                                fontSize="large"
                                onClick={handleClick}
                              />
                            )}

                            {open ? (
                              <div className={classes.dropdown}>
                                {/* Click me, I will stay visible until you click
                                outside. */}
                                <Typography>
                                  <strong>Other Details</strong>
                                  <hr />
                                  Request Note:{" "}
                                  {props.requestNote ? (
                                    <Typography
                                      fontStyle="oblique"
                                      fontFamily="Monospace"
                                    >
                                      {props.requestNote}{" "}
                                    </Typography>
                                  ) : (
                                    "None"
                                  )}{" "}
                                  <br />
                                  Seats required:{" "}
                                  {props.seatsRequired
                                    ? "  " + props.seatsRequired
                                    : "None"}{" "}
                                  <br />
                                  Has a pacakge?:{" "}
                                  {props.hasPackage ? " Yes" : "No"} <br />
                                </Typography>
                              </div>
                            ) : null}
                          </span>
                        </ClickAwayListener>
                      </Grid>
                    );
                }
              })()}
            </ListItem>
          </div>
        )}
      </Grid>
    </List>
  );
}