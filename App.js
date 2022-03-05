import React, { useState, useEffect, createContext, useContext } from 'react'
import {
  StyleSheet,
  Text,
  View,
  Button,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Dimensions,
  Image
} from 'react-native'
import {
  Ionicons,
  Entypo,
  FontAwesome,
  Feather,
  FontAwesome5,
  MaterialCommunityIcons
} from '@expo/vector-icons'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import * as SQLite from 'expo-sqlite'
import { 
  Dialog,
  RadioButton
} from 'react-native-paper'
import SelectDropdown from 'react-native-select-dropdown'
import MapView from 'react-native-maps'
// импорт TouchableOpacity, TextInput из 'react-native-gesture-handler' приводит к ошибкам нужно импортировать из react-native
// import { TouchableOpacity, TextInput } from 'react-native-gesture-handler'

const Stack = createStackNavigator()

var db = null

export default function App() {

  const testActivity = 'MainActivity'

  useEffect(() => {
    db = SQLite.openDatabase('communalerdatabase.db')
    db.transaction(transaction => {
      let sqlStatement = 'CREATE TABLE IF NOT EXISTS users (_id INTEGER PRIMARY KEY, login TEXT, password TEXT, address TEXT, phone TEXT, name TEXT, email INTEGER, gender TEXT, firstname TEXT, secondname TEXT, thirdname TEXT, born TEXT);'
      transaction.executeSql(sqlStatement, [], (tx, receivedIndicators) => {
        let sqlStatement = 'CREATE TABLE IF NOT EXISTS amounts (_id INTEGER PRIMARY KEY, provider TEXT, number TEXT, status TEXT, email INTEGER, datetime TEXT, cost INTEGER, user INTEGER);'
        transaction.executeSql(sqlStatement, [], (tx, receivedIndicators) => {
          
        })
      })
    })
  }, [])

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="MainActivity"
          component={MainActivity}
          options={{  }}
        />
        <Stack.Screen
          name="PersonalAreaActivity"
          component={PersonalAreaActivity}
          options={{  }}
        />
        <Stack.Screen
          name="ProfileActivity"
          component={ProfileActivity}
          options={{
            title: 'Профиль'
          }}
        />
        <Stack.Screen
          name="RegisterActivity"
          component={RegisterActivity}
          options={{
            title: 'Регистрация'
          }}
        />
        <Stack.Screen
          name="AddAmountActivity"
          component={AddAmountActivity}
          options={{
            title: 'Добавить лицевой счет'
          }}
        />
        <Stack.Screen
          name="ContactsActivity"
          component={ContactsActivity}
          options={{
            title: 'Контакты',
            headerRight: () => <FontAwesome name="phone" size={24} color="black" />
          }}
        />
        <Stack.Screen
          name="PaymentsAndTransferActivity"
          component={PaymentsAndTransferActivity}
          options={{
            title: 'Платежи и переводы'
          }}
        />
        <Stack.Screen
          name="PaymentActivity"
          component={PaymentActivity}
          options={{
            headerTitle: () => (
              <View
                style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
              >
                <FontAwesome name="circle" size={24} color="black" />
                <Text style={{ marginLeft: 15 }}>
                  {
                    '00000000'
                  }
                </Text>
              </View>
            )
          }}
        />
        <Stack.Screen
          name="TransferActivity"
          component={TransferActivity}
          options={{
            headerTitle: () => (
              <View
                style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
              >
                <FontAwesome name="circle" size={24} color="black" />
                <Text style={{ marginLeft: 15 }}>
                  {
                    '00000000'
                  }
                </Text>
              </View>
            ),
            headerRight: () => <Entypo name="flashlight" size={24} color="black" />
          }}
        />
        <Stack.Screen
          name="ProfileDataActivity"
          component={ProfileDataActivity}
          options={{
            title: 'Личные данные',
            headerRight: () => (
              <TouchableOpacity
                onPress={() => {

                }}
              >
                <Text>
                  Сохранить
                </Text>
              </TouchableOpacity>
            )
          }}
        />
        <Stack.Screen
          name="ProfileContactsActivity"
          component={ProfileContactsActivity}
          options={{
            title: 'Контакты'
          }}
        />
        <Stack.Screen
          name="ProfilePasswordActivity"
          component={ProfilePasswordActivity}
          options={{
            title: 'Изменить пароль'
          }}
        />
        <Stack.Screen
          name="ProfileSubsActivity"
          component={ProfileSubsActivity}
          options={{
            title: 'Подписки'
          }}
        />
        <Stack.Screen
          name="ProfileSecurityActivity"
          component={ProfileSecurityActivity}
          options={{
            title: 'Безопасность'
          }}
        />
        <Stack.Screen
          name="ProfileAccountsActivity"
          component={ProfileAccountsActivity}
          options={{
            title: 'Связанные аккаунты'
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export function MainActivity({ navigation }) {
  
  const [login, setLogin] = useState('')
  
  const [password, setPassword] = useState('')

  const [users, setUsers] = useState([
    
  ])

  const [isDialogVisible, setIsDialogVisible] = useState(false)

  const [dialogMessage, setDialogMessage] = useState('')

  const goToActivity = (navigation, activityName, params = {}) => {
    navigation.navigate(activityName, params)
  }

  const loginUser = () => {
    db.transaction(async transaction => {
      const sqlStatement = "SELECT * FROM users;"
      await transaction.executeSql(sqlStatement, [], (tx, receivedUsers) => {
        let tempReceivedUsers = []
        Array.from(receivedUsers.rows).forEach((userItemRow, userRowIdx) => {
          const user = Object.values(receivedUsers.rows.item(userRowIdx))
          tempReceivedUsers = [
            ...tempReceivedUsers,
            {
              id: user[0],
              login: user[1],
              password: user[2]
            }
          ]
        })
        setUsers(tempReceivedUsers)
      })
      let userId = 0
      const isUserFound = users.some((user) => {
        const userLogin = user.login
        const userPassword = user.password
        const isLoginDetect = userLogin === login
        const isPasswordDetect = userPassword === password
        const isUserDetect = isLoginDetect && isPasswordDetect
        if (isUserDetect) {
          userId = user.id
        }
        return isUserDetect
      })
      if (isUserFound) {
        goToActivity(navigation, 'PersonalAreaActivity', {
          userId: userId
        })
        // goToActivity(navigation, 'MainPageActivity', {
        //   userId: userId
        // })
      } else {
        setDialogMessage('Пользователь не найден')
        setIsDialogVisible(true)
      }
    })
  }

  return (
    <View style={styles.mainActivityContainer}>
      <Text
        style={styles.mainActivityContainerWelcomeLabel}
      >
        Добро пожаловать
      </Text>
      <TextInput
        value={login}
        onChangeText={(value) => setLogin(value)}
        style={styles.mainActivityContainerInputField}
      />
      <TextInput
        secureTextEntry={true}
        value={password}
        onChangeText={(value) => setPassword(value)}
        style={styles.mainActivityContainerInputField}
      />
      <Text style={styles.mainActivityContainerForgotPasswordLabel}>
        Забыли пароль?
      </Text>
      <Button
        title={'Войти'}
        onPress={() => loginUser()}
        style={styles.mainActivityContainerLoginBtn}
      />
      <Text
        style={styles.mainActivityContainerLoginOrLabel}
      >
        {
          '---------------------------------------\tили\t-----------------------------------------'
        }
      </Text>
      <Button
        title={'Войти через'}
        onPress={() => {
          
        }}
        style={styles.mainActivityContainerLoginDrivenBtn}
      />
      <View style={styles.mainActivityContainerRegisterRow}>
        <Text>
          У вас еще нет аккаунта
        </Text>
        <TouchableOpacity
          onPress={() => goToActivity(navigation, 'RegisterActivity')}
        >
          <Text>
            Зарегестрируйтесь
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={styles.mainActivityContainerHelpRow}
      >
        <TouchableOpacity
          onPress={() => goToActivity(navigation, 'ContactsActivity')}
          style={styles.mainActivityContainerHelpRowItem}
        >
          <Ionicons name="location" size={24} color="black" />
          <Text>
            Контакты
          </Text>          
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.mainActivityContainerHelpRowItem}
        >
          <Entypo name="help-with-circle" size={24} color="black" />
          <Text>
            Техподдержка
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.mainActivityContainerHelpOfficialSitesLabel}>
        Официальные сайты  
      </Text>
      <Dialog
        visible={isDialogVisible}
        onDismiss={() => setIsDialogVisible(false)}>
        <Dialog.Title>Сообщение</Dialog.Title>
        <Dialog.Content>
          <Text>
            {
              dialogMessage
            }
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button title="ОК" onPress={() => setIsDialogVisible(false)} />
        </Dialog.Actions>
      </Dialog>
    </View>
  )
}

const DEFAULT_CONTEXT = {
  userId: false
}

const PersonalAreaTabNavigatorContext = createContext(DEFAULT_CONTEXT)

const Tab = createBottomTabNavigator()


export function PersonalAreaActivity({ route }) {
  
  const { userId } = route.params

  console.log(`userId: ${userId}`)

  return (
    <PersonalAreaTabNavigatorContext.Provider value={{ userId }}>
      <Tab.Navigator
        screenOptions={{
          tabBarShowIcon: true
        }}
      >
        <Tab.Screen
          name="Главная"
          component={MainPageActivity}
        />
        <Tab.Screen
          name="Услуги"
          component={ServicesPageActivity}
          options={{
            headerRight: () => <MaterialCommunityIcons name="ticket-percent" size={48} color="black" />
          }}
        />
        <Tab.Screen
          name="Вопросы"
          component={QuestionsPageActivity}
        />
        <Tab.Screen
          name="Чат"
          component={ChatPageActivity}
        />
        <Tab.Screen
          name="Еще"
          component={MorePageActivity}
        />
      </Tab.Navigator>
    </PersonalAreaTabNavigatorContext.Provider>
  )
}

export function MainPageActivity({ navigation, route }) {
  
  const [amounts, setAmounts] = useState([
    {
      
    }
  ])

  const [currentAmount, setCurrentAmount] = useState({
    id: 0,
    number: '00000000',
    cost: 0
  })

  const { userId } = useContext(PersonalAreaTabNavigatorContext)
    
  useEffect(() => {
    db.transaction(async transaction => {
      const sqlStatement = `SELECT * FROM amounts WHERE user = ${userId};`
      await transaction.executeSql(sqlStatement, [], (tx, receivedAmounts) => {
        let tempReceivedAmounts = []
        Array.from(receivedAmounts.rows).forEach((amountRow, amountRowIdx) => {
          const amount = Object.values(receivedAmounts.rows.item(amountRowIdx))
          tempReceivedAmounts = [
            ...tempReceivedAmounts,
            {
              id: amount[0],
              number: amount[2],
              cost: amount[6]
            }
          ]
        })
        setAmounts(tempReceivedAmounts)
      })
    })
  }, [userId])

  useEffect(() => {
    if (amounts.length >= 1) {
      // setCurrentAmount(amounts[0])
      setCurrentAmount({
        id: amounts[0].id,
        cost: amounts[0].cost,
        number: amounts[0].number
      })
    }
  }, [amounts])

  const goToActivity = (navigation, activityName, params = {}) => {
    navigation.navigate(activityName, params)
  }

  const getCurrentAmountStyle = (amount) => {
    if (currentAmount.id === amount.id) {
      return {
        backgroundColor: 'rgb(235, 235, 235)'
      }
    }
    return {
      backgroundColor: 'rgb(200, 200, 200)'
    }
  }
  
  return (
    <View style={styles.mainPageActivityContainer}>
      <ScrollView
        style={styles.mainPageActivityContainerTabs}
        horizontal={true}
      >
        <TouchableOpacity
          style={styles.mainPageActivityContainerTab}
          onPress={() => goToActivity(navigation, 'AddAmountActivity', {
            userId: userId
          })}
        >
          <Feather name="plus" size={24} color="black" />
        </TouchableOpacity>
        {
          amounts.map((amount, amountIndex) => {
            return (
              <TouchableOpacity
                key={amountIndex}
                style={
                  [
                    styles.mainPageActivityContainerTab,
                    getCurrentAmountStyle(amount)
                  ]
                }
                onPress={() => setCurrentAmount(amount)}
              >
                <Text>
                  {
                    amount.number
                  }
                </Text>
              </TouchableOpacity>
            )
          })
        }
      </ScrollView>
      {
        currentAmount.id !== 0 ?
          <View style={styles.mainPageActivityContainerAmount}>
            <View style={styles.mainPageActivityContainerAmountHeader}>
              <Text style={styles.mainPageActivityContainerAmountHeaderAddress}>
                Адресс проживания
              </Text>
              <Ionicons name="information-circle" size={24} color="black" />
            </View>
            <Text style={styles.mainPageActivityContainerAmountCostLabel}>
              {
                currentAmount.cost >= 0 ?
                  'Переплата'
                :
                  'Сумма к оплате'
              }
            </Text>
            <Text
              style={styles.mainPageActivityContainerAmountCostValue}
              color={
                currentAmount.cost < 0 ?
                  'rgb(255, 0, 0)'
                :
                  'rgb(0, 150, 0)'
              }
            >
              {
                currentAmount.cost
              }
            </Text>
            <View style={styles.mainPageActivityContainerAmountMoreBtnWrapContainer}>
              <View style={styles.mainPageActivityContainerAmountMoreBtnWrap}>
                <Button
                  style={styles.mainPageActivityContainerAmountMoreBtn}
                  onPress={() => {

                  }}
                  title="Еще"
                />
              </View>
            </View>
            <View style={styles.mainPageActivityContainerAmountNotificationsBtnWrapContainer}>
              <View style={styles.mainPageActivityContainerAmountNotificationsBtnWrap}>
                <Button
                  style={styles.mainPageActivityContainerAmountNotificationsBtn}
                  onPress={() => {

                  }}
                  title="Важные уведомления"
                />
              </View>
            </View>
            <View style={styles.mainPageActivityContainerAmountActions}>
              <TouchableOpacity
                style={styles.mainPageActivityContainerAmountActionsItem}
                onPress={() => goToActivity(navigation, 'PaymentActivity', {
                  userId: userId,
                  amountId: currentAmount.id,
                  amountNumber: currentAmount.number,
                  amountCost: currentAmount.cost
                })}
              >
                <FontAwesome5 name="credit-card" size={48} color="black" />
                <Text style={styles.mainPageActivityContainerAmountActionsItemLabel}>
                  {
                    'Оплатить\nбез'
                  }
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.mainPageActivityContainerAmountActionsItem}
                onPress={() => goToActivity(navigation, 'TransferActivity', {
                  userId: userId,
                  amountId: currentAmount.id,
                  amountNumber: currentAmount.number,
                  amountCost: currentAmount.cost
                })}
              >
                <Entypo name="calculator" size={48} color="black" />
                <Text style={styles.mainPageActivityContainerAmountActionsItemLabel}>
                  {
                    'Передать\nпоказания'
                  }
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        :
          <Text>
            Вы не прикрепили еще ни одного счета
          </Text>
      }
    </View>
  )
}

