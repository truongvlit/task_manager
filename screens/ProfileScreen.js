import React, { useEffect, useRef } from 'react';
import { Text, StyleSheet, View, AsyncStorage, ImageBackground, Image } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { Avatar } from 'react-native-elements';
import { ip } from '../configs/config';

const Stack = createStackNavigator();

export default function ProfileScreen() {
  return (
    <Stack.Navigator 
    initialRouteName="Profile"
    screenOptions={{
      headerStyle: {
        backgroundColor: '#00c4fa',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      }
    }}>
      <Stack.Screen name="Profile" component={Profile}/>
      {/* <Stack.Screen name="EditProfile" component={EditProfile}/> */}
    </Stack.Navigator>
  )
}

const Profile = (props) => {
  const [info, setInfo] = React.useState({});
  const [uri, setUri] = React.useState("");

  const getUserInfo = async() => {
    try {
      const id = await AsyncStorage.getItem("@USER_ID");
      const response = await fetch('http://' + ip + '/api/user/read-one.php?id=' + id);
      const result = await response.json();
      return result;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    (async() => {
      try {
        const userInfo = await getUserInfo();
        const data = userInfo.id;
        const uri = encodeURI(data);
        setInfo(userInfo);
        await setUri(uri);
      } catch (error) {
        console.log(error);
      }
    })()
  }, []);

  return(
    <View style={styles.container}>
      <View style={styles.header}>
        <ImageBackground source={require('../assets/bg-1.jpg')} 
          style={
            {width: '100%', height: 225, justifyContent: 'center', alignItems: 'center'}
          }>
          <UserAvatar/>
        </ImageBackground>
      </View>
      <View style={styles.rowContainer}>
        <Row value={info.name} style={styles.name}/>
        <Row value={info.id} style={styles.username} id={true}/>
      </View>
      <View style={styles.qrcode}>
        <Image style={{width: 200, height: 200}} source={{uri: "http://api.qrserver.com/v1/create-qr-code/?data=" + uri + "&size=[200]x[200]"}} />
      </View>
    </View>
  )
}

function UserAvatar() {
  return(
    <Avatar
      rounded
      size={170}
      source={require('../assets/avt-1.jpg')}
      showEditButton
    />
  )
}

const Row = (props) => {
  return(
    <View style={styles.row}>
      <Text style={styles.info, props.style}>
        {props.id ? ("@" + props.value) : (props.value)}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 30,
  },
  rowContainer: {
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },  
  infoSide: {
    flexDirection: 'column',
    paddingLeft: 20,
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
  },
  info: {
    fontSize: 18,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 30,
    paddingTop: 10,
  },
  username: {
    fontSize: 20,
  },
  qrcode: {
    alignItems: "center",
    marginTop: 60
  }
});