import React from "react";
import {
  AppRegistry,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Image,
  TouchableWithoutFeedback,
  ScrollView,
  StyleSheet
} from "react-native";
import Modal from "react-native-modal";
import { AsyncStorage } from "react-native";
import firebase from "firebase";
import {
  Scene,
  Router,
  ActionConst,
  Stack,
  Tabs,
  Drawer
} from "react-native-router-flux";
import styles from "./styles";
import { connect } from "react-redux";
import { Actions } from "react-native-router-flux";
import { Icon, ThemeProvider } from "react-native-material-ui";
import { actions as auth } from "./index";
import Settings from "./SideMenu/Settings";

const { signOut } = auth;

class NavBar extends React.Component {
  constructor() {
    super();
    this.state = {
      modalVisible: false,
      username: "Loading",
      profileImage: null,
      role: null,
      tuteeKey: null
    };
    this.setModalVisible = this.setModalVisible.bind(this);
    this.onSignOut = this.onSignOut.bind(this);
    this.setName = this.setName.bind(this);
    this.getUsername = this.getUsername.bind(this);
    this.getProfileImage = this.getProfileImage.bind(this);
    this.setProfileImage = this.setProfileImage.bind(this);
    this.getInitialsFromName = this.getInitialsFromName.bind(this);
    this.getRole = this.getRole.bind(this);
    this.setRole = this.setRole.bind(this);
    this.getTuteeKey = this.getTuteeKey.bind(this);
  }

  setName(name) {
    this.setState({ username: name });
  }

  setProfileImage(picture) {
    this.setState({ profileImage: picture });
  }

  setRole(role) {
    this.setState({ role: role });
  }

  componentDidMount() {
    this.getUsername();
    this.getProfileImage();
    this.getRole();
    this.getTuteeKey();
  }

  async getUsername() {
    AsyncStorage.getItem("user")
      .then(res => {
        res = JSON.parse(res);
        console.log("res: " + JSON.stringify(res));
        this.setName(res.user.username);
      })
      .catch(error => {
        console.log(error);
      });
  }

  async getProfileImage() {
    AsyncStorage.getItem("user")
      .then(res => {
        res = JSON.parse(res);
        console.log("res: " + JSON.stringify(res));
        if (typeof res.user.profileImage !== "undefined") {
          this.setProfileImage(res.user.profileImage);
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  async getRole() {
    AsyncStorage.getItem("user")
      .then(res => {
        res = JSON.parse(res);
        console.log("res: " + JSON.stringify(res));
        this.setRole(res.user.role);
      })
      .catch(error => {
        console.log(error);
      });
  }

  async getTuteeKey() {
    AsyncStorage.getItem("user")
      .then(res => {
        res = JSON.parse(res);
        console.log("res: " + JSON.stringify(res));
        this.setState({ tuteeKey: res.user.addTuteeKey });
      })
      .catch(error => {
        console.log(error);
      });
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  onSignOut() {
    this.props.signOut(this.onSuccess.bind(this), this.onError.bind(this));
  }

  getInitialsFromName(username) {
    var string = this.state.username;
    var names = string.split(" "),
      initials = names[0].substring(0, 1).toUpperCase();
    return initials;
  }

  onSuccess() {
    Actions.reset("Auth");
  }

  onError(error) {
    Alert.alert("Oops!", error.message);
  }

  render() {
    console.log(this.state.username);
    // console.log(this.state.profileImage);

    const initials = this.getInitialsFromName(this.state.username);
    // console.log("initials: " + initials);
    const profileImage = {
      uri: this.state.profileImage
    };

    console.log("profileImage: " + JSON.stringify(profileImage));
    const displayInitials = (
      <View style={styles.imageWithInitials}>
        <Text style={styles.initials}>{initials}</Text>
      </View>
    );
    const displayImage = <Image style={styles.image} source={profileImage} />;
    const display =
      typeof this.state.profileImage == null ? displayInitials : displayImage;

    return (
      <View>
        <Modal
          isVisible={this.state.modalVisible}
          animationIn="slideInLeft"
          animationOut="slideOutRight"
          onBackdropPress={() => this.setModalVisible(!this.state.modalVisible)}
          backdropOpacity={0.6}
          swipeDirection="left"
          style={styles.modal}
          onSwipe={() => {
            this.setModalVisible(false);
          }}
          onSwipeThreshold={20}
          animationOutTiming={200}
          animationInTiming={600}
          backdropTransitionOutTiming={100}
          backdropTransitionInTiming={600}
        >
          <View style={styles.popout}>
            {/* <Image
                style={styles.image}
                source={require("../../../assets/images/logo.png")}
              /> */}
            <View style={styles.imageContainer}>
              {/* <View style={styles.imagePlaceholder} /> */}
              {/* {displayImage} */}
              {this.state.profileImage == null ? displayInitials : displayImage}
              {/* <Image
                style={styles.image}
                source={{
                  uri: this.state.profileImage
                }}
              /> */}
            </View>
            <View style={styles.menuContainer}>
              <Text style={styles.name}>{this.state.username}</Text>
              <Text style={styles.key}>Key: {this.state.tuteeKey}</Text>
              <TouchableOpacity>
                <Text style={styles.menuContent}>Settings</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.onSignOut}>
                <Text style={styles.menuContent}>Sign Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <ThemeProvider>
          <View style={styles.container}>
            <TouchableOpacity
              onPress={() => {
                this.setModalVisible(true);
              }}
            >
              <Icon name="menu" style={[styles.menu]} size={30} />
            </TouchableOpacity>
            <Text style={styles.header}>Genius</Text>
            <Icon name="search" style={[styles.search]} size={30} />
          </View>
        </ThemeProvider>
      </View>
    );
  }
}

export default connect(null, { signOut })(NavBar);