export function ServicesPageActivity() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowIcon: true
      }}
    >
      <Tab.Screen
        name="Каталог"
        component={ServicesCatalogActivity}
      />
      <Tab.Screen
        name="Заказанные"
        component={OrderedServicesActivity}
      />
    </Tab.Navigator>
  )
}

export function QuestionsPageActivity() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowIcon: true
      }}
    >
      <Tab.Screen
        name="Задать вопрос"
        component={AskQuestionActivity}
      />
      <Tab.Screen
        name="История"
        component={QuestionsHistoryActivity}
      />
    </Tab.Navigator>
  )
}

export function ChatPageActivity() {
  
  const [message, setMessage] = useState('')
  
  const [messages, setMessages] = useState([

  ])

  const addMessage = () => {
    const updatedMessages = messages
    updatedMessages.push(message)
    setMessages(updatedMessages)
    setMessage('')
  }

  return (
    <View style={styles.chatPageActivityContainer}>
      <View
        style={styles.chatPageActivityContainerScrollWrap}
      >
        <ScrollView
          style={styles.chatPageActivityContainerScroll}
        >
          <View style={styles.chatPageActivityContainerMessage}>
            <Text style={styles.chatPageActivityContainerMessageLabel}>
              {
                'Здраствуйте! Введите свое обращение,\nпожалуйста.'
              }
            </Text>
          </View>
          {
            messages.map((message, messageIndex) => {
              return (
                <View
                  key={messageIndex}
                  style={styles.chatPageActivityContainerMessage}
                >
                  <Text style={styles.chatPageActivityContainerMessageLabel}>
                    {
                      message
                    }
                  </Text>
                </View>
              )
            })
          }
        </ScrollView>
      </View>
      <View style={styles.chatPageActivityContainerFooter}>
        <TextInput
          style={styles.chatPageActivityContainerFooterInput}
          value={message}
          onChangeText={(value) => setMessage(value)}
        />
        <Ionicons
          name="md-send-sharp"
          size={24}
          color="black"
          onPress={() => addMessage()}
        />
      </View>
    </View>
  )
}

export function MorePageActivity({ navigation }) {
  
  const { userId } = useContext(PersonalAreaTabNavigatorContext)

  const goToActivity = (navigation, activityName, params = {}) => {
    navigation.navigate(activityName, params)
  }
  
  return (
    <View style={styles.morePageActivityContainer}>
      <View style={styles.morePageActivityContainerItem}>
        <TouchableOpacity
          style={styles.morePageActivityContainerItemAside}
          onPress={() => goToActivity(navigation, 'ProfileActivity', {
            userId: userId
          })}
        >
          <FontAwesome name="user-circle-o" size={24} color="black" />
          <Text style={styles.morePageActivityContainerItemLabel}>
            Профиль
          </Text>
        </TouchableOpacity>
        <Entypo name="chevron-right" size={24} color="black" />
      </View>
      <TouchableOpacity
        onPress={() => goToActivity(navigation, 'ContactsActivity')}
        style={styles.morePageActivityContainerItem}
      >
        <View style={styles.morePageActivityContainerItemAside}>
          <Ionicons name="location" size={24} color="black" />
          <Text style={styles.morePageActivityContainerItemLabel}>
            Контакты
          </Text>
        </View>
        <Entypo name="chevron-right" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => goToActivity(navigation, 'PaymentsAndTransferActivity')}
        style={styles.morePageActivityContainerItem}
      >
        <View style={styles.morePageActivityContainerItemAside}>
          <Ionicons name="information-circle" size={24} color="black" />
          <Text style={styles.morePageActivityContainerItemLabel}>
            Платежи и переводы
          </Text>
        </View>
        <Entypo name="chevron-right" size={24} color="black" />
      </TouchableOpacity>
    </View>
  )
}

