import React, { useEffect } from 'react';
import { Text, StyleSheet, View, Button, ToastAndroid, AsyncStorage } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import ModalDropdown from 'react-native-modal-dropdown';
import { ip } from '../configs/config';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';

export default function UpdateTaskScreen(props) {
  const [id, setId]                     = React.useState(props.route.params.item.id);
  const [sourceFrom, setSourceFrom]     = React.useState(props.route.params.item.source_from);
  const [content, setContent]           = React.useState(props.route.params.item.task_content);
  const [assignedTo, setAssignedTo]     = React.useState(props.route.params.item.assigned_to);
  const [startDate, setStartDate]       = React.useState(props.route.params.item.start_time.split(" ")[0]);
  const [startTime, setStartTime]       = React.useState(props.route.params.item.start_time.split(" ")[1]);
  const [endDate, setEndDate]           = React.useState(props.route.params.item.end_time.split(" ")[0]);
  const [endTime, setEndTime]           = React.useState(props.route.params.item.end_time.split(" ")[1]);
  const [comment, setComment]           = React.useState(props.route.params.item.manager_comment);
  const [status, setStatus]             = React.useState(props.route.params.item.status);
  const [evaluation, setEvaluation]     = React.useState(props.route.params.item.manager_evaluation);
  const [confirmation, setConfirmation] = React.useState(props.route.params.item.finish_confirmation);
  const [file, setFile]                 = React.useState({fileName: "", base64: ""});
  const [createdBy, setCreatedBy]       = React.useState(props.route.params.item.created_by);
  const [createdTime, setCreatedTime]   = React.useState(props.route.params.item.created_time);
  const [updatedBy, setUpdatedBy]       = React.useState(props.route.params.item.last_updated_by);
  const [updatedTime, setUpdatedTime]   = React.useState(props.route.params.item.last_updated_time);

  const update = async({navigation}) => {
    try {
      const date = new Date();
      const year = date.getFullYear();
      const month = ("0" + (date.getMonth() + 1)).slice(-2);
      const day = ("0" + date.getDate()).slice(-2);
      const hour = ("0" + date.getHours()).slice(-2);
      const minute = ("0" + date.getMinutes()).slice(-2);
      const second = "00";
      const formatedDate = year + "-" + month + "-" + day + "-" + " " + hour + ":" + minute + ":" + second;

      const userId = await AsyncStorage.getItem("@USER_ID");
      const response = await fetch('http://' + ip + '/api/task/update.php', {
        method: 'POST',
        body: JSON.stringify({
          id: id,
          task_content: content,
          manager_comment: comment,
          manager_evaluation: evaluation,
          start_time: startDate + " " + startTime,
          end_time: endDate + " " + endTime,
          status: status,
          last_updated_by: userId,
          last_updated_time: formatedDate,
          assigned_to: assignedTo,
          finish_confirmation: confirmation,
          attached_file: file.base64,
        }),
      });
      const result = await response.json();
      if (result.message == "Task was updated.") {
        ToastAndroid.showWithGravityAndOffset(
          "Updated successfully!",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50,
        );
        navigation.popToTop();
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

  return(
    <View style={styles.container}>
      <Row title="ID " data={id}/>
      <Row title="Source from " data={sourceFrom}/>
      <EditRow title="Content " data={content} onChange={setContent}/>
      <EditRow title="Assigned to " data={assignedTo} onChange={setAssignedTo}/>
      <DateRow title="Start date " date={startDate} setDate={setStartDate}/>
      <TimeRow title="Start time " time={startTime} setTime={setStartTime}/>
      <DateRow title="End date " date={endDate} setDate={setEndDate}/>
      <TimeRow title="End time " time={endTime} setTime={setEndTime}/>
      <DropdownRow title="Status" data={['Pending', 'Working', 'Completed', 'Can\'t complete', 'Late']}
        default={status == null ? "Please select..." : status}
        onSelect={setStatus}
      />
      <EditRow title="Manager comment " data={comment} onChange={setComment}/>
      <DropdownRow title="Manager evaluation" data={['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10']}
        default={evaluation == null ? "Please select..." : evaluation}
        onSelect={setEvaluation}
      />
      <DropdownRow title="Finish confirmation" data={['Not yet completed', 'Completed']}
        default={confirmation}
        onSelect={setConfirmation}
      />
      <FileRow title="Attached file " data={file} setFile={setFile}/>
      <Row title="Created by " data={createdBy}/>
      <Row title="Created time " data={createdTime}/>
      <Row title="Last updated by " data={updatedBy}/>
      <Row title="Last updated time " data={updatedTime}/>
      <View style={{flexDirection: "row", justifyContent: "space-between"}}>
        <Button title="               Confirm               " onPress={async() => {await update(props)}}/>
        <Button title="               Cancel               " color="grey" onPress={() => {props.navigation.goBack()}}/>
      </View>
    </View>
  )
}

const Row = (props) => {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{props.title}</Text>
      <Text style={styles.data}>{props.data}</Text>
    </View>
  )
}

const EditRow = (props) => {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{props.title}</Text>
      <TextInput
        value={props.data}
        onChangeText={props.onChange}
        style={styles.textInput}
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
    <View style={styles.row}>
      <Text style={styles.title}>{props.title}</Text>
      <TouchableOpacity onPress={() => {showDatepicker()}} style={{width: 236, backgroundColor: "#ddd", borderWidth: 1, borderColor: "grey"}}>
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
    <View style={styles.row}>
      <Text style={styles.title}>{props.title}</Text>
      <TouchableOpacity onPress={() => {showTimepicker()}} style={{width: 236, backgroundColor: "#ddd", borderWidth: 1, borderColor: "grey"}}>
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
    <View style={styles.row}>
      <Text style={styles.title}>{props.title}</Text>
      <ModalDropdown 
        options={props.data} 
        defaultValue={props.default}
        style={{width: 236, backgroundColor: "#ddd", justifyContent: "center", borderWidth: 1}}
        textStyle={{fontSize: 20}}
        dropdownStyle={{width: 150}}
        dropdownTextStyle={{fontSize: 20, backgroundColor: "#ddd", borderWidth: 1, borderColor: "grey"}}
        onSelect={(event, value) => {
          if (value != false) {
            props.onSelect(value);
          }
        }}
      />
    </View>
  )
}

const FileRow = (props) => {
  getPermission = async() => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
    }
  }
  
  pickImage = async() => {
    let result = await ImagePicker.launchImageLibraryAsync({
      base64: true,
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1
    });

    if (!result.cancelled) {
      const tmp = result.uri.split("/");
      const fileName = tmp[tmp.length - 1];
      props.setFile({fileName: fileName, base64:`data:image/jpg;base64,${result.base64}`});
    }
  }

  return (
    <View style={styles.row}>
      <Text style={styles.title}>{props.title}</Text>
      <Text style={styles.data}>{props.data.fileName === "" || null ? "No file selected" : "..." + props.data.fileName.slice(props.data.fileName.length-11, props.data.fileName.length)}</Text>
      <Button title="Choose file" onPress={async() => {await getPermission(); await pickImage()}}/>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    padding: 8,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    width: 120,
    marginRight: 10,
    borderRightWidth: 1,
    borderColor: "#ddd",
    textAlignVertical: "center"
  },
  data: {
    fontSize: 18,
    flex: 1,
    flexWrap: "wrap",
    textAlignVertical: "center"
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  textInput: {
    fontSize: 20,
    flex: 1,
    flexWrap: "wrap",
    textAlignVertical: "center",
    backgroundColor: "#ddd",
    borderWidth: 1,
    borderColor: "grey",
    marginRight: 10,
  }
});