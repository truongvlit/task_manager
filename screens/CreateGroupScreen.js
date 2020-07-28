import React, { useEffect } from 'react';
import { Text, StyleSheet, View, Button, KeyboardAvoidingView, ToastAndroid } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { ip } from '../configs/config';

export default function CreateGroupScreen(props) {
  const [groupId, setGroupId] = React.useState("");
  const [focus, setFocus]     = React.useState(false);

  return(
    <KeyboardAvoidingView behavior={focus ? "none" : "position"} style={styles.container}>
      <GroupRow title="Group ID: " value={groupId} 
        placeholder="Enter new Group ID" 
        onChange={setGroupId} 
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}/>
      <CreateManager groupId={groupId} navigation={props.navigation}/>
    </KeyboardAvoidingView>
  )
}

const GroupRow = (props) => {
  return(
    <View style={styles.item}>
      <Text style={styles.title}>{props.title}</Text>
      <TextInput
        value={props.value}
        placeholder={props.placeholder}
        style={styles.inputItem}
        onChangeText={props.onChange}
        onFocus={() => props.onFocus()}
        onBlur={() => props.onBlur()}
      />
    </View>
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

const CreateManager = (props) => {
  return(
    <View style={[styles.centerTitle, {marginTop: 55}]}>
      {(props.groupId != null && props.groupId != "") &&
        <>
          <Text style={{fontSize: 20}}>Create Manager for Group ID</Text>
          <Text style={{fontSize: 20, color: "blue", marginBottom: 20}}>{props.groupId}</Text>
          <CreateManagerForm groupId={props.groupId} navigation={props.navigation}/>
        </>
      }
    </View>
  )
}

const CreateManagerForm = (props) => {
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

  const createManager = async() => {
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
            role: "manager",
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
        <View style={{flexDirection: "row", justifyContent: "space-between", marginTop: 75}}>
        <Button 
          title="                Create                " 
          onPress={() => {createManager()}}
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