export function ProfileActivity({ navigation, route }) {

  const { userId } = route.params

  const [users, setUsers] = useState([

  ])
  
  const [user, setUser] = useState({
    id: 0,
    login: '',
    password: '',
    firstName: '',
    secondName: '',
    thirdName: ''
  })

  const goToActivity = (navigation, activityName, params = {}) => {
    navigation.navigate(activityName, params)
  }

  useEffect(() => {
    db.transaction(async transaction => {
      const sqlStatement = `SELECT * FROM users WHERE _id = ${userId};`
      await transaction.executeSql(sqlStatement, [], (tx, receivedUsers) => {
        let tempReceivedUsers = []
        Array.from(receivedUsers.rows).forEach((userItemRow, userRowIdx) => {
          const user = Object.values(receivedUsers.rows.item(userRowIdx))
          tempReceivedUsers = [
            ...tempReceivedUsers,
            {
              id: user[0],
              login: user[1],
              password: user[2],
              firstName: user[8],
              secondName: user[9],
              thirdName: user[10]
            }
          ]
        })
        setUsers(tempReceivedUsers)
      })
    })
  }, [userId])

  useEffect(() => {
    const countUsers = users.length
    const isUserFound = countUsers >= 1
    if (isUserFound) {
      const detectedUser = users[0]
      setUser(detectedUser)
    }
  }, [users])

  return (
    <View style={styles.profileActivityContainer}>
      <View style={styles.profileActivityContainerAvatarContainer}>
        <View style={styles.profileActivityContainerAvatar}>
          <Text style={styles.profileActivityContainerAvatarLabel}>
            {
              `${user.firstName.length ? user.firstName[0].toUpperCase() : ''}${user.secondName.length ? user.secondName[0].toUpperCase() : ''}`
            }
          </Text>
        </View>
      </View>
      <Text style={styles.profileActivityContainerFullName}>

      </Text>
      <View style={styles.profileActivityContainerItems}>
        <TouchableOpacity
          onPress={() => goToActivity(navigation, 'ProfileDataActivity', {
            userId: userId
          })}
          style={styles.profileActivityContainerItem}
        >
          <Text style={styles.profileActivityContainerItemLabel}>
            Личные данные
          </Text>
          <Entypo name="chevron-right" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.profileActivityContainerItem}
          onPress={() => goToActivity(navigation, 'ProfileContactsActivity', {
            userId: userId
          })}
        >
          <Text style={styles.profileActivityContainerItemLabel}>
            Контакты
          </Text>
          <Entypo name="chevron-right" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.profileActivityContainerItem}
          onPress={() => goToActivity(navigation, 'ProfilePasswordActivity', {
            userId: userId
          })}
        >
          <Text style={styles.profileActivityContainerItemLabel}>
            Изменить пароль
          </Text>
          <Entypo name="chevron-right" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.profileActivityContainerItem}
          onPress={() => goToActivity(navigation, 'ProfileSubsActivity', {
            userId: userId
          })}
        >
          <Text style={styles.profileActivityContainerItemLabel}>
            Подписки
          </Text>
          <Entypo name="chevron-right" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.profileActivityContainerItem}
          onPress={() => goToActivity(navigation, 'ProfileSecurityActivity', {
            userId: userId
          })}
        >
          <Text style={styles.profileActivityContainerItemLabel}>
            Безопасность
          </Text>
          <Entypo name="chevron-right" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.profileActivityContainerItem}
          onPress={() => goToActivity(navigation, 'ProfileAccountsActivity', {
            userId: userId
          })}
        >
          <Text style={styles.profileActivityContainerItemLabel}>
            Связанные аккаунты
          </Text>
          <Entypo name="chevron-right" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={() => goToActivity(navigation, 'PersonalAreaActivity', {
          userId: userId
        })}
      >
        <Text style={styles.profileActivityContainerLogoutLabel}>
          ВЫЙТИ ИЗ АККАУНТА
        </Text>
      </TouchableOpacity>
    </View>
  )
}

export function RegisterActivity({ navigation }) {
  
  const [login, setLogin] = useState('')

  const [phone, setPhone] = useState('')

  const [password, setPassword] = useState('')

  const [confirmPassword, setConfirmPassword] = useState('')

  const [name, setName] = useState('')

  const [isEmail, setIsEmail] = useState(false)

  const [isDialogVisible, setIsDialogVisible] = useState(false)

  const [dialogMessage, setDialogMessage] = useState('')

  const goToActivity = (navigation, activityName, params = {}) => {
    navigation.navigate(activityName, params)
  }
  
  const addUser = () => {
    const isPasswordsMatches = password === confirmPassword
    const loginFieldLength = login.length
    const isLoginFieldFilled = loginFieldLength >= 1
    const phoneFieldLength = phone.length
    const isPhoneFieldFilled = phoneFieldLength >= 1
    const passwordFieldLength = password.length
    const isPasswordFieldFilled = passwordFieldLength >= 1
    const confirmPasswordFieldLength = confirmPassword.length
    const isConfirmPasswordFieldFilled = confirmPasswordFieldLength >= 1
    const nameFieldLength = name.length
    const isNameFieldFilled = nameFieldLength >= 1
    const isFieldsFilled = isLoginFieldFilled && isPhoneFieldFilled && isPasswordFieldFilled && isConfirmPasswordFieldFilled && isNameFieldFilled
    const isCanRegister = isPasswordsMatches && isFieldsFilled
    if (isCanRegister) {
      const rawIsEmail = isEmail ? 1 : 0
      let sqlStatement = `INSERT INTO \"users\"(login, password, address, phone, name, email, gender, firstname, secondname, thirdname, born) VALUES (\"${login}\", \"${password}\", \"\", \"${phone}\", \"${name}", ${rawIsEmail}, \"\", \"\", \"\", \"\", \"\");`
      db.transaction(transaction => {
        transaction.executeSql(sqlStatement, [], (tx, receivedIndicators) => {
          
          goToActivity(navigation, 'PersonalAreaActivity')    
        })
      })
    } else {
      let msg = ''
      const isFieldsNotFilled = !isFieldsFilled
      if (isFieldsNotFilled) {
        const isLoginFieldNotFilled = !isLoginFieldFilled
        if (isLoginFieldNotFilled) {
          msg += 'Поле \"E-mail\" не заполнено\n'
        }
        const isPhoneFieldNotFilled = !isPhoneFieldFilled
        if (isPhoneFieldNotFilled) {
          msg += 'Поле \"Мобильный телефон\" не заполнено\n'
        }
        const isPasswordFieldNotFilled = !isPasswordFieldFilled
        if (isPasswordFieldNotFilled) {
          msg += 'Поле \"Придумайте пароль\" не заполнено\n'
        }
        const isConfirmPasswordFieldNotFilled = !isConfirmPasswordFieldFilled
        if (isConfirmPasswordFieldNotFilled) {
          msg += 'Поле \"Повторите пароль\" не заполнено\n'
        }
        const isNameFieldNotFilled = !isNameFieldFilled
        if (isNameFieldNotFilled) {
          msg += 'Поле \"Имя пользователя\" не заполнено\n'
        }
        const isPasswordsNotMatches = !isPasswordsMatches
        if (isPasswordsNotMatches) {
          msg += 'Поля \"Придумайте пароль\" и \"Повторите пароль\" не совпадают\n'
        }
        setIsDialogVisible(true)
        setDialogMessage(msg)
      }
    }
  }
  
  return (
    <View style={styles.registerActivityContainer}>
      <TextInput
        placeholder={'E-mail'}
        value={login}
        onChangeText={(value) => setLogin(value)}
        style={styles.registerActivityContainerInputField}
      />
      <TextInput
        placeholder={'Мобильный телефон'}
        value={phone}
        onChangeText={(value) => setPhone(value)}
        style={styles.registerActivityContainerInputField}
      />
      <TextInput
        secureTextEntry={true}
        placeholder={'Придумайте пароль'}
        value={password}
        onChangeText={(value) => setPassword(value)}
        style={styles.registerActivityContainerInputField}
      />
      <TextInput
        secureTextEntry={true}
        placeholder={'Повторите пароль'}
        value={confirmPassword}
        onChangeText={(value) => setConfirmPassword(value)}
        style={styles.registerActivityContainerInputField}
      />
      <TextInput
        placeholder={'Имя пользователя'}
        value={name}
        onChangeText={(value) => setName(value)}
        style={styles.registerActivityContainerInputField}
      />
      <View
        style={styles.registerActivityContainerSubscription}
      >
        <View
          style={styles.registerActivityContainerSubscriptionAside}
        >
          <Text
           style={styles.registerActivityContainerSubscriptionAsideLabel}
          >
            {
              'Даю согласие на получение рвссылок\nрекламно-информационного характера'
            }
          </Text>
          <Text
            style={styles.registerActivityContainerSubscriptionAsideWarning}
          >
            {
              'Без согласия на рекламу Вы упускаете\nнаши выгодные предложения'
            }
          </Text>
        </View>
        <Switch
          value={isEmail}
          onValueChange={(value) => setIsEmail(value)}
        />
      </View>
      <Text style={styles.registerActivityContainerAgreement}>
        {
          'Нажимая кнопку \"Далее\" Вы принимаете\nПользовательское соглашение и даете\nна обработку персональных данных'
        }
      </Text>
      <TouchableOpacity
        onPress={() => addUser()}
      >
        <Text style={styles.registerActivityContainerRegisterLabel}>
          Далее
        </Text>
      </TouchableOpacity>
      <Dialog
        visible={isDialogVisible}
        onDismiss={() => setIsDialogVisible(false)}>
        <Dialog.Title>Сообщение</Dialog.Title>
        <Dialog.Content>
          <Text>
            {
              dialogMessage
            }
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button title="ОК" onPress={() => setIsDialogVisible(false)} />
        </Dialog.Actions>
      </Dialog>
    </View>
  )
}

