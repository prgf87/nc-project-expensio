import { View, Text, Button, StyleSheet, SafeAreaView } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Loading } from "../components/loading/Loading";
import Logout from "../components/buttons/Logout";
import ExpenseListHome from "../components/expenses/ExpenseListHome";
import BudgetPlanner from "../components/budget/BudgetPlanner";
import { collection, getDocs, query, doc } from "@firebase/firestore";
import { dbFire } from "../firebaseConfig";
import { ExpensesContext } from "../context/ExpensesContext";
import { BudgetContext } from "../context/BudgetContext";
import { BalanceContext } from "../context/BalanceContext";

export default function Home({ navigation }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  // const [expenseList, setExpenseList] = useState([]);

  const [expenseList, setExpenseList] = useContext(ExpensesContext);
  const [budget, setBudget] = useContext(BudgetContext);
  const [balance, setBalance] = useContext(BalanceContext);

  useEffect(() => {
    setIsLoading(true);
    if (isLoading) {
      fetchExpensesData().then((data) => {
        if (data) {
          console.log(data);
          setExpenseList(data);
          setIsLoading(false);
        }
      });
    }
  }, [expenseList]);

  console.log(expenseList);

  async function fetchExpensesData() {
    const expensesQuery = query(collection(dbFire, "expenses"));
    const querySnapshot = await getDocs(expensesQuery);
    const expensesData = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    return expensesData;
  }

  if (isLoading) return <Loading />;
  if (isError) return <p>Something went wrong!</p>;

  return (
    <SafeAreaView style={styles.container}>
      <View>
        {/* <Layout> */}
        <View>
          {/* Viewing current accounts balance */}
          <Text style={styles.title}>Balance: {balance}</Text>
        </View>
        <View>
          {/* Viewing current budget, remaning budget and total spent */}
          <BudgetPlanner expenses={expenseList} />
        </View>
        <View>
          <ExpenseListHome expenses={expenseList} />
        </View>
        <View>
          <Button
            onPress={() =>
              navigation.navigate("Expense List", { screen: "ExpenseList" })
            }
            title="Expenses List"
            accessibilityLabel="Add a new expense to an account manually"
          />
          <Button
            onPress={() => {}}
            title="Scan expense"
            accessibilityLabel="Add a new expense to an account by scanning a receipt"
          />
        </View>
        {/* Button to navigate to the app demo */}
        {/* <View>
          <Button onPress={handleAppDemo} title="App Demo" accessibilityLabel="Learn more about how to use the expense tracker app, through our app demo"></Button>

        </View> */}
        <View>
          {/* Button to navigate to viewing/adding account(s) */}
          <Button
            onPress={() => navigation.navigate("Accounts List")}
            title="View / Add Account"
            accessibilityLabel="View a list of accounts or add a new account"
          ></Button>
          <Logout />
        </View>
        {/* </Layout> */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: "#737373",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
