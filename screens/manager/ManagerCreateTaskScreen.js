import React, { useEffect } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Text, StyleSheet, View, ToastAndroid, Button, KeyboardAvoidingView, AsyncStorage } from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import ModalDropdown from 'react-native-modal-dropdown';
import { ip } from '../../configs/config';

export default function ManagerCreateTaskScreen(props) {
  return(
    <KeyboardAvoidingView behavior="position" style={styles.container}>
      <View style={{justifyContent: "center", alignItems: "center", marginTop: 50}}>
        <Text style={{fontSize: 25}}>CREATE TASK</Text>
      </View>
      <CreateTask navigation={props.navigation}/>
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

const DateRow = (props) => {
  const [dateShow, setDateShow] = React.useState(false);

  const showDatepicker = () => {
    setDateShow(true);
  };

  useEffect(() => {
    return () => {
      setDateShow(false);
    }
  }, [dateShow])

  return (
    <View style={styles.item}>
      <Text style={styles.title}>{props.title}</Text>
      <TouchableOpacity onPress={() => {showDatepicker()}} style={{width: 236, flex: 1, justifyContent: "center"}}>
        <Text style={{fontSize: 20}}>{props.date}</Text>
      </TouchableOpacity>
      {dateShow && (
        <DateTimePicker
          testID="dateTimePicker"
          value={new Date()}
          mode={'date'}
          is24Hour={true}
          display="default"
          onChange={(event, value) => { 
            if (value !== undefined) {
              const day = ("0" + value.getDate()).slice(-2);
              const month = ("0" + (value.getMonth() + 1)).slice(-2);
              const year = value.getFullYear();
              const format = year + "-" + month + "-" + day;
              props.setDate(format);
            }
          }}
        />
      )}
    </View>
  )
}

const TimeRow = (props) => {
  const [timeShow, setTimeShow] = React.useState(false);

  const showTimepicker = () => {
    setTimeShow(true);
  };

  useEffect(() => {
    return () => {
      setTimeShow(false);
    }
  }, [timeShow])

  return (
    <View style={styles.item}>
      <Text style={styles.title}>{props.title}</Text>
      <TouchableOpacity onPress={() => {showTimepicker()}} style={{ flex: 1, width: 236, justifyContent: "center"}}>
        <Text style={{fontSize: 20}}>{props.time}</Text>
      </TouchableOpacity>
      {timeShow && (
        <DateTimePicker
          testID="dateTimePicker"
          value={new Date()}
          mode={'time'}
          is24Hour={true}
          display="default"
          onChange={(event, value) => { 
            if (value !== undefined) {
              const hour = ("0" + value.getHours()).slice(-2);
              const minute = ("0" + value.getMinutes()).slice(-2);
              const second = "00";
              const format = hour + ":" + minute + ":" + second;
              props.setTime(format);
            }
          }}
        />
      )}
    </View>
  )
}

const DropdownRow = (props) => {
  return (
    <View style={styles.item}>
      <Text style={styles.title}>{props.title}</Text>
      <ModalDropdown 
        options={props.data} 
        style={{width: 236, justifyContent: "center"}}
        textStyle={{fontSize: 20}}
        dropdownStyle={{width: 150}}
        dropdownTextStyle={{fontSize: 20}}
        onSelect={(event, value) => {
          if (value != false) {
            props.onSelect(value);
          }
        }}
      />
    </View>
  )
}

const CreateTask = (props) => {
  return(
    <View style={[styles.centerTitle, {marginTop: 55}]}>
      <CreateUserForm groupId={props.groupId} navigation={props.navigation}/>
    </View>
  )
}

const CreateUserForm = (props) => {
  const [sourceFrom, setSourceFrom]     = React.useState("");
  const [content, setContent]           = React.useState("");
  const [assignedTo, setAssignedTo]     = React.useState("");
  const [startDate, setStartDate]       = React.useState("----/--/--");
  const [startTime, setStartTime]       = React.useState("--:--:--");
  const [endDate, setEndDate]           = React.useState("----/--/--");
  const [endTime, setEndTime]           = React.useState("--:--:--");
  const [userList, setUserList]         = React.useState([]);
  const [taskList, setTaskList]         = React.useState([]);

  const getInfo = async() => {
    const id = await AsyncStorage.getItem("@USER_ID");
    const response = await fetch('http://' + ip + '/api/user/read-one.php?id=' + id);
    const result = await response.json();
    return result;
  }

  useEffect(() => {
    (async function fetchData() {
      try {
        const info = await getInfo();
        let response = await fetch('http://' + ip + '/api/user/read-all-by-group.php?group_id=' + info.group_id);
        let result = await response.json();
        let arr = new Array;
        result.map((item) => arr.push(item.id));
        setUserList(arr);

        response = await fetch('http://' + ip + '/api/task/read-failed-task.php?group_id=' + info.group_id);
        result = await response.json();
        arr = new Array;
        result.map((item) => arr.push(item.id));
        setTaskList(arr);
      } catch (error) {
        console.log(error);
      }
    })()
  },[])

  function validate() {
    let message = "";
    const date = new Date();
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    const hour = ("0" + date.getHours()).slice(-2);
    const minute = ("0" + date.getMinutes()).slice(-2);
    const second = "00";
    const formatedDate = year + "-" + month + "-" + day;
    const formatedHour = hour + ":" + minute + ":" + second;
    if (!content)                        message = "Content cannot be empty!"
    else if (startDate === "----/--/--") message = "Start date cannot be empty!"
    else if (startTime === "--:--:--")   message = "Start time cannot be empty!"
    else if (endDate === "----/--/--")   message = "End date cannot be empty!"
    else if (endTime === "--:--:--")     message = "End time cannot be empty!"
    else if (!assignedTo)                message = "Assigned to cannot be empty!"
    else if (startDate < formatedDate)   message = "Start date must be after yesterday!"
    else if (startDate == formatedDate && startTime < formatedHour) message = "Start time must be after current time";
    else if (endDate < startDate)        message = "End date must be after start date!"
    else if (endDate == startDate && endTime <= startTime) message = "End time must be after start time";
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

  const createTask = async() => {
    if (validate()) {
      let result = {};
      const date = new Date();
      const year = date.getFullYear();
      const month = ("0" + (date.getMonth() + 1)).slice(-2);
      const day = ("0" + date.getDate()).slice(-2);
      const hour = ("0" + date.getHours()).slice(-2);
      const minute = ("0" + date.getMinutes()).slice(-2);
      const second = "00";
      const formatedDate = year + "-" + month + "-" + day + "-" + " " + hour + ":" + minute + ":" + second;

      try {
        const userId = await AsyncStorage.getItem("@USER_ID");
        const response = await fetch('http://' + ip + '/api/task/create.php', {
          method: 'POST',
          body: JSON.stringify({
            source_from: sourceFrom,
            task_content: content,
            start_time: startDate + " " + startTime,
            end_time: endDate + " " + endTime,
            created_by: userId,
            created_time: formatedDate,
            last_updated_by: userId,
            last_updated_time: formatedDate,
            assigned_to: assignedTo,
          }),
        });
        result = await response.json();
        if (result.message == "Task was created.") {
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
        <DropdownRow title="Source from: " data={taskList}
          onSelect={setSourceFrom}
        />
        <Row title="Task content: " value={content} onChange={setContent}/>
        <DateRow title="Start date: " date={startDate} setDate={setStartDate}/>
        <TimeRow title="Start time: " time={startTime} setTime={setStartTime}/>
        <DateRow title="End date: " date={endDate} setDate={setEndDate}/>
        <TimeRow title="End time: " time={endTime} setTime={setEndTime}/>
        <DropdownRow title="Assigned to: " data={userList}
          onSelect={setAssignedTo}
        />
      </View>
        <View style={{flexDirection: "row", justifyContent: "space-between", marginTop: 65}}>
        <Button 
          title="                Create                " 
          onPress={() => {createTask()}}
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
    width: 255,
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