export function AddAmountActivity({ navigation, route }) {
  
  const [provider, setProvider] = useState('')

  const [number, setNumber] = useState('')

  const [status, setStatus] = useState('')

  const [isEmail, setIsEmail] = useState(false)

  const [isDialogVisible, setIsDialogVisible] = useState(false)

  const [dialogMessage, setDialogMessage] = useState('')

  const providers = [
    'АО Мосэенргосбыт',
    'АО МосОблЕИРЦ',
    'АО Мосэнергосбыт + ТКО'
  ]

  const statuses = [
    'Собственник',
    'Другое',
    'Наниматель',
    'Зарегестрированный',
    'Проживает'
  ]

  const { userId } = route.params

  const goToActivity = (navigation, activityName, params = {}) => {
    navigation.navigate(activityName, params)
  }
  
  const addAmount = () => {
    const generatedCost = getRandomArbitrary(0, 5000)
    const cost = Number.parseInt(generatedCost)
    const currentDateTime = new Date()
    const currentDateTimeHours = currentDateTime.getHours()
    const currentDateTimeMinutes = currentDateTime.getMinutes()
    const currentDateTimeDay = currentDateTime.getDate()
    const currentDateTimeMonth = currentDateTime.getMonth()
    const currentDateTimeYear = currentDateTime.getFullYear()
    let rawCurrentDateTimeDay = ''
    const isAddDayPrefix = currentDateTimeDay < 10
    if (isAddDayPrefix) {
      rawCurrentDateTimeDay = `0${currentDateTimeDay}`
    }
    let rawCurrentDateTimeMonth = `${currentDateTimeMonth + 1}`
    const isAddMonthPrefix = rawCurrentDateTimeMonth < 10
    if (isAddMonthPrefix) {
      rawCurrentDateTimeMonth = `0${rawCurrentDateTimeMonth}`
    }
    let rawCurrentDateTimeHours = `${currentDateTimeHours}`
    const rawCurrentDateTimeHoursLength = rawCurrentDateTimeHours.length
    const isAddHoursPrefix = rawCurrentDateTimeHoursLength === 1
    if (isAddHoursPrefix) {
      rawCurrentDateTimeHours = `0${rawCurrentDateTimeHours}`
    }
    let rawCurrentDateTimeMinutes = `${currentDateTimeMinutes}`
    const rawCurrentDateTimeMinutesLength = rawCurrentDateTimeMinutes.length
    const isAddMinutesPrefix = rawCurrentDateTimeMinutesLength === 1
    if (isAddMinutesPrefix) {
      rawCurrentDateTimeMinutes = `0${rawCurrentDateTimeMinutes}`
    }
    const dateTime = `${rawCurrentDateTimeDay}.${rawCurrentDateTimeMonth}.${currentDateTimeYear}T${rawCurrentDateTimeHours}:${rawCurrentDateTimeMinutes}`
    const numberFieldLength = number.length
    const isNumberFieldFilled = numberFieldLength >= 1
    const isFieldsFilled = isNumberFieldFilled
    if (isFieldsFilled) {
      const rawIsEmail = isEmail ? 1 : 0
      let sqlStatement = `INSERT INTO \"amounts\"(provider, number, status, email, datetime, cost, user) VALUES (\"${provider}\", \"${number}\", \"${status}\", \"${rawIsEmail}\", \"${dateTime}", ${cost}, ${userId});`
      db.transaction(transaction => {
        transaction.executeSql(sqlStatement, [], (tx, receivedIndicators) => {
          goToActivity(navigation, 'PersonalAreaActivity')    
        })
      })
    } else {
      let msg = ''
      const isNumberFieldNotFilled = !isNumberFieldFilled
      if (isNumberFieldNotFilled) {
        msg += 'Поле \"Номер лицевого счсета\" не заполнено\n'
      }
      setIsDialogVisible(true)
      setDialogMessage(msg)
    }
  }

  function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min
  }

  return (
    <View
      style={styles.addAmountActivityContainer}
    >
      <SelectDropdown
        defaultButtonText={'Поставщик услуг'}
        data={providers}
        onSelect={(selectedItem, index) => {
          setProvider(selectedItem)
        }}
        buttonTextAfterSelection={(selectedItem, index) => {
          return selectedItem
        }}
        rowTextForSelection={(item, index) => {
          return item
        }}
        style={styles.addAmountActivityContainerDropDown}
        renderDropdownIcon={() => <Entypo name="chevron-down" size={24} color="black" />}
      />
      <TextInput
        placeholder={'Номер лицевого счета'}
        value={number}
        onChangeText={(value) => setNumber(value)}
        style={styles.addAmountActivityContainerInputField}
      />
      <SelectDropdown
        defaultButtonText={'Статус отношения к ЛС'}
        data={statuses}
        onSelect={(selectedItem, index) => {
          setStatus(selectedItem)
        }}
        buttonTextAfterSelection={(selectedItem, index) => {
          return selectedItem
        }}
        rowTextForSelection={(item, index) => {
          return item
        }}
        style={styles.addAmountActivityContainerDropDown}
        renderDropdownIcon={() => <Entypo name="chevron-down" size={24} color="black" />}
      />
      <View
        style={styles.addAmountActivityContainerEmail}
      >
        <Text>
          Получать счета по email
        </Text>
        <Switch
          value={isEmail}
          onValueChange={(value) => setIsEmail(value)}
        />
      </View>
      <Button
        color="rgb(225, 225, 0)"
        title="Добавить лицевой счет"
        onPress={() => addAmount()}
      />
      <Dialog
        visible={isDialogVisible}
        onDismiss={() => setIsDialogVisible(false)}>
        <Dialog.Title>Сообщение</Dialog.Title>
        <Dialog.Content>
          <Text>
            {
              dialogMessage
            }
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button title="ОК" onPress={() => setIsDialogVisible(false)} />
        </Dialog.Actions>
      </Dialog>
    </View>
  )
}

export function ContactsActivity() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowIcon: true
      }}
    >
      <Tab.Screen
        name="Список"
        component={ContactsListActivity}
      />
      <Tab.Screen
        name="Карта"
        component={ContactsMapActivity}
      />
    </Tab.Navigator>
  )
}

export function ContactsListActivity() {
  
  const [provider, setProvider] = useState('Поставщик услуг')

  const providers = [
    'Поставщик услуг',
    'АО Мосэенргосбыт',
    'ООО МосОблЕИРЦ'
  ]
  
  return (
    <View style={styles.contactsActivityContainer}>
      <SelectDropdown
        defaultButtonText={'Поставщик услуг'}
        data={providers}
        onSelect={(selectedItem, index) => {
          setProvider(selectedItem)
        }}
        buttonTextAfterSelection={(selectedItem, index) => {
          return selectedItem
        }}
        rowTextForSelection={(item, index) => {
          return item
        }}
        style={styles.contactsActivityContainerDropDown}
        renderDropdownIcon={() => <Entypo name="chevron-down" size={24} color="black" />}
      />
      {
        (provider === 'Поставщик услуг' || provider === 'АО Мосэенргосбыт') ?
          <View style={styles.contactsActivityContainerItem}>
            <Text>
              {
                'Управление ЕИРЦ \"Пушкино\"(Пушкинский район)\nСеверо-Восточный отдел ЕИРЦ'
              }
            </Text>
            <Text>
              {
                '141200, Московская область, г. Пушкино, ул.\nОстровсого, д. 22'
              }
            </Text>
            <View style={styles.contactsActivityContainerItemFooter}>
              <Ionicons name="time-outline" size={24} color="black" />
              <Text style={styles.contactsActivityContainerItemFooterLabel}>
                {
                  'Пн-пт: с 8-00 до 20-00'
                }
              </Text>
            </View>
          </View>
        :
          <View>

          </View>
      }
      {
        (provider === 'Поставщик услуг' || provider === 'ООО МосОблЕИРЦ') ?
        <View style={styles.contactsActivityContainerItem}>
          <Text>
            {
              'Управление ЕИРЦ \"Пушкино\"(Пушкинский район)\nСеверо-Восточный отдел ЕИРЦ'
            }
          </Text>
          <Text>
            {
              '141200, Московская область, г. Пушкино, ул.\nОстровсого, д. 22'
            }
          </Text>
          <View style={styles.contactsActivityContainerItemFooter}>
            <Ionicons name="time-outline" size={24} color="black" />
            <Text style={styles.contactsActivityContainerItemFooterLabel}>
              {
                'Пн-пт: с 8-00 до 20-00'
              }
            </Text>
          </View>
        </View>
        :
        <View>

        </View>
      }
    </View>
  )
}

export function ContactsMapActivity() {
  return (
    <View style={styles.contactsMapActivityMapContainer}>
      <MapView style={styles.contactsMapActivityMap} />
    </View>
  )
}

export function PaymentsAndTransferActivity() {
  return (
    <View style={styles.paymentsAndTransfersActivityContainer}>
      <Text style={styles.paymentsAndTransfersActivityContainerHeader}>
        Оплата услуг
      </Text>
      <View style={styles.paymentsAndTransfersActivityContainerColumns}>
        <View style={styles.paymentsAndTransfersActivityContainerColumn}>
          <View style={styles.paymentsAndTransfersActivityContainerItem}>
            <Ionicons name="phone-portrait-outline" size={48} color="black" />
            <Text style={styles.paymentsAndTransfersActivityContainerItemLabel}>
              {
                'Мобильная связь'
              }
            </Text>
          </View>
          <View style={styles.paymentsAndTransfersActivityContainerItem}>
            <Ionicons name="home-sharp" size={48} color="black" />
            <Text style={styles.paymentsAndTransfersActivityContainerItemLabel}>
              {
                'Коммунальные\nплатежи'
              }
            </Text>
          </View>
        </View>
        <View style={styles.paymentsAndTransfersActivityContainerColumn}>
          <View style={styles.paymentsAndTransfersActivityContainerItem}>
            <FontAwesome5 name="wifi" size={48} color="black" />
            <Text style={styles.paymentsAndTransfersActivityContainerItemLabel}>
              {
                'Интернет, ТВ и\nТелефония'
              }
            </Text>
          </View>
          <View style={styles.paymentsAndTransfersActivityContainerItem}>
            <Ionicons name="phone-portrait-outline" size={48} color="black" />
            <Text style={styles.paymentsAndTransfersActivityContainerItemLabel}>
              {
                'Мобильная связь'
              }
            </Text>
          </View>
        </View>
      </View>
    </View>
  )
}

