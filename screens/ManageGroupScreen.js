import React, { useEffect } from 'react';
import { Text, StyleSheet, SectionList, View, Button, RefreshControl } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity, TextInput, TouchableHighlight, ScrollView } from 'react-native-gesture-handler';
import { ip } from '../configs/config';
import TaskListScreen from './TaskListScreen';
import TaskDetailsScreen from './TaskDetailsScreen';
import UpdateTaskScreen from './UpdateTaskScreen';
import UserDetailsScreen from './UserDetailsScreen';
import CreateUserScreen from './CreateUserScreen';
import CreateGroupScreen from './CreateGroupScreen';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import UpdateUserScreen from './UpdateUserScreen';

export const Stack = createStackNavigator();

const Item = (props) => {
  return (
    <View style={[styles.item, {flexDirection: "row", justifyContent: "space-between"}]}>
      <TouchableOpacity onPress={props.onPress} style={{width: 250}}>
        <Text style={styles.title}>Name: {props.title.name}</Text>
        <Text style={styles.title}>Role: {props.title.role}</Text>
      </TouchableOpacity>
      <TouchableHighlight underlayColor="none" onPress={() => {props.navigation.navigate("UserDetails", {userId: props.title.id})}}>
        <MaterialCommunityIcons name="information-outline" size={50} style={{marginRight: 20}}/>
      </TouchableHighlight>
    </View>
  );
}

export default function ManageGroupScreen() {
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
          (props) => ({
            title: "Manage Group",
            headerRight: () => (
              <TouchableHighlight underlayColor="none" onPress={() => {props.navigation.navigate("CreateGroup")}}>
                <AntDesign name="addusergroup" size={50} style={{marginRight: 20}} color="#fff"/>
              </TouchableHighlight>)
          })
        }
      />
      <Stack.Screen
        name="UserDetails" 
        component={UserDetailsScreen}
        options={({route}) => ({title: 'Details of User ID: ' + route.params.userId})}
      />
      <Stack.Screen
        name="TaskList" 
        component={TaskListScreen}
        options={({route}) => ({title: 'Task list of: ' + route.params.item.id})}
      />
      <Stack.Screen
        name="TaskDetails" 
        component={TaskDetailsScreen}
        options={({route}) => ({title: 'Details of Task ID: ' + route.params.item.id})}
      />
      <Stack.Screen
        name="UpdateTask"
        component={UpdateTaskScreen}
        options={({route}) => ({title: 'Update Task ID: ' + route.params.item.id})}
      />
      <Stack.Screen
        name="CreateUser"
        component={CreateUserScreen}
        options={({route}) => ({title: 'Add User to Group ID: ' + route.params.title})}
      />
      <Stack.Screen
        name="CreateGroup"
        component={CreateGroupScreen}
        options={({route}) => ({title: 'Create Group'})}
      />
      <Stack.Screen
        name="UpdateUser"
        component={UpdateUserScreen}
        options={({route}) => ({title: 'Update User ID: ' + route.params.title})}
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

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('http://' + ip + '/api/user/read-all.php');
      const result = await response.json();
      let arr = new Array;
      Object.keys(result).map((key) => {
        arr.push(new Object({title: key, data: Object.values(result[key])}))
      })
      changeList(arr);
      changeShowList(arr);
    }
    fetchData();
  },[refreshing])

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(1000).then(() => setRefreshing(false));
  }, [refreshing]);


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
            <TouchableHighlight underlayColor="none" onPress={() => {navigation.navigate("CreateUser", {title: title})}}>
              <AntDesign name="adduser" size={50} style={{marginRight: 20}} color="#fff"/>
            </TouchableHighlight>
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