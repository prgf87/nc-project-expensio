import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useEffect, useState } from "react";
import { authFire } from "./firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

const Stack = createNativeStackNavigator();
const HomeStack = createNativeStackNavigator();
const LoginStack = createNativeStackNavigator();

const login = false; //change this later to context

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(authFire, (user) => {
      setUser(user);
    });
  });

  return (
    <NavigationContainer>
      {/* if user is not logged in, show login screeen */}
      <Stack.Navigator initialRouteName="Login">
        {!user ? (
          <LoginStack.Group>
            <LoginStack.Screen
              name="Login"
              component={Login}
              options={{ headerShown: false }}
            />
            <LoginStack.Screen
              name="Register"
              component={Register}
              options={{ headerShown: false }}
            />
          </LoginStack.Group>
        ) : (
          <HomeStack.Group>
            {/* if user is logged in, show home screeen */}
            <HomeStack.Screen
              name="Home"
              component={Home}
              options={{ headerShown: false }}
            />
          </HomeStack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {},
});
