import React, { useEffect } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import { ip } from '../../configs/config';

export default function ManagerTaskListScreen(props) {
  return (
    <View style={styles.container}>
      <UserDetails data={props.route.params.item} navigation={props.navigation}/>
    </View>
  )
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

function UserDetails(props) {
  const [list, changeList] = React.useState(new Array);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('http://' + ip + '/api/task/read-by-user-id.php?id=' + props.data.id);
      const result = await response.json();
      let arr = new Array;
      arr = Object.values(result);
      changeList(arr);
    }
    fetchData();
  },[])

  return (
    <View>
      {list[0] != "This user has not been assigned any task" ? (
        <View>
          <SortForm  data={list} onChange={(list) => changeList([...list])}/>
          <FlatList
            data={list}
            keyExtractor={(item, index) => item + index}
            renderItem={({ item }) => <Item title={item} onPress={() => props.navigation.navigate("TaskDetails", {item})}/>}
          />
        </View>
      ) : (
        <Text style={[styles.message, styles.label]}>{list[0]}</Text>
      )}
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