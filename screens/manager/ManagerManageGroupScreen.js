import React, { useEffect } from 'react';
import { Text, StyleSheet, SectionList, View, Button, AsyncStorage, RefreshControl } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity, TextInput, TouchableHighlight, ScrollView } from 'react-native-gesture-handler';
import { ip } from '../../configs/config';
import ManagerTaskListScreen from './ManagerTaskListScreen';
import ManagerTaskDetailsScreen from './ManagerTaskDetailsScreen';
import ManagerUpdateTaskScreen from './ManagerUpdateTaskScreen';
import ManagerUserDetailsScreen from './ManagerUserDetailsScreen';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import ManagerScanQRScreen from './ManagerScanQRScreen';

export const Stack = createStackNavigator();

const Item = (props) => {
  return (
    <View style={styles.item}>
      <TouchableOpacity onPress={props.onPress}>
        <Text style={styles.title}>Name: {props.title.name}</Text>
        <Text style={styles.title}>Role: {props.title.role}</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function ManagerManageGroupScreen() {
  return(
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#00c4fa',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <Stack.Screen
        name="ManageGroup" 
        component={ManageGroup}
        options={
          (props) => ({title: "Manage Group",
            headerRight: () => (
              <TouchableHighlight underlayColor="none" onPress={() => {props.navigation.navigate("ScanQR")}}>
                <MaterialCommunityIcons name="qrcode-scan" size={50} style={{marginRight: 20}} color="#fff"/>
              </TouchableHighlight>)
          })
        }
      />
      <Stack.Screen
        name="ScanQR" 
        component={ManagerScanQRScreen}
        options={({route}) => ({title: 'Scan QR '})}
      />
      <Stack.Screen
        name="UserDetails" 
        component={ManagerUserDetailsScreen}
        options={({route}) => ({title: 'Details of User ID: ' + route.params.userId})}
      />
      <Stack.Screen
        name="TaskList" 
        component={ManagerTaskListScreen}
        options={({route}) => ({title: 'Task list of: ' + route.params.item.id})}
      />
      <Stack.Screen
        name="TaskDetails" 
        component={ManagerTaskDetailsScreen}
        options={({route}) => ({title: 'Details of Task ID: ' + route.params.item.id})}
      />
      <Stack.Screen
        name="UpdateTask"
        component={ManagerUpdateTaskScreen}
        options={({route}) => ({title: 'Update Task ID: ' + route.params.item.id})}
      />
    </Stack.Navigator>
  )
}

function wait(timeout) {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}

function ManageGroup({navigation, route}) {
  const [searchText, changeSearchText] = React.useState('');
  const [list, changeList] = React.useState(new Array);
  const [showList, changeShowList] = React.useState(new Array);
  const [refreshing, setRefreshing] = React.useState(false);

  const getInfo = async() => {
    const id = await AsyncStorage.getItem("@USER_ID");
    const response = await fetch('http://' + ip + '/api/user/read-one.php?id=' + id);
    const result = await response.json();
    return result;
  }

  const filterList = (text) => {
    let tmp = [];
    for(let i = 0; i < list.length; i++) {
      tmp.push(new Object({data: [], title: list[i].title}));
      for(let j = 0; j < list[i].data.length; j++) {
        if (list[i].data[j].name.toLowerCase().includes(text))
          tmp[i].data.push(list[i].data[j]);
      }
    }
    return tmp.filter((object) => {return object.data.length > 0});
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(1000).then(() => setRefreshing(false));
  }, [refreshing]);

  useEffect(() => {
    async function fetchData() {
      const info = await getInfo();
      const response = await fetch('http://' + ip + '/api/user/read-all-by-group.php?group_id=' + info.group_id);
      const result = await response.json();
      let arr = new Array;
      arr.push(new Object({title: info.group_id, data: result}));
      changeList(arr);
      changeShowList(arr);
    }
    fetchData();
  },[refreshing])

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.formBoxInputElement}>
          <Text style={styles.label}>
            Search
          </Text>
          <TextInput
            value={searchText}
            placeholder="Enter user's name"
            onChangeText={changeSearchText}
            onChange={(event) => {changeShowList(filterList(event.nativeEvent.text))}}
            style={styles.formInputElement}
          />
      </View>
      <SectionList
        sections={showList}
        keyExtractor={(item, index) => item + index}
        renderItem={({ item }) => <Item title={item} navigation = {navigation}
                                        onPress={() => navigation.navigate("TaskList", {item})}/>}
        renderSectionHeader={({ section: { title } }) => (
          <View style={[styles.header, {flexDirection: "row", justifyContent: "space-between"}]}>
            <Text style={styles.headerTitle}>Group: {title}</Text>
          </View>
        )}
      />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    height: 50,
    backgroundColor: "#0a86a8",
  },
  headerTitle: {
    textAlignVertical: "center",
    fontSize: 20,
    paddingLeft: 15,
    fontWeight: "bold",
    color: "#fff"
  },
  item: {
    flexDirection: "column",
    paddingTop: 5,
    paddingBottom: 5,
    height: 60,
    paddingLeft: 30,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
  },
  title: {
    fontSize: 18,
  },
  label: {
    paddingTop: 8,
    paddingLeft: 15,
    paddingBottom: 8,
    paddingRight: 10,
    fontSize: 20,
    fontWeight: 'bold',
  },
  formBoxInputElement: {
    flexDirection: 'row',
    paddingBottom: 5,
    paddingTop: 5,
  },
  formInputElement: {
    fontSize: 16,
    borderWidth: 1,
    borderRadius: 15,
    paddingLeft: 10,
    borderColor: "black",
    width: "73%",
  },
});