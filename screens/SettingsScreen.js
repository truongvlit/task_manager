import React from 'react';
import { Text, StyleSheet, View, AsyncStorage } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Dialog, { DialogContent, DialogTitle, DialogFooter, DialogButton, ScaleAnimation } from 'react-native-popup-dialog';

const Stack = createStackNavigator();

export default function SettingsScreen({route}) {
  return (
    <Stack.Navigator 
    initialRouteName="Settings"
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
        name="Settings" 
        component={Settings}
        initialParams={{AuthContext: route.params.AuthContext}}
      />
    </Stack.Navigator>
  )
}

function Settings({route}) {

  const [dialogVisible, setDialogVisible] = React.useState(false);
  const { signOut } = React.useContext(route.params.AuthContext);

  return(
    <View style={styles.container}>
      <TouchableOpacity style={styles.box}>
        <Text style={styles.label}>Help &amp; Support</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.box}>
        <Text style={styles.label}>Privacy</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.box} onPress={() => {
        if(!dialogVisible) {
          setDialogVisible(true)
        }
      }}>
        <Text style={styles.label}>Logout</Text>
      </TouchableOpacity>
      <Dialog 
        visible={dialogVisible}
        dialogAnimation={new ScaleAnimation()}
        dialogTitle={<DialogTitle title="Logout" style={styles.dialogTitle}/>}
        width={300}
        height={220}
        footer={
          <DialogFooter style={styles.footer}>
            <DialogButton
              text="Cancel"
              onPress={() => {
                if(dialogVisible) {
                  setDialogVisible(false)
                }
              }}
            />
            <DialogButton
              text="OK"
              onPress={async() => {
                if(dialogVisible) {
                  setDialogVisible(false)
                  await signOut()
                }
              }}
            />
          </DialogFooter>
        }
        onTouchOutside={() => {
          if(dialogVisible) {
            setDialogVisible(false)
          }
        }}
      >
        <DialogContent style={styles.dialogContent}>
          <Text style={styles.text}>Are you sure you want to logout?</Text>
        </DialogContent>
      </Dialog>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 8,
    backgroundColor: '#fff',
  },
  label: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
    paddingLeft: 15,
  },
  box: {
    justifyContent: "center",
    height: 60,
    backgroundColor: "#0a86a8",
    borderBottomWidth: 1,
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
  }
});