import React from "react";
var {
  View,
  Image,
  Text,
  ScrollView,
  TouchableOpacity
} = require("react-native");
import styles from "./styles";
import { Actions } from "react-native-router-flux";

export default class EachAssignmentThumbnail extends React.Component {
  constructor() {
    super();
    this.state = {};
    this.getInitialsFromName = this.getInitialsFromName.bind(this);
  }

  getInitialsFromName() {
    var string = this.props.tutorUsername;
    var names = string.split(" "),
      initials = names[0].substring(0, 1).toUpperCase();
    return initials;
  }

  render() {
    console.log("EachChildThumbnail, props: " + JSON.stringify(this.props));
    const initials = this.getInitialsFromName();
    const displayInitials = (
      <View style={styles.imageWithInitials}>
        <Text style={styles.initials}>{initials}</Text>
      </View>
    );
    const inProgress = (
      <Image
        style={styles.status}
        source={require("../../../../assets/images/inProgress.png")}
      />
    );
    const done = (
      <Image
        style={styles.status}
        source={require("../../../../assets/images/done.png")}
      />
    );
    const overdue = (
      <Image
        style={styles.status}
        source={require("../../../../assets/images/overdue.png")}
      />
    );
    const dateFormat = new Date(this.props.dueDate).getTime();
    console.log("date format: " + dateFormat);
    var now = new Date();
    now = now.setHours(0, 0, 0, 0);
    const status =
      dateFormat >= now && this.props.done
        ? done
        : dateFormat >= now && !this.props.done
          ? inProgress
          : overdue;

    return (
      <View style={styles.taskContainer}>
        <View style={styles.infoContainer}>
          <View style={styles.infoCol1}>
            <Text style={styles.infoTitle}>{this.props.assignment}</Text>
            <Text style={styles.infoTutor}>
              Set by: {this.props.tutorUsername}
            </Text>
            <Text style={styles.infoDueDate}>Due on: {this.props.dueDate}</Text>
          </View>
          <View style={styles.infoCol2}>{status}</View>
        </View>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.editButton}>
            <Image
              style={styles.editImage}
              source={require("../../../../assets/images/edit.png")}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
