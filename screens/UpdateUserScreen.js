import React, { useEffect } from 'react';
import { Text, StyleSheet, View, Button, ToastAndroid } from 'react-native';
import { ip } from '../configs/config';
import Dialog, { DialogContent, DialogTitle, DialogFooter, DialogButton, ScaleAnimation } from 'react-native-popup-dialog';
import { TextInput } from 'react-native-gesture-handler';

export default function UpdateUserScreen(props) {
  const [id, setId] = React.useState("");
  const [name, setName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [role, setRole] = React.useState("");
  const [groupId, setGroupId] = React.useState("");

  useEffect(() => {
    const getUserInfo = (async() => {
      try {
        const id = props.route.params.title;
        const response = await fetch('http://' + ip + '/api/user/read-one.php?id=' + id);
        const result = await response.json();
        setId(id);
        setName(result.name);
        setPhone(result.phone_number);
        setEmail(result.email);
        setRole(result.role);
        setGroupId(result.group_id);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  const validate = () => {
    let message = "";
    if (!name)     message = "Name cannot be empty!"
    if (!password)     message = "Password cannot be empty!"
    else if (!phone)    message = "Phone cannot be empty!"
    else if (!email)    message = "Email cannot be empty!"
    else if (!role)    message = "Role cannot be empty!"
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


  const update = async() => {
    console.log(password);
    if (validate()) {
      try {
        const response = await fetch('http://' + ip + '/api/user/update.php', {
          method: 'POST',
          body: JSON.stringify({
            id: id,
            password: password,
            name: name,
            phone_number: phone,
            email: email,
            role: role,
            group_id: groupId
          }),
        });
        const result = await response.json();
        if (result.message == "User was updated.") {
          ToastAndroid.showWithGravityAndOffset(
            "Updated successfully",
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50,
          );
          props.navigation.popToTop();
        } else {
          ToastAndroid.showWithGravityAndOffset(
            result.message,
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50,
          );
        }
      } catch (error) {
        // go to error screen
        console.log(error);
      }
    }
  }

  return(
    <View style={styles.container}>
      <Row title="ID " data={id}/>
      <EditRow title="Name " data={name} onChange={setName}/>
      <EditRow title="Password " data={password} onChange={setPassword} secureTextEntry="true"/>
      <EditRow title="Password confirm " data={confirm} onChange={setConfirm} secureTextEntry="true"/>
      <EditRow title="Phone " data={phone} onChange={setPhone}/>
      <EditRow title="Email " data={email} onChange={setEmail}/>
      <EditRow title="Role " data={role} onChange={setRole}/>
      <View style={{flexDirection: "row", justifyContent: "space-between", marginTop: 200}}>
        <Button 
          title="               Confirm               "
          onPress={() => {update()}}
        />
        <Button 
          title="               Cancel               " 
          color="grey"
          onPress={() => {props.navigation.goBack()}}
        />
      </View>
    </View>
  )
}

const Row = (props) => {
  return(
    <View style={styles.item}>
      <Text style={styles.title}>{props.title}</Text>
      <Text style={[styles.inputItem, {color: "#ccc"}]}>{props.data}</Text>
    </View>
  )
}

const EditRow = (props) => {
  return(
    <View style={styles.item}>
      <Text style={styles.title}>{props.title}</Text>
      <TextInput
        value={props.data}
        placeholder={props.placeholder}
        style={styles.inputItem}
        onChangeText={props.onChange}
        secureTextEntry={props.secureTextEntry ? true : false}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    width: 100,
    marginRight: 10,
    borderRightWidth: 1,
    borderColor: "#ddd",
    textAlignVertical: "center"
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
  data: {
    fontSize: 20,
    flex: 1,
    flexWrap: "wrap",
    textAlignVertical: "center"
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },  
  dialogTitle: {
    fontSize: 20,
  },
  dialogContent: {
    alignItems: 'center'
  },
  text: {
    padding: 8,
    fontSize: 18,
  },
  footer: {
    position: "absolute",
    bottom: 0,
  },
  inputItem: {
    textAlignVertical: "center",
    fontSize: 16,
    borderBottomWidth: 1,
    borderColor: "black",
    width: 250,
  },
});