export function AskQuestionActivity() {
  
  const providers = [
    'Поставщик услуг',
    'ООО МосОблЕИРЦ',
    'АО Мосэенргосбыт'
  ]

  const [provider, setProvider] = useState('Поставщик услуг')

    
  const numbers = [
    
  ]

  const [number, setNumber] = useState('')

    
  const topics = [
    
  ]

  const [topic, setTopic] = useState('')
  
  return (
    <View>
      <SelectDropdown
        defaultButtonText={'Поставщик услуг'}
        data={providers}
        onSelect={(selectedItem, index) => {
          setProvider(selectedItem)
        }}
        buttonTextAfterSelection={(selectedItem, index) => {
          return selectedItem
        }}
        rowTextForSelection={(item, index) => {
          return item
        }}
        style={styles.contactsActivityContainerDropDown}
        renderDropdownIcon={() => <Entypo name="chevron-down" size={24} color="black" />}
      />
      <SelectDropdown
        defaultButtonText={'Лицевой счет'}
        data={numbers}
        onSelect={(selectedItem, index) => {
          setNumber(selectedItem)
        }}
        buttonTextAfterSelection={(selectedItem, index) => {
          return selectedItem
        }}
        rowTextForSelection={(item, index) => {
          return item
        }}
        style={styles.contactsActivityContainerDropDown}
        renderDropdownIcon={() => <Entypo name="chevron-down" size={24} color="black" />}
      />
      <SelectDropdown
        defaultButtonText={'Тема вопроса'}
        data={topics}
        onSelect={(selectedItem, index) => {
          setTopic(selectedItem)
        }}
        buttonTextAfterSelection={(selectedItem, index) => {
          return selectedItem
        }}
        rowTextForSelection={(item, index) => {
          return item
        }}
        style={styles.contactsActivityContainerDropDown}
        renderDropdownIcon={() => <Entypo name="chevron-down" size={24} color="black" />}
      />
      <Button
        onPress={() => {

        }}
        title={'Продолжить'}
      />
    </View>
  )
}

export function QuestionsHistoryActivity() {
  
  const [amounts, setAmounts] = useState([

  ])
  
  return (
    <View
      style={styles.questionsHistoryActivityContainer}
    >
      <Text
        style={styles.questionsHistoryActivityContainerSelectQuestionLabel}
      >
        Выберите вопрос
      </Text>
      {
        amounts.map((amount, amountIndex) => {
          return (
            <View
              key={amountIndex}
              style={styles.questionsHistoryActivityContainerQuestion}
            >
              <Text
                style={styles.questionsHistoryActivityContainerQuestionLabel}
              >
                Номер счета
              </Text>
              <Entypo name="chevron-right" size={24} color="black" />
            </View>
          )
        })
      }
    </View>
  )
}

export function ServicesCatalogActivity() {
  
  const [address, setAddress] = useState('\n')

  const addresses = [
    '\n'
  ]

  const [serviceType, setServiceType] = useState('Все')

  const servicesTypes = [
    'Все',
    'Умные приборы учета',
    'Электромонтажные работы',
    'Дезинфекция, дезинсекция и чистка\nпомещений',
    'Ремонт бытовой техники',
    'Ремонт сматфонов',
    'Сантехника',
    'Установка/замена водосчетчиков \"ОХТА\",\n\"Пульс\", \"ВСКМ\", \"НОРМА\", \"ЭХО НОМ\"',
    'Установка/замена водосчетчиков Itelma'
  ]
  
  return (
    <View>
      <Text>
        Отобразить услуги
      </Text>
      <Text>
        Номер лицевого счета
      </Text>
      <SelectDropdown
        defaultButtonText={'\n'}
        data={address}
        onSelect={(selectedItem, index) => {
          setAddress(selectedItem)
        }}
        buttonTextAfterSelection={(selectedItem, index) => {
          return selectedItem
        }}
        rowTextForSelection={(item, index) => {
          return item
        }}
        style={styles.contactsActivityContainerDropDown}
        renderDropdownIcon={() => <Entypo name="chevron-down" size={24} color="black" />}
      />
      <Text>
        Вид услуги
      </Text>
      <SelectDropdown
        defaultButtonText={'Все'}
        data={servicesTypes}
        onSelect={(selectedItem, index) => {
          setServiceType(selectedItem)
        }}
        buttonTextAfterSelection={(selectedItem, index) => {
          return selectedItem
        }}
        rowTextForSelection={(item, index) => {
          return item
        }}
        style={styles.contactsActivityContainerDropDown}
        renderDropdownIcon={() => <Entypo name="chevron-down" size={24} color="black" />}
      />
    </View>
  )
}

export function OrderedServicesActivity() {
  
  const [address, setAddress] = useState('\n')

  const addresses = [
    '\n'
  ]

  const [period, setPeriod] = useState('за последние 3 месяца')

  const periods = [
    'за последние 3 месяца',
    'за последние 6 месяцев',
    'за год',
    'за три года'
  ]
  
  return (
    <View>
      <Text>
        Отобразить услуги
      </Text>
      <Text>
        Номер лицевого счета
      </Text>
      <SelectDropdown
        defaultButtonText={'\n'}
        data={address}
        onSelect={(selectedItem, index) => {
          setAddress(selectedItem)
        }}
        buttonTextAfterSelection={(selectedItem, index) => {
          return selectedItem
        }}
        rowTextForSelection={(item, index) => {
          return item
        }}
        style={styles.contactsActivityContainerDropDown}
        renderDropdownIcon={() => <Entypo name="chevron-down" size={24} color="black" />}
      />
      <Text>
        Период
      </Text>
      <SelectDropdown
        defaultButtonText={'за последние 3 месяца'}
        data={periods}
        onSelect={(selectedItem, index) => {
          setPeriod(selectedItem)
        }}
        buttonTextAfterSelection={(selectedItem, index) => {
          return selectedItem
        }}
        rowTextForSelection={(item, index) => {
          return item
        }}
        style={styles.contactsActivityContainerDropDown}
        renderDropdownIcon={() => <Entypo name="chevron-down" size={24} color="black" />}
      />
      <Text>
        {
          'За последние 3 месяца заказанные услуги отсутствуют'
        }
      </Text>
    </View>
  )
}

export function PaymentActivity({ navigation, route }) {

  const visaImg = require('./assets/visa.png')
  
  const masterCardImg = require('./assets/master_card.png')

  const smartCardImg = require('./assets/smart_card.png')

  const googlePayImg = require('./assets/google_pay.png')

  const { userId, amountId, amountNumber, amountCost } = route.params

  const [cost, setCost] = useState('')
  
  const [isInsurance, setIsInsurance] = useState(false)
  
  const [isAgree, setIsAgree] = useState(true)

  const [paymentMethod, setPaymentMethod] = useState('Банковская карта')

  const goToActivity = (navigation, activityName, params = {}) => {
    navigation.navigate(activityName, params)
  }

  const pay = () => {
    db.transaction(transaction => {
      let updatedCost = amountCost
      updatedCost += Number.parseInt(cost)
      let sqlStatement = `UPDATE amounts SET cost = ${updatedCost} WHERE _id = ${amountId};`
      transaction.executeSql(sqlStatement, [], (tx, receivedAmounts) => {
        goToActivity(navigation, 'PersonalAreaActivity', {
          userId: userId
        })  
      })
    })
  }

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View
          style={styles.paymentActivityHeader}
        >
          <FontAwesome name="circle" size={24} color="black" />
          <Text style={styles.paymentActivityHeaderLabel}>
            {
              amountNumber
            }
          </Text>
        </View>
      )
    })
  }, [userId])

  return (
    <View
      style={styles.paymentActivityContainer}
    >
      <Text style={styles.paymentActivityContainerAddressLabel}>
        Адресс проживания
      </Text>
      <Text style={styles.paymentActivityContainerCostLabel}>
        Итого к оплате
      </Text>
      <TextInput
        style={styles.paymentActivityContainerCostInput}
        value={cost}
        onChangeText={(value) => setCost(value)}
      />
      <Text
        style={styles.paymentActivityContainerMethodLabel}
      >
        Выберите способ оплаты
      </Text>
      <TouchableOpacity
        onPress={() => setPaymentMethod('Google Pay')}
        style={styles.paymentActivityContainerMethod}
      >
        <View
          style={styles.paymentActivityContainerMethodAside}
        >
          <Image
            style={styles.paymentActivityContainerMethodImg}
            source={googlePayImg}
          />
          <Text
            style={styles.paymentActivityContainerMethodName}
          >
            Google Pay
          </Text>
        </View>
        {
          paymentMethod === 'Google Pay' ?
            <Entypo name="check" size={24} color="black" />
          :
            <View>

            </View>
        }
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setPaymentMethod('Банковская карта')}
        style={styles.paymentActivityContainerMethod}
      >
        <View
          style={styles.paymentActivityContainerMethodAside}
        >
          <Image
            style={styles.paymentActivityContainerMethodImg}
            source={smartCardImg}
          />
          <Text
            style={styles.paymentActivityContainerMethodName}
          >
            Банковской картой
          </Text>
        </View>
        {
          paymentMethod === 'Банковская карта' ?
            <Entypo name="check" size={24} color="black" />
          :
            <View>

            </View>
        }
      </TouchableOpacity>
      <View
        style={styles.paymentActivityContainerAgreement}
      >
        <Text
          style={styles.paymentActivityContainerAgreementLabel}
        >
          Добровольное страхование: 95,00 руб.
        </Text>
        <Switch
          value={isInsurance}
          onValueChange={(value) => setIsInsurance(value)}
        />
      </View>
      <View
        style={styles.paymentActivityContainerAgreement}
      >
        <Text
          style={styles.paymentActivityContainerAgreementLabel}
        >
          Я согласен с правилами оплаты
        </Text>
        <Switch
          value={isAgree}
          onValueChange={(value) => setIsAgree(value)}
        />
      </View>
      <Text
        style={styles.paymentActivityContainerDetailsLabel}
      >
        Подробнее
      </Text>
      <Text
        style={styles.paymentActivityContainerSupportedCardsLabel}
      >
        К оплате принимаются
      </Text>
      <View
        style={styles.paymentActivityContainerSupportedCards}
      >
        <Image
          style={styles.paymentActivityContainerSupportedCard}
          source={visaImg}
        />
        <Image
          style={styles.paymentActivityContainerSupportedCard}
          source={masterCardImg}
        />
        <Image
          style={styles.paymentActivityContainerSupportedCard}
          source={smartCardImg}
        />
      </View>
      <View
        style={styles.paymentActivityContainerCashback}
      >
        <Text
          style={styles.paymentActivityContainerCashbackLabel}
        >
          Кешбэк 1% при оплате картой
        </Text>
        <View
          style={styles.paymentActivityContainerCashbackInfo}
        >
          <Text
            style={styles.paymentActivityContainerCashbackInfoLabel}
          >
            {
              'Зарегестрирйуйте карту один раз в Программе\nлояльности для держателй карт\nдо совершения\nоплаты и получайте кешбэк\nпосле каждого платежа.'
            }
          </Text>
          <Entypo name="chevron-right" size={24} color="black" />
        </View>
        <Text
          style={styles.paymentActivityContainerCashbackDetailsLabel}
        >
          Подробнее
        </Text>
      </View>
      <Button
        color={'rgb(200, 200, 0)'}
        title="Оплатить"
        onPress={() => pay()}
      />
    </View>
  )

}

