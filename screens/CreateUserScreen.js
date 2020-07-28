import React, { useEffect } from 'react';
import { Text, StyleSheet, View, ToastAndroid, Button, KeyboardAvoidingView } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { ip } from '../configs/config';

export default function CreateUserScreen(props) {
  return(
    <KeyboardAvoidingView behavior="position" style={styles.container}>
      <View style={{justifyContent: "center", alignItems: "center", marginTop: 50}}>
        <Text style={{fontSize: 25}}>CREATE USER</Text>
      </View>
      <CreateUser groupId={props.route.params.title} navigation={props.navigation}/>
    </KeyboardAvoidingView>
  )
}

const Row = (props) => {
  return(
    <View style={styles.item}>
      <Text style={styles.title}>{props.title}</Text>
      <TextInput
        value={props.value}
        placeholder={props.placeholder}
        style={styles.inputItem}
        onChangeText={props.onChange}
        secureTextEntry={props.secureTextEntry ? true : false}
      />
    </View>
  )
}

const CreateUser = (props) => {
  return(
    <View style={[styles.centerTitle, {marginTop: 55}]}>
      <CreateUserForm groupId={props.groupId} navigation={props.navigation}/>
    </View>
  )
}

const CreateUserForm = (props) => {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");

  function validate() {
    let message = "";
    if (!username)      message = "Username cannot be empty!"
    else if (!password) message = "Password cannot be empty!"
    else if (!confirm)  message = "Confirm password cannot be empty!"
    else if (!name)     message = "Name cannot be empty!"
    else if (!phone)    message = "Phone cannot be empty!"
    else if (!email)    message = "Email cannot be empty!"
    else if (password != confirm) message = "Password and confirm password not match!"

    if (!message) return true;

    ToastAndroid.showWithGravityAndOffset(
      message,
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      25,
      50,
    );
    return false;
  }

  const createUser = async() => {
    if (validate()) {
      let result = {};
      try {
        const response = await fetch('http://' + ip + '/api/user/create.php', {
          method: 'POST',
          body: JSON.stringify({
            id: username,
            password: password,
            name: name,
            phone_number: phone,
            email: email,
            role: "user",
            group_id: props.groupId
          }),
        });
        result = await response.json();
        if (result.message == "User was created.") {
          ToastAndroid.showWithGravityAndOffset(
            "Created successfully!",
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50,
          );
          props.navigation.popToTop();
        } else {
          ToastAndroid.showWithGravityAndOffset(
            "Created failed!",
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            10,
            50,
          );
        }
      } catch (error) {
        console.log(error);
        ToastAndroid.showWithGravityAndOffset(
          result.message,
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50,
        );
      }
    }
  }

  return(
    <View>
      <View style={styles.form}>
        <Row title="Username: " value={username} placeholder="Enter username" onChange={setUsername}/>
        <Row title="Password: " value={password} placeholder="Enter password" onChange={setPassword} secureTextEntry={true}/>
        <Row title="Confirm: " value={confirm} placeholder="Confirm password" onChange={setConfirm} secureTextEntry={true}/>
        <Row title="Name: " value={name} placeholder="Enter name" onChange={setName}/>
        <Row title="Phone: " value={phone} placeholder="Enter phone" onChange={setPhone}/>
        <Row title="Email: " value={email} placeholder="Enter email" onChange={setEmail}/>
      </View>
        <View style={{flexDirection: "row", justifyContent: "space-between", marginTop: 125}}>
        <Button 
          title="                Create                " 
          onPress={() => {createUser()}}
        />
        <Button 
          title="                Cancel                " 
          color="grey"
          onPress={() => {props.navigation.goBack()}}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    backgroundColor: "#fff"
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 60,
    paddingTop: 5,
    paddingBottom: 10,
    paddingLeft: 10,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
  },
  title: {
    fontSize: 18,
    textAlignVertical: "center"
  },
  inputItem: {
    textAlignVertical: "center",
    fontSize: 16,
    borderBottomWidth: 1,
    borderColor: "black",
    width: 270,
  },
  centerTitle: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  form: {
    width: 378,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
  }
});