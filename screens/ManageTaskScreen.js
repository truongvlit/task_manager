import React, { useEffect } from 'react';
import { Text, StyleSheet, View, RefreshControl } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import CreateTaskScreen from './CreateTaskScreen';
import TaskDetailsScreen from './TaskDetailsScreen';
import UpdateTaskScreen from './UpdateTaskScreen';
import Entypo from "react-native-vector-icons/Entypo";
import { FlatList, TouchableOpacity, TouchableHighlight, ScrollView } from 'react-native-gesture-handler';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import { ip } from '../configs/config'

export const Stack = createStackNavigator();

export default function ManageTaskScreen() {
  return (
    <Stack.Navigator 
    initialRouteName="Manage Task"
    screenOptions={{
      headerStyle: {
        backgroundColor: '#00c4fa',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      }
    }}>
      <Stack.Screen 
        name="Manage Task" 
        component={ManageTask}
        options={
          (props) => ({
            title: "Manage Task",
            headerRight: () => (
              <TouchableHighlight underlayColor="none" onPress={() => {props.navigation.navigate("CreateTask")}}>
                <Entypo name="add-to-list" size={50} style={{marginRight: 20}} color="#fff"/>
              </TouchableHighlight>)
          })
        }
      />
      <Stack.Screen 
        name="CreateTask" 
        component={CreateTaskScreen}
        options={
          (props) => ({
            title: "Create Task",
          })
        }
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
    </Stack.Navigator>
  )
}

function wait(timeout) {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}

function ManageTask(props) {
  const [list, changeList] = React.useState(new Array);
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('http://' + ip + '/api/task/read-all.php');
      const result = await response.json();
      let arr = new Array;
      arr = Object.values(result);
      changeList(arr);
    }
    fetchData();
  },[refreshing])

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(1000).then(() => setRefreshing(false));
  }, [refreshing]);

  return (
    <ScrollView 
      style={{paddingBottom: 60}}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
    }>
      <SortForm data={list} onChange={(list) => changeList([...list])}/>
      <FlatList
        data={list}
        keyExtractor={(item, index) => item + index}
        renderItem={({ item }) => <Item title={item} onPress={() => props.navigation.navigate("TaskDetails", {item})}/>}
      />
    </ScrollView>
  );
}

function SortForm(props) {
  const options = [{label: "Status", value: 0}, {label: "Time", value: 1}];
  const [choice, setChoice] = React.useState(0);
  let tmp = props.data;
  const compareStatus = (task1, task2) => task1.status > task2.status;
  const compareStartTime = (task1, task2) => task1.start_time > task2.start_time;
  
  useEffect(() => {
    choice == 0 ? props.onChange(tmp.sort(compareStatus)) : props.onChange(tmp.sort(compareStartTime));
  }, [choice])

  return (
    <View style={styles.rowCenter}>
      <Text style={styles.label}>
        Sort by
      </Text>
      <RadioForm
        formHorizontal={true}
        animation={true}
      >
        {
          options.map((object) => (
            <RadioButton labelHorizontal={true} key={object.value}>
              <RadioButtonInput
                obj={object}
                index={object.value}
                isSelected={choice === object.value}
                onPress={() => choice !== object.value && setChoice(object.value)}
                borderWidth={1}
                buttonInnerColor={'#000'}
                buttonOuterColor={"#000"}
                buttonSize={30}
                buttonOuterSize={40}
                buttonStyle={{}}
                buttonWrapStyle={{marginLeft: 10}}
              />
              <RadioButtonLabel
                obj={object}
                index={object.value}
                labelHorizontal={true}
                onPress={() => choice !== object.value && setChoice(object.value)}
                labelStyle={{fontSize: 16, color: '#000'}}
                labelWrapStyle={{}}
              />
            </RadioButton>
          ))
        }
      </RadioForm>
    </View>
  );
}

const Item = (props) => {
  return (
    <TouchableOpacity style={styles.item} onPress={props.onPress}>
      <View style={styles.row}>
        <Text style={styles.title}>ID: {props.title.id}</Text>
        <Text style={styles.title}>Start time: {props.title.start_time}</Text>
      </View>
      <View style={[styles.row, {flexShrink: 1}]}>
        <Text style={[styles.status, 
          props.title.status == "Pending" ?
          {color: "#ebeb19"} :
          props.title.status == "Working" ?
          {color: "green"} :
          props.title.status == "Completed" ?
          {color: "blue"} :
          {color: "red"}
        ]}>{props.title.status}</Text>
        <Text style={styles.title}>End time: {props.title.end_time}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  item: {
    flexDirection: "column",
    justifyContent: "center",
    height: 100,
    paddingLeft: 20,
    paddingRight: 20,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 2,
  },
  message: {
    justifyContent: "center",
    height: 60,
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rowCenter: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 8
  },
  title: {
    fontSize: 16,
  },
  status: {
    fontSize: 14,
    width: 100
  },
});