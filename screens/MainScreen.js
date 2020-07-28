import React from 'react';
import { createBottomTabNavigator  } from '@react-navigation/bottom-tabs';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Constants from 'expo-constants';
import { StyleSheet } from 'react-native';
import ManageGroupScreen from './ManageGroupScreen';
import ProfileScreen from './ProfileScreen';
import SettingsScreen from './SettingsScreen';
import ManageTaskScreen from './ManageTaskScreen';
import UserManageTaskScreen from './user/UserManageTaskScreen';
import UserProfileScreen from './user/UserProfileScreen';
import UserSettingsScreen from './user/UserSettingsScreen';
import ManagerManageGroupScreen from './manager/ManagerManageGroupScreen';
import ManagerManageTaskScreen from './manager/ManagerManageTaskScreen';
import ManagerProfileScreen from './manager/ManagerProfileScreen';
import ManagerSettingsScreen from './manager/ManagerSettingsScreen';

const Tab = createBottomTabNavigator();

export default function MainScreen({route}) {
  return(
    <Tab.Navigator
      screenOptions = {({route}) => ({
        tabBarIcon: ({ focused, color }) => {
          let iconName;
          if (route.name == 'Manage Group') {
            iconName = focused
              ? 'list-ul'
              : 'list-alt'
          } else if (route.name == 'Manage Task') {
            iconName = focused
              ? 'tasks'
              : 'tasks'
          } else if (route.name == 'Profile') {
            iconName = focused
              ? 'user-circle'
              : 'user-circle-o'
          } else if (route.name == 'Settings') {
            iconName = focused
              ? 'gears'
              : 'gear'
          }
          return <FontAwesome name={iconName} size={25} color={color}/>
        }
      })}
      tabBarOptions={{
        activeTintColor: '#00c4fa',
        inactiveTintColor: 'gray',
      }}
    >
      {route.params.role == "user" ?
        (
        <>
          <Tab.Screen name="Manage Task" 
            component={UserManageTaskScreen}
            initialParams={{ role: route.params.role }}
          />
          <Tab.Screen name="Profile" component={UserProfileScreen}/>
          <Tab.Screen 
            name="Settings" 
            component={UserSettingsScreen}
            initialParams={{ AuthContext: route.params.AuthContext }}
          />
        </>
        ) 
      : route.params.role == "admin" ?
        (
        <>
          <Tab.Screen 
            name="Manage Group" 
            component={ManageGroupScreen}
            initialParams={{ role: route.params.role }}
          />
          <Tab.Screen 
            name="Manage Task" 
            component={ManageTaskScreen}
            initialParams={{ role: route.params.role }}
          />
          <Tab.Screen 
            name="Profile" 
            component={ProfileScreen}
            initialParams={{ role: route.params.role }}
          />
          <Tab.Screen 
            name="Settings" 
            component={SettingsScreen}
            initialParams={{ AuthContext: route.params.AuthContext }}
          />
        </>
        )
      : (
        <>
          <Tab.Screen 
            name="Manage Group" 
            component={ManagerManageGroupScreen}
            initialParams={{ role: route.params.role }}
          />
          <Tab.Screen 
            name="Manage Task" 
            component={ManagerManageTaskScreen}
            initialParams={{ role: route.params.role }}
          />
          <Tab.Screen 
            name="Profile" 
            component={ManagerProfileScreen}
            initialParams={{ role: route.params.role }}
          />
          <Tab.Screen 
            name="Settings" 
            component={ManagerSettingsScreen}
            initialParams={{ AuthContext: route.params.AuthContext }}
          />
        </>
        )
      }
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Constants.statusBarHeight,
    padding: 8,
    backgroundColor: '#00c4fa',
  },
  logo: {
    width: 200,
    height: 80,
    margin: 'auto',
    top: 100,
    marginBottom: 40,
  },
  form: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    height: 500,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingRight: 10,
  },
  formBoxInputElement: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  formInputElement: {
    fontSize: 16,
    borderBottomWidth: 1,
    borderColor: "black",
    width: 150,
  },
  formButton: {
    marginTop: 50,
    width: 150,
  }
});