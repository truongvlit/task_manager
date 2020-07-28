import React, { useEffect } from 'react';
import { Text, StyleSheet, View, Button, ToastAndroid } from 'react-native';
import { ip } from '../configs/config';
import Dialog, { DialogContent, DialogTitle, DialogFooter, DialogButton, ScaleAnimation } from 'react-native-popup-dialog';

export default function UserDetailsScreen(props) {
  const [userInfo, setUserInfo] = React.useState({});
  const [dialogVisible, setDialogVisible] = React.useState(false);

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

  const deleteUser = (async() => {
    try {
      const id = props.route.params.userId;
      const response = await fetch('http://' + ip + '/api/user/delete.php', {
        method: 'POST',
        body: JSON.stringify({
          id: id
        }),
      });
      const result = await response.json();
      if (result.message = "User was deleted.") {
        ToastAndroid.showWithGravityAndOffset(
          "Deleted successfully!",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50,
        );
      } else {
        ToastAndroid.showWithGravityAndOffset(
          "Deleted failed!",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50,
        );
      }
      props.navigation.popToTop();
    } catch (error) {
      ToastAndroid.showWithGravityAndOffset(
        "Deleted failed!",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50,
      );
      console.log(error);
    }
  });

  return(
    <View style={styles.container}>
      <Row title="ID " data={userInfo.id}/>
      <Row title="Name " data={userInfo.name}/>
      <Row title="Phone " data={userInfo.phone_number}/>
      <Row title="Email " data={userInfo.email}/>
      <Row title="Role " data={userInfo.role}/>
      <View style={{flexDirection: "row", justifyContent: "space-between", marginTop: 325}}>
        <Button 
          title="               Update               "
          onPress={() => {props.navigation.navigate("UpdateUser", {title: props.route.params.userId})}}
        />
        <Button 
          title="               Delete               " 
          color="grey"
          onPress={() => {setDialogVisible(true)}}
        />
      </View>
      <Dialog 
        visible={dialogVisible}
        dialogAnimation={new ScaleAnimation()}
        dialogTitle={<DialogTitle title="Delete" style={styles.dialogTitle}/>}
        width={300}
        height={220}
        footer={
          <DialogFooter style={styles.footer}>
            <DialogButton
              text="Cancel"
              onPress={() => {
                if(dialogVisible) {
                  setDialogVisible(false);
                }
              }}
            />
            <DialogButton
              text="Delete"
              onPress={async() => {
                if(dialogVisible) {
                  setDialogVisible(false);
                  await deleteUser();
                }
              }}
            />
          </DialogFooter>
        }
        onTouchOutside={() => {
          if(dialogVisible) {
            setDialogVisible(false);
          }
        }}
      >
        <DialogContent style={styles.dialogContent}>
          <Text style={styles.text}>Are you sure you want to delete?</Text>
        </DialogContent>
      </Dialog>
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