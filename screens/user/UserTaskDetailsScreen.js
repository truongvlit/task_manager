import React, { useEffect } from 'react';
import { Text, StyleSheet, View, Button, Image } from 'react-native';
import ImageView from 'react-native-image-view';

export default function UserTaskDetailsScreen(props) {
  return(
    <View style={styles.container}>
      <Row title="ID " data={props.route.params.item.id}/>
      <Row title="Source from " data={props.route.params.item.source_from}/>
      <Row title="Content " data={props.route.params.item.task_content}/>
      <Row title="Assigned to " data={props.route.params.item.assigned_to}/>
      <Row title="Start time " data={props.route.params.item.start_time}/>
      <Row title="End time " data={props.route.params.item.end_time}/>
      <Row title="Status " data={props.route.params.item.status}/>
      <Row title="Manager comment " data={props.route.params.item.manager_comment}/>
      <Row title="Manager evaluation " data={props.route.params.item.manager_evaluation}/>
      <Row title="Finish confirmation " data={props.route.params.item.finish_confirmation}/>
      <ShowImageRow title="Attached file " data={props.route.params.item.attached_file}/>
      <Row title="Created by " data={props.route.params.item.created_by}/>
      <Row title="Created time " data={props.route.params.item.created_time}/>
      <Row title="Last updated by " data={props.route.params.item.last_updated_by}/>
      <Row title="Last updated time " data={props.route.params.item.last_updated_time}/>
      <Button title="Update" onPress={() => props.navigation.navigate("UpdateTask", {item: props.route.params.item})}/>
    </View>
  )
}

const Row = (props) => {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{props.title} </Text>
      <Text style={styles.data}>{props.data}</Text>
    </View>
  )
}

const ShowImageRow = (props) => {
  const [imageShow, setImageShow] = React.useState(false);

  return (
    <View style={styles.row}>
      <Text style={styles.title}>{props.title}</Text>
      {
        props.data != null || "" ? 
          (<Button title="Click to show image" onPress={() => {setImageShow(true)}}/>) :
          (<Text style={styles.data}>No image to show</Text>)
      }
      {
        <ImageView
          images={[{
            source: {
                uri: props.data,
                width: "100%",
                height: "100%",
            }
          }]}
          imageIndex={0}
          isVisible={imageShow}
          isPinchZoomEnabled={false}
          onClose={() => {setImageShow(false)}}
        />
      }
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
    fontSize: 20,
    width: 120,
    marginRight: 10,
    borderRightWidth: 1,
    borderColor: "#ddd",
    textAlignVertical: "center"
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
});