import React from 'react';
import { Text, TextInput, KeyboardAvoidingView, View, Button, Image, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import { useNavigation } from '@react-navigation/native';

export default class RegisterScreen extends React.Component {
  state = {
    username: '',
    isUsernameValid: false,
    password: '',
    isPasswordValid: false,
    fullname: '',
    isFullnameValid: false,
    phone: '',
    isPhoneValid: false,
    email: '',
    isEmailValid: false,
  }

  navigation = () => useNavigation();

  handleChange = (name, value) => {
    if (
      ([name] == "username" && value.length <= 15) ||
      ([name] == "password" && value.length <= 15) ||
      ([name] == "fullname" && value.length <= 50) ||
      ([name] == "phone" && value.length <= 12) ||
      ([name] == "email" && value.length <= 50)
    ) {
      this.setState({
        [name] : value
      });
    }
  };

  handlePress = () => {
    if (
      this.state.username === 'truongvo.it' &&
      this.state.password === '12345678'
    ) {
      this.props.navigation.navigate("Main");
    }
    else {
    }
  };

  render() {
    return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <Image style={styles.logo} source={require('../assets/logo.png')} />
      <View style={styles.form}>
        <View style={styles.formBoxInputElement}>
          <Text style={styles.label}>
            Username:
          </Text>
          <TextInput
            value={this.state.username}
            placeholder="Enter your username"
            onChangeText={(value) => this.handleChange("username", value)}
            style={styles.formInputElement}
          />
        </View>
        <View style={styles.formBoxInputElement}>
          <Text style={styles.label}>
            Password:&nbsp;
          </Text>
          <TextInput
            secureTextEntry={true}
            placeholder="Enter your password"
            value={this.state.password}
            onChangeText={(value) => this.handleChange("password", value)}
            style={styles.formInputElement}
          />
        </View>
        <View style={styles.formBoxInputElement}>
          <Text style={styles.label}>
            Fullname:&nbsp;
          </Text>
          <TextInput
            placeholder="Enter your fullname"
            value={this.state.fullname}
            onChangeText={(value) => this.handleChange("fullname", value)}
            style={styles.formInputElement}
          />
        </View>
        <View style={styles.formBoxInputElement}>
          <Text style={styles.label}>
            Phone:&nbsp;
          </Text>
          <TextInput
            placeholder="Enter your phone"
            value={this.state.phone}
            keyboardType="phone-pad"
            onChangeText={(value) => this.handleChange("phone", value)}
            style={styles.formInputElement}
          />
        </View>
        <View style={styles.formBoxInputElement}>
          <Text style={styles.label}>
            Email:&nbsp;
          </Text>
          <TextInput
            placeholder="Enter your email"
            value={this.state.email}
            keyboardType="email-address"
            onChangeText={(value) => this.handleChange("email", value)}
            style={styles.formInputElement}
          />
        </View>
        <View style={styles.formButton}>
          <Button
            title="Register"
            onPress={this.handlePress}
          />
        </View>
        <View style={[styles.formButton, {marginTop: 10}]}>
          <Button 
            title="Back to Login"
            color="grey"
            onPress={() => this.props.navigation.goBack()}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  )}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Constants.statusBarHeight,
    padding: 8,
    backgroundColor: '#00c4fa',
  },
  logo: {
    width: 200,
    height: 80,
    margin: 'auto',
    top: 100,
    marginBottom: 40,
  },
  form: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    height: 500,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingRight: 10,
  },
  formBoxInputElement: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  formInputElement: {
    fontSize: 16,
    borderBottomWidth: 1,
    borderColor: "black",
    width: 150,
  },
  formButton: {
    marginTop: 50,
    width: 150,
  }
});

