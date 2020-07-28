import React, { useEffect } from 'react';
import { Text, TextInput, View, Button, Image, StyleSheet, AsyncStorage, ActivityIndicator, ToastAndroid } from 'react-native';
import Constants from 'expo-constants';
import 'react-native-gesture-handler';
import { ip } from '../configs/config';

export default function LoginScreen({navigation, route}) {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading]   = React.useState(false);

  const { signIn } = React.useContext(route.params.AuthContext);

  const getUserInfo = async() => {
    try {
      const response = await fetch('http://' + ip + '/api/user/read-one.php?id=' + username);
      return await response.json();
    } catch (error) {
      console.log(error);
    }
  }

  const storeUserToken = (async() => {
    try {
      await AsyncStorage.setItem("@USER_ID", username);
      const info = await getUserInfo();
      signIn({username: username, role: info.role});
    } catch (error) {
      console.log(error);
    }
  })

  const auth = async() => {
    try {
      const response = await fetch('http://' + ip + '/api/user/auth.php', {
        method: 'POST',
        body: JSON.stringify({
          id: username,
          password: password,
        }),
      });
      const result = await response.json();
      if (!result.message) {
        storeUserToken();
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

  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require('../assets/logo.png')} />
      <View style={styles.form}>
        {/* <View style={styles.container, {zIndex: 100}}>
          <ActivityIndicator animating={loading} size={70} color="#0000ff"/>
        </View> */}
        <View style={styles.formBoxInputElement}>
          <Text style={styles.label}>
            Username:
          </Text>
          <TextInput
            value={username}
            placeholder="Enter your username"
            onChangeText={setUsername}
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
            value={password}
            onChangeText={setPassword}
            style={styles.formInputElement}
          />
        </View>
        <View style={styles.formButton}>
          <Button
            title="Login"
            onPress={async() => {
              if(!loading) setLoading(true);
              await auth();
            }}
          />
        </View>
        <View style={[styles.formButton, {marginTop: 10}]}>
          <Button 
            title="Register" 
            onPress={() => navigation.navigate("Register")} 
          />
        </View>
      </View>
    </View>
  )
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
  },  
  form: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    height: 500,
  },
  label: {
    fontSize: 20,
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
