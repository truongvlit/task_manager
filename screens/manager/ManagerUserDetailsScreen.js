import React, { useEffect } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { ip } from '../../configs/config';

export default function ManagerUserDetailsScreen(props) {
  const [userInfo, setUserInfo] = React.useState({});

  useEffect(() => {
    const getUserInfo = (async() => {
      try {
        const id = props.route.params.userId;
        const response = await fetch('http://' + ip + '/api/user/read-one.php?id=' + id);
        const result = await response.json();
        setUserInfo(result);
      } catch (error) {
        console.log(error);
      }
    })();

    return () => {
      setUserInfo({});
    }
  }, []);

  return(
    <View style={styles.container}>
      <Row title="ID " data={userInfo.id}/>
      <Row title="Name " data={userInfo.name}/>
      <Row title="Phone " data={userInfo.phone_number}/>
      <Row title="Email " data={userInfo.email}/>
      <Row title="Role " data={userInfo.role}/>
    </View>
  )
}


const Row = (props) => {
  return(
    <View style={styles.item}>
      <Text style={styles.title}>{props.title}</Text>
      <Text style={styles.inputItem}>{props.data}</Text>
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