export function TransferActivity({ navigation, route }) {

  const { userId, amountId, amountNumber, amountCost } = route.params

  const goToActivity = (navigation, activityName, params = {}) => {
    navigation.navigate(activityName, params)
  }

  const transfer = () => {
    goToActivity(navigation, 'PersonalAreaActivity', {
      userId: userId
    })
  }

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View
          style={styles.paymentActivityHeader}
        >
          <FontAwesome name="circle" size={24} color="black" />
          <Text style={styles.paymentActivityHeaderLabel}>
            {
              amountNumber
            }
          </Text>
        </View>
      )
    })
  }, [userId])

  return (
    <ScrollView>
      <Button
        color={'rgb(150, 150, 150)'}
        title={'Передать показания'}
        onPress={() => transfer()}
      />
    </ScrollView>
  )

}

export function ProfileDataActivity({ navigation, route }) {
  
  const { userId } = route.params

  const [firstName, setFirstName] = useState('')

  const [secondName, setSecondName] = useState('')

  const [thirdName, setThirdName] = useState('')

  const [gender, setGender] = useState('')

  const borns = [
    '\n'
  ]

  const [born, setBorn] = useState('')
  
  const [isDialogVisible, setIsDialogVisible] = useState(false)

  const [dialogMessage, setDialogMessage] = useState('')

  const [users, setUsers] = useState([

  ])

  const [user, setUser] = useState({
    id: 0,
    login: '',
    password: '',
    firstName: '',
    secondName: '',
    thirdName: '',
    gender: '',
    born: ''
  })

  const saveData = () => {
    const firstNameFieldLength = firstName.length
    const isFirstNameFieldFilled = firstNameFieldLength >= 1
    const secondNameFieldLength = secondName.length
    const isSecondNameFieldFilled = secondNameFieldLength >= 1
    const thirdNameFieldLength = thirdName.length
    const isThirdNameFieldFilled = thirdNameFieldLength >= 1
    const isFieldsFilled = isFirstNameFieldFilled && isSecondNameFieldFilled && isThirdNameFieldFilled
    const isCanUpdate = isFieldsFilled
    if (isCanUpdate) {
      const born = ''
      let sqlStatement = `UPDATE users SET firstname = ${firstName}, secondname = ${secondName}, firstname = ${thirdName}, gender = ${gender}, born = ${born} WHERE _id = ${userId};`
      db.transaction(transaction => {
        transaction.executeSql(sqlStatement, [], (tx, receivedUsers) => {  
          goToActivity(navigation, 'PersonalAreaActivity', {
            userId: userId
          })  
        })
      })
    } else {
      let msg = ''
      const isFieldsNotFilled = !isFieldsFilled
      if (isFieldsNotFilled) {
        const isFirstNameFieldNotFilled = !isFirstNameFieldFilled
        if (isFirstNameFieldNotFilled) {
          msg += 'Поле \"Фамилия пользователя\" не заполнено\n'
        }
        const isSecondNameFieldNotFilled = !isSecondNameFieldFilled
        if (isSecondNameFieldNotFilled) {
          msg += 'Поле \"Имя пользователя\" не заполнено\n'
        }
        const isThirdNameFieldNotFilled = !isThirdNameFieldFilled
        if (isThirdNameFieldNotFilled) {
          msg += 'Поле \"Отчество пользователя\" не заполнено\n'
        }
        setIsDialogVisible(true)
        setDialogMessage(msg)
      }
    }
  }

  const goToActivity = (navigation, activityName, params = {}) => {
    navigation.navigate(activityName, params)
  }

  useEffect(() => {
    db.transaction(async transaction => {
      const sqlStatement = `SELECT * FROM users WHERE _id = ${userId};`
      await transaction.executeSql(sqlStatement, [], (tx, receivedUsers) => {
        let tempReceivedUsers = []
        Array.from(receivedUsers.rows).forEach((userItemRow, userRowIdx) => {
          const user = Object.values(receivedUsers.rows.item(userRowIdx))
          tempReceivedUsers = [
            ...tempReceivedUsers,
            {
              id: user[0],
              login: user[1],
              password: user[2],
              firstName: user[8],
              secondName: user[9],
              thirdName: user[10]
            }
          ]
        })
        setUsers(tempReceivedUsers)
      })
    })
  }, [userId])

  useEffect(() => {
    const countUsers = users.length
    const isUserFound = countUsers >= 1
    if (isUserFound) {
      const detectedUser = users[0]
      setUser(detectedUser)
      
    }
  }, [users])

  navigation.setOptions({
    headerRight: () => (
      <TouchableOpacity
        onPress={() => saveData()}
      >
        <Text>
          Сохранить
        </Text>
      </TouchableOpacity>
    )
  })

  return (
    <View
      style={styles.profileDataActivityContainer}
    >
      <Text>
        {
          userId
        }
      </Text>
      <Text
        style={styles.profileDataActivityContainerLabel}
      >
        Фамилия пользователя
      </Text>
      <TextInput
        value={firstName}
        onChangeText={(value) => setFirstName(value)}
        style={styles.profileDataActivityContainerInputField}
      />
      <Text
        style={styles.profileDataActivityContainerLabel}
      >
        Имя пользователя
      </Text>
      <TextInput
        value={secondName}
        onChangeText={(value) => setSecondName(value)}
        style={styles.profileDataActivityContainerInputField}
      />
      <Text
        style={styles.profileDataActivityContainerLabel}
      >
        Отчество пользователя
      </Text>
      <TextInput
        value={thirdName}
        onChangeText={(value) => setThirdName(value)}
        style={styles.profileDataActivityContainerInputField}
      />
      <Text
        style={styles.profileDataActivityContainerLabel}
      >
        Дата рождения
      </Text>
      <SelectDropdown
        defaultButtonText={'\n'}
        data={borns}
        onSelect={(selectedItem, index) => {
          setBorn(selectedItem)
        }}
        buttonTextAfterSelection={(selectedItem, index) => {
          return selectedItem
        }}
        rowTextForSelection={(item, index) => {
          return item
        }}
        style={styles.addAmountActivityContainerDropDown}
        renderDropdownIcon={() => <Entypo name="chevron-down" size={24} color="black" />}
      />
      <Text
        style={styles.profileDataActivityContainerLabel}
      >
        Пол
      </Text>
      <View
        style={styles.profileDataActivityContainerRow}
      >
        <View
          style={styles.profileDataActivityContainerRowItem}
        >
          <RadioButton
            value="Мужской"
            label="Мужской"
            status={gender.checked === 'Мужской' ? 'checked' : 'unchecked'}
            onPress={() => { setGender({ checked: 'Мужской' }) }}
          />
          <Text
            style={styles.profileDataActivityContainerRowItemLabel}
          >
            Мужской
          </Text>
        </View>
        <View
          style={styles.profileDataActivityContainerRowItem}
        >
          <RadioButton
            value="Женский"
            label="Женский"
            status={gender.checked === 'Женский' ? 'checked' : 'unchecked'}
            onPress={() => { setGender({ checked: 'Женский' }) }}
          />
          <Text
            style={styles.profileDataActivityContainerRowItemLabel}
          >
            Женский
          </Text>
        </View>
      </View>
      <Dialog
        visible={isDialogVisible}
        onDismiss={() => setIsDialogVisible(false)}>
        <Dialog.Title>Сообщение</Dialog.Title>
        <Dialog.Content>
          <Text>
            {
              dialogMessage
            }
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button title="ОК" onPress={() => setIsDialogVisible(false)} />
        </Dialog.Actions>
      </Dialog>
    </View>
  )
}

export function ProfileContactsActivity({ route }) {
  
  const { userId } = route.params
  
  return (
    <View>
      <Text>
        {
          userId
        }
      </Text>
      <View
        style={styles.profileContactsActivityContainerDetailRow}
      >
        <View
          style={styles.profileContactsActivityContainerDetailRowAside}
        >
          <Text
            style={styles.profileContactsActivityContainerDetailRowAsideLabel}
          >
            E-mail
          </Text>
          <Text
            style={styles.profileContactsActivityContainerDetailRowAsideName}
          >
            xxx888xxx888xxx888xxx@mail.ru
          </Text>
        </View>
        <Entypo name="chevron-right" size={24} color="black" />
      </View>
      <View
        style={styles.profileContactsActivityContainerRow}
      >
        <Entypo name="check" size={24} color="black" />
        <Text
          style={styles.profileContactsActivityContainerRowLabel}
        >
          Телефон подтвержден
        </Text>
      </View>
      <View
        style={styles.profileContactsActivityContainerDetailRow}
      >
        <View
          style={styles.profileContactsActivityContainerDetailRowAside}
        >
          <Text
            style={styles.profileContactsActivityContainerDetailRowAsideLabel}
          >
            Телефон
          </Text>
          <Text
            style={styles.profileContactsActivityContainerDetailRowAsideName}
          >
            89999999999
          </Text>
        </View>
        <Entypo name="chevron-right" size={24} color="black" />
      </View>
      <View
        style={styles.profileContactsActivityContainerRow}
      >
        <Entypo name="check" size={24} color="black" />
        <Text
          style={styles.profileContactsActivityContainerRowLabel}
        >
          Телефон подтвержден
        </Text>
      </View>
    </View>
  )
}


export function ProfilePasswordActivity({ navigation, route }) {
  
  const { userId } = route.params
  
  const [currentPassword, setCurrentPassword] = useState('')
  
  const [newPassword, setNewPassword] = useState('')

  const [confirmPassword, setConfirmPassword] = useState('')
  
  const [isDialogVisible, setIsDialogVisible] = useState(false)

  const [dialogMessage, setDialogMessage] = useState('')

  const [users, setUsers] = useState([

  ])

  const [user, setUser] = useState({
    id: 0,
    login: '',
    password: '',
    firstName: '',
    secondName: '',
    thirdName: ''
  })

  const goToActivity = (navigation, activityName, params = {}) => {
    navigation.navigate(activityName, params)
  }

  const changePassword = () => {
    const userPassword = user.password
    const isPasswordMatches = currentPassword === userPassword
    const isPasswordsMatches = newPassword === confirmPassword
    const currentPasswordFieldLength = currentPassword.length
    const isCurrentPasswordFieldFilled = currentPasswordFieldLength >= 1
    const newPasswordFieldLength = newPassword.length
    const isNewPasswordFieldFilled = newPasswordFieldLength >= 1
    const confirmPasswordFieldLength = confirmPassword.length
    const isConfirmPasswordFieldFilled = confirmPasswordFieldLength >= 1
    const isFieldsFilled = isCurrentPasswordFieldFilled && isNewPasswordFieldFilled && isConfirmPasswordFieldFilled
    const isCanUpdate = isPasswordsMatches && isPasswordMatches && isFieldsFilled
    if (isCanUpdate) {
      let sqlStatement = `UPDATE users SET password = ${newPassword} WHERE _id = ${userId};`
      db.transaction(transaction => {
        transaction.executeSql(sqlStatement, [], (tx, receivedUsers) => {  
          goToActivity(navigation, 'PersonalAreaActivity', {
            userId: userId
          })  
        })
      })
    } else {
      let msg = ''
      const isFieldsNotFilled = !isFieldsFilled
      if (isFieldsNotFilled) {
        const isCurrentPasswordFieldNotFilled = !isCurrentPasswordFieldFilled
        if (isCurrentPasswordFieldNotFilled) {
          msg += 'Поле \"Текущий пароль\" не заполнено\n'
        }
        const isNewPasswordFieldNotFilled = !isNewPasswordFieldFilled
        if (isNewPasswordFieldNotFilled) {
          msg += 'Поле \"Новый пароль\" не заполнено\n'
        }
        const isConfirmPasswordFieldNotFilled = !isConfirmPasswordFieldFilled
        if (isConfirmPasswordFieldNotFilled) {
          msg += 'Поле \"Повторите пароль\" не заполнено\n'
        }
        const isPasswordNotMatches = !isPasswordMatches
        if (isPasswordNotMatches) {
          msg += 'Поле \"Текущий пароль\" не совпадает\n'
        }
        const isPasswordsNotMatches = !isPasswordsMatches
        if (isPasswordsNotMatches) {
          msg += 'Поля \"Новый пароль\" и \"Повторите пароль\" не совпадают\n'
        }
        setIsDialogVisible(true)
        setDialogMessage(msg)
      }
    }
  }

  useEffect(() => {
    db.transaction(async transaction => {
      const sqlStatement = `SELECT * FROM users WHERE _id = ${userId};`
      await transaction.executeSql(sqlStatement, [], (tx, receivedUsers) => {
        let tempReceivedUsers = []
        Array.from(receivedUsers.rows).forEach((userItemRow, userRowIdx) => {
          const user = Object.values(receivedUsers.rows.item(userRowIdx))
          tempReceivedUsers = [
            ...tempReceivedUsers,
            {
              id: user[0],
              login: user[1],
              password: user[2],
              firstName: user[8],
              secondName: user[9],
              thirdName: user[10]
            }
          ]
        })
        setUsers(tempReceivedUsers)
      })
    })
  }, [userId])

  useEffect(() => {
    const countUsers = users.length
    const isUserFound = countUsers >= 1
    if (isUserFound) {
      const detectedUser = users[0]
      setUser(detectedUser)
    }
  }, [users])

  return (
    <View
      style={styles.profilePasswordActivityContainer}
    >
      <Text>
        {
          userId
        }
      </Text>
      <Text
        style={styles.profilePasswordActivityContainerHelpLabel}
      >
        {
          'После изменения пароля произойдет выход\nиз аккаунта на всех устройствах, сайтах и\nприложениях, где вошли с текущим паролем.'
        }
      </Text>
      <TextInput
        placeholder={'Текущий пароль'}
        secureTextEntry={true}
        value={currentPassword}
        onChangeText={(value) => setCurrentPassword(value)}
        style={styles.profilePasswordActivityContainerInputField}
      />
      <TextInput
        placeholder={'Новый пароль'}
        secureTextEntry={true}
        value={newPassword}
        onChangeText={(value) => setNewPassword(value)}
        style={styles.profilePasswordActivityContainerInputField}
      />
      <TextInput
        placeholder={'Повторите пароль'}
        secureTextEntry={true}
        value={confirmPassword}
        onChangeText={(value) => setConfirmPassword(value)}
        style={styles.profilePasswordActivityContainerInputField}
      />
      <View
        style={styles.profilePasswordActivityContainerSeparator}
      >

      </View>
      <Button
        color={'rgb(200, 200, 0)'}
        title={'Изменить пароль'}
        onPress={() => changePassword()}
      />
      <Dialog
        visible={isDialogVisible}
        onDismiss={() => setIsDialogVisible(false)}>
        <Dialog.Title>Сообщение</Dialog.Title>
        <Dialog.Content>
          <Text>
            {
              dialogMessage
            }
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button title="ОК" onPress={() => setIsDialogVisible(false)} />
        </Dialog.Actions>
      </Dialog>
    </View>
  )
}


export function ProfileSubsActivity({ route }) {
  
  const { userId } = route.params
  
  return (
    <View
      style={styles.profileSubsActivityContainer}
    >
      <Text>
        {
          userId
        }
      </Text>
      <View
        style={styles.profileSubsActivityContainerItem}
      >
        <Text
          style={styles.profileSubsActivityContainerItemLabel}
        >
          Рекламно-информационная рассылка
        </Text>
        <Entypo name="chevron-right" size={24} color="black" />
      </View>
      <View
        style={styles.profileSubsActivityContainerItem}
      >
        <Text
          style={styles.profileSubsActivityContainerItemLabel}
        >
          {
            'Рассылка счетов ООО \"МосОблЕИРЦ\"'
          }
        </Text>
        <Entypo name="chevron-right" size={24} color="black" />
      </View>
    </View>
  )
}


export function ProfileSecurityActivity({ route }) {
  
  const { userId } = route.params
  
  const [isPinCode, setIsPinCode] = useState(false)

  return (
    <View
      style={styles.profileSecurityActivityContainer}
    >
      <Text>
        {
          userId
        }
      </Text>
      <Text
        style={styles.profileSecurityActivityContainerHeader}
      >
        Использование PIN-кода
      </Text>
      <View
        style={styles.profileSecurityActivityContainerRow}
      >
        <Text
          style={styles.profileSecurityActivityContainerRowLabel}
        >
          Вход по PIN-коду
        </Text>
        <Switch
          value={isPinCode}
          onValueChange={(value) => setIsPinCode(value)}
        />
      </View>
      <Text
        style={styles.profileSecurityActivityContainerHelpLabel}
      >
        {
          'При входе в приложение потребуется ввести код\nдля подтверждения доступа.'
        }
      </Text>
      <View
        style={styles.profileSecurityActivityContainerRow}
      >
        <Text
          style={styles.profileSecurityActivityContainerRowLabel}
        >
          Вход по PIN-коду
        </Text>
        <Entypo name="chevron-right" size={24} color="black" />
      </View>
    </View>
  )
}

export function ProfileAccountsActivity({ route }) {
  
  const { userId } = route.params
  
  return (
    <View
      style={styles.profileAccountsActivityContainer}
    >
      <Text>
        {
          userId
        }
      </Text>
      <View
        style={styles.profileAccountsActivityContainerRow}
      >
        <View
          style={styles.profileAccountsActivityContainerRowAside}
        >
          <Ionicons name="chatbubble-sharp" size={24} color={'rgb(255, 0, 0)'} />
          <Text
            style={styles.profileAccountsActivityContainerRowAsideLabel}
          >
            {
              'Официальный сайт Мэра\nМосквы (mos.ru)'
            }
          </Text>
        </View>
        <View>
          <Button
            title={'Связать'}
          />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  mainActivityContainer: {

  },
  mainActivityContainerWelcomeLabel: {
    fontSize: 24,
    marginVertical: 25
  },
  mainActivityContainerInputField: {
    borderBottomColor: 'rgb(0, 0, 0)',
    borderBottomWidth: 1
  },
  mainActivityContainerForgotPasswordLabel: {
    textAlign: 'center'
  },
  mainActivityContainerLoginBtn: {

  },
  mainActivityContainerLoginOrLabel: {
    textAlign: 'center'
  },
  mainActivityContainerLoginDrivenBtn: {

  },
  mainActivityContainerRegisterRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  }, 
  mainActivityContainerHelpRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  mainActivityContainerHelpRowItem: {
    display: 'flex',
    flexDirection: 'row'
  },
  mainActivityContainerHelpOfficialSitesLabel: {
    textAlign: 'center'
  },
  mainPageActivityContainer: {

  },
  mainPageActivityContainerTabs: {
    
  },
  mainPageActivityContainerTab: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    // backgroundColor: 'rgb(200, 200, 200)',
    marginHorizontal: 5,
    borderTopStartRadius: 8,
    borderTopEndRadius: 8
  },
  mainPageActivityContainerAmount: {
    // display: 'flex',
    // flexDirection: 'column',
    // alignItems: 'center',
    // width: '100%'
  },
  mainPageActivityContainerAmountHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  mainPageActivityContainerAmountHeaderAddress: {

  },
  mainPageActivityContainerAmountCostLabel: {
    textAlign: 'center'
  },
  mainPageActivityContainerAmountCostValue: {
    textAlign: 'center',
    fontSize: 36
  },
  mainPageActivityContainerAmountMoreBtnWrapContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  mainPageActivityContainerAmountMoreBtnWrap: {
    width: 175
  },
  mainPageActivityContainerAmountMoreBtn: {
    
  },
  mainPageActivityContainerAmountNotificationsBtnWrapContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  mainPageActivityContainerAmountNotificationsBtnWrap: {
    width: 275
  },
  mainPageActivityContainerAmountNotificationsBtn: {

  },
  mainPageActivityContainerAmountActions: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  mainPageActivityContainerAmountActionsItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginHorizontal: 15
  },
  mainPageActivityContainerAmountActionsItemLabel: {
    textAlign: 'center'
  },
  morePageActivityContainer: {

  },
  morePageActivityContainerItem: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgb(175, 175, 175)',
    borderRadius: 8,
    padding: 15,
    margin: 15
  },
  morePageActivityContainerItemAside: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '25%'
  },
  morePageActivityContainerItemLabel: {

  },
  profileActivityContainer: {

  },
  profileActivityContainerAvatarContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  profileActivityContainerAvatar: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 1000,
    width: 250,
    height: 250,
    backgroundColor: 'rgb(175, 175, 175)'
  },
  profileActivityContainerAvatarLabel: {
    fontSize: 48,
    fontWeight: '900'
  },
  profileActivityContainerFullName: {
    textAlign: 'center'
  },
  profileActivityContainerItems: {

  },
  profileActivityContainerItem: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  profileActivityContainerItemLabel: {

  },
  profileActivityContainerLogoutLabel: {
    color: 'rgb(0, 0, 255)'
  },
  registerActivityContainer: {

  },
  registerActivityContainerInputField: {
    borderBottomColor: 'rgb(0, 0, 0)',
    borderBottomWidth: 1
  },
  registerActivityContainerSubscription: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  registerActivityContainerSubscriptionAside: {

  },
  registerActivityContainerSubscriptionAsideLabel: {

  },
  registerActivityContainerSubscriptionAsideWarning: {
    color: 'rgb(255, 0, 0)'
  },
  registerActivityContainerAgreement: {

  },
  registerActivityContainerRegisterLabel: {
    textAlign: 'right',
    color: 'rgb(200, 200, 0)'
  },
  addAmountActivityContainer: {

  },
  addAmountActivityContainerDropDown: {
    width: '100%'
  },
  addAmountActivityContainerInputField: {
    borderBottomColor: 'rgb(0, 0, 0)',
    borderBottomWidth: 1
  },
  addAmountActivityContainerEmail: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  contactsActivityContainer: {

  },
  contactsActivityContainerDropDown: {

  },
  contactsActivityContainerItem: {
    backgroundColor: 'rgb(255, 255, 255)',
    padding: 15
  },
  contactsActivityContainerItemFooter: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  contactsActivityContainerItemFooterLabel: {
    marginLeft: 25,
    color: 'rgb(200, 200, 200)'
  },
  contactsMapActivityMapContainer: {
    height: 500
  },
  contactsMapActivityMap: {
    width: Dimensions.get('window').width,
    height: '100%'
  },
  paymentsAndTransfersActivityContainer: {

  },
  paymentsAndTransfersActivityContainerHeader: {
    fontSize: 36,
    textAlign: 'center'
  },
  paymentsAndTransfersActivityContainerColumns: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  paymentsAndTransfersActivityContainerColumn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '50%'
  },
  paymentsAndTransfersActivityContainerItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  paymentsAndTransfersActivityContainerItemLabel: {
    color: 'rgb(200, 200, 0)',
    textAlign: 'center'
  },
  chatPageActivityContainer: {

  },
  chatPageActivityContainerScroll: {
  
  },
  chatPageActivityContainerScrollWrap: {
    height: Dimensions.get('window').height / 100 * 70
  },
  chatPageActivityContainerMessage: {
    padding: 15,
    margin: 15,
    backgroundColor: 'rgb(255, 255, 255)',
    width: '35%'
  },
  chatPageActivityContainerMessageLabel: {
    color: 'rgb(200, 200, 200)'
  },
  chatPageActivityContainerFooter: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  chatPageActivityContainerFooterInput: {
    width: '75%'
  },
  questionsHistoryActivityContainer: {

  },
  questionsHistoryActivityContainerSelectQuestionLabel: {
    fontSize: 18
  },
  questionsHistoryActivityContainerQuestion: {
    backgroundColor: 'rgb(255, 255, 255)',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    margin: 15,
    borderBottomColor: 'rgb(175, 175, 175)',
    borderWidth: 1
  },
  questionsHistoryActivityContainerQuestionLabel: {
    
  },
  paymentActivityHeader: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  paymentActivityHeaderLabel: {
    marginLeft: 15
  },
  paymentActivityContainer: {

  },
  paymentActivityContainerAddressLabel: {

  },
  paymentActivityContainerCostLabel: {
    textAlign: 'center'
  },
  paymentActivityContainerCostInput: {
    fontSize: 24,
    textAlign: 'center'
  },
  paymentActivityContainerMethodLabel: {
    textAlign: 'center'
  },
  paymentActivityContainerMethod: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  paymentActivityContainerMethodAside: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  paymentActivityContainerMethodImg: {
    width: 25,
    height: 25
  },
  paymentActivityContainerMethodName: {
    marginLeft: 15
  },
  paymentActivityContainerAgreement: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  paymentActivityContainerAgreementLabel: {

  },
  paymentActivityContainerDetailsLabel: {
    textAlign: 'center'
  },
  paymentActivityContainerSupportedCardsLabel: {
    textAlign: 'center'
  },
  paymentActivityContainerSupportedCards: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  paymentActivityContainerSupportedCard: {
    
  },
  paymentActivityContainerCashback: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'rgb(225, 225, 255)'
  },
  paymentActivityContainerCashbackInfo: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  paymentActivityContainerCashbackInfoLabel: {

  }, 
  paymentActivityContainerCashbackDetailsLabel: {

  },
  profileAccountsActivityContainer: {

  },
  profileAccountsActivityContainerRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgb(150, 150, 150)'
  },
  profileAccountsActivityContainerRowAside: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  profileAccountsActivityContainerRowAsideLabel: {
    marginLeft: 75
  },
  profileSecurityActivityContainer: {

  },
  profileSecurityActivityContainerHeader: {
    color: 'rgb(0, 0, 255)',
    fontWeight: '900',
    padding: 15,
    borderBottomColor: 'rgb(150, 150, 150)',
    borderBottomWidth: 1
  },
  profileSecurityActivityContainerRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomColor: 'rgb(150, 150, 150)',
    borderBottomWidth: 1
  },
  profileSecurityActivityContainerRowLabel: {
    fontSize: 18
  },
  profileSecurityActivityContainerHelpLabel: {
    color: 'rgb(200, 200, 200)',
    fontWeight: '900',
    padding: 15,
    borderBottomColor: 'rgb(150, 150, 150)',
    borderBottomWidth: 1
  },
  profileSubsActivityContainer: {

  },
  profileSubsActivityContainerItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomColor: 'rgb(150, 150, 150)',
    borderBottomWidth: 1
  },
  profileSubsActivityContainerItemLabel: {
    fontSize: 18
  },
  profileContactsActivityContainer: {

  },
  profileContactsActivityContainerDetailRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomColor: 'rgb(150, 150, 150)',
    borderBottomWidth: 1,
    alignItems: 'center',
    backgroundColor: 'rgb(255, 255, 255)'
  },
  profileContactsActivityContainerDetailRowAside: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileContactsActivityContainerDetailRowAsideLabel: {
    color: 'rgb(200, 200, 200)',
    fontSize: 18
  },
  profileContactsActivityContainerDetailRowAsideName: {
    marginLeft: 75,
    fontSize: 16
  },
  profileContactsActivityContainerRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: 15,
    borderBottomColor: 'rgb(150, 150, 150)',
    borderBottomWidth: 1,
    alignItems: 'center',
    backgroundColor: 'rgb(255, 255, 255)'
  },
  profileContactsActivityContainerRowLabel: {
    color: 'rgb(0, 0, 255)',
    fontSize: 14,
    marginLeft: 75
  },
  profilePasswordActivityContainer: {

  },
  profilePasswordActivityContainerHelpLabel: {
    
  },
  profilePasswordActivityContainerInputField: {
    borderBottomColor: 'rgb(0, 0, 0)',
    borderBottomWidth: 1
  },
  profilePasswordActivityContainerSeparator: {
    marginTop: 75,
    borderBottomWidth: 1,
    borderBottomColor: 'rgb(0, 0, 0)'
  },
  profileDataActivityContainer: {

  },
  profileDataActivityContainerLabel: {
    color: 'rgb(200, 200, 200)'
  },
  profileDataActivityContainerInputField: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgb(0, 0, 0)'
  },
  profileDataActivityContainerRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  profileDataActivityContainerRowItem: {
    display: 'flex',
    flexDirection: 'row',
    marginLeft: 50,
    alignItems: 'center'
  },
  profileDataActivityContainerRowItemLabel: {
    marginLeft: 25
  } 
})
