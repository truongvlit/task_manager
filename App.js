import React, { useEffect } from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MainScreen from './screens/MainScreen';
import RegisterScreen from './screens/RegisterScreen';
import LoginScreen from './screens/LoginScreen';

const Stack = createStackNavigator();

const AuthContext = React.createContext();

export default function App () {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'SIGN_IN':
          return {
            ...prevState,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            userToken: null,
          };
      }
    },
    {
      userToken: null,
    }
  );

  const authContext = React.useMemo(
    () => ({
      signIn: async data => {
        dispatch({ type: 'SIGN_IN', token: data });
      },
      signOut: () => dispatch({ type: 'SIGN_OUT' }),
    }),
    []
  );


  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        {state.userToken == null ? (
        <Stack.Navigator 
          initialRouteName="Login"
          screenOptions={{
            headerShown: false
          }}
          >
          <Stack.Screen 
            name="Login"
            component={LoginScreen}
            initialParams={{ AuthContext: AuthContext }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
          />
        </Stack.Navigator>
        ) : (
        <Stack.Navigator 
          initialRouteName="Main"
          screenOptions={{
            headerShown: false
          }}>
          <Stack.Screen
            name="Main"
            component={MainScreen}
            initialParams={{ AuthContext: AuthContext, role: state.userToken.role}}
          />
        </Stack.Navigator>
      )}
      </NavigationContainer>
    </AuthContext.Provider>
  );
}