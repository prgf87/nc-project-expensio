import { UserContext } from "./context/UserContext";
import "react-native-gesture-handler";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./pages/Login";
import { useContext, useEffect, useState } from "react";
import { authFire, dbFire } from "./firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Profile from "./pages/Profle";
import Settings from "./pages/Settings";
import ExpenseList from "./components/expenses/ExpenseList";
import Analysis from "./pages/Analysis";
import Receipts from "./components/receipts/Receipts";
import Map from "./components/map/Map";
import Footer from "./components/footer/Footer";
import ErrorHandler from "./components/error/ErrorHandler";
import { BudgetContext, BudgetProvider } from "./context/BudgetContext";
import AccountsList from "./components/account/AccountsList";
import AccountsAdder from "./components/account/AccountsAdder";
import AccountList from "./components/account/AccountsList";
import ExpenseAdder from "./components/expenses/ExpenseAdder";
import { BalanceContext } from "./context/BalanceContext";
import { ExpensesContext } from "./context/ExpensesContext";
import { collection, getDocs, query, where } from "@firebase/firestore";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

export default function App() {
  const [user, setUser] = useState({ name: "", email: "", uid: "" });
  const [budget, setBudget] = useState(0);
  const [balance, setBalance] = useState(0);
  const [expenseList, setExpenseList] = useState([]);
  const [accountList, setAccountList] = useState([]);

  const fetchExpensesData = async () => {
    const expensesQuery = query(
      collection(dbFire, "expenses"),
      where(user.uid === uid)
    );
    const querySnapshot = await getDocs(expensesQuery);
    const expensesData = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setExpenseList(expensesData);
  };

  const fetchAccountsData = async () => {
    const accountsQuery = query(collection(dbFire, "account"));
    const querySnapshot = await getDocs(accountsQuery);
    const accountsData = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setAccountList(accountsData);
    if (accountsData) {
      const calculateBudget = () => {
        const data = accountsData.reduce((total, item) => {
          console.log(item);
          return (total += +item.budget);
        }, +budget);
        return data.toFixed(2);
      };
      const calculateBalance = () => {
        const data = accountsData.reduce((total, item) => {
          console.log(item);
          return (total += +item.balance);
        }, +balance);
        return data.toFixed(2);
      };
      const budgetTotal = calculateBudget();
      const balanceTotal = calculateBalance();
      setBudget(budgetTotal);
      setBalance(balanceTotal);
    }
  };

  useEffect(() => {
    fetchExpensesData();
    fetchAccountsData();
  }, []);

  // console.log(accountList);
  console.log(budget);

  useEffect(() => {
    onAuthStateChanged(authFire, (user) => {
      setUser(user);
    });
  }, [user]);
  console.log(user);

  const LoginNavigator = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Error" component={ErrorHandler} />
      </Stack.Navigator>
    );
  };

  const AccountsNavigator = () => {
    return (
      <Stack.Navigator initialRouteName="AccountList">
        <Stack.Screen name="Account List" component={AccountList} />
        <Stack.Screen name="Accounts Adder" component={AccountsAdder} />
      </Stack.Navigator>
    );
  };

  const ExpensesNavigator = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Expense List Page" component={ExpenseList} />
        <Stack.Screen name="Expense Adder" component={ExpenseAdder} />
      </Stack.Navigator>
    );
  };

  const DrawerNavigator = () => {
    return (
      <Drawer.Navigator>
        <Drawer.Screen
          name={`Home`}
          component={Footer}
          // options={
          //   {
          //     // title: "My Home",
          //     //headerShown: false,
          //     // headerLeft: () => (
          //     //   <Image
          //     //     style={{ width: 50, height: 50 }}
          //     //     source={require("./assets/android-chrome-192x192.png")}
          //     //   />
          //     // ),
          //   }
          // }
        />
        <Drawer.Screen name="Profile" component={Profile} />
        <Drawer.Screen name="Settings" component={Settings} />
        <Drawer.Screen
          name="Expense List"
          component={ExpensesNavigator}
          options={{
            title: "Expenses List",
            // headerShown: false,
            // headerLeft: () => (
            //   <Image
            //     style={{ width: 50, height: 50 }}
            //     source={require("./assets/android-chrome-192x192.png")}
            //   />
            // ),
          }}
        />
        <Drawer.Screen name="Accounts List" component={AccountsNavigator} />
        <Drawer.Screen name="Analysis" component={Analysis} />
        <Drawer.Screen name="Receipts" component={Receipts} />
        <Drawer.Screen name="Map" component={Map} />
        {/* )} */}
      </Drawer.Navigator>
    );
  };

  return (
    <UserContext.Provider value={user}>
      <NavigationContainer>
        {!user ? (
          <LoginNavigator />
        ) : (
          <ExpensesContext.Provider value={expenseList}>
            <BudgetContext.Provider value={budget}>
              <BalanceContext.Provider value={balance}>
                <DrawerNavigator />
              </BalanceContext.Provider>
            </BudgetContext.Provider>
          </ExpensesContext.Provider>
        )}
      </NavigationContainer>
    </UserContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {},
});
