import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, Button, ScrollView, TouchableOpacity, TextInput, Switch } from 'react-native'
import { Ionicons, Entypo, FontAwesome, Feather, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import * as SQLite from 'expo-sqlite'
import { Dialog } from 'react-native-paper'
import SelectDropdown from 'react-native-select-dropdown'
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
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export function MainActivity({ navigation }) {
  
  const [login, setLogin] = useState('')
  
  const [password, setPassword] = useState('')

  const goToActivity = (navigation, activityName, params = {}) => {
    navigation.navigate(activityName, params)
  }

  return (
    <View style={styles.mainActivityContainer}>
      <Text style={styles.mainActivityContainerWelcomeLabel}>
        Добро пожаловать
      </Text>
      <TextInput
        value={login}
        onChangeText={(value) => setLogin(value)}
      />
      <TextInput
        value={password}
        onChangeText={(value) => setPassword(value)}
      />
      <Text style={styles.mainActivityContainerForgotPasswordLabel}>
        Забыли пароль?
      </Text>
      <Button
        title={'Войти'}
        onPress={() => goToActivity(navigation, 'PersonalAreaActivity')}
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
        <View
          style={styles.mainActivityContainerHelpRowItem}
        >
          <Ionicons name="location" size={24} color="black" />
          <Text>
            Контакты
          </Text>          
        </View>
        <View
          style={styles.mainActivityContainerHelpRowItem}
        >
          <Entypo name="help-with-circle" size={24} color="black" />
          <Text>
            Техподдержка
          </Text>
        </View>
      </View>
      <Text style={styles.mainActivityContainerHelpOfficialSitesLabel}>
        Официальные сайты  
      </Text>
    </View>
  )
}

const Tab = createBottomTabNavigator()

export function PersonalAreaActivity() {
  return (
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
  )
}

export function MainPageActivity({ navigation }) {
  
  const [amounts, setAmounts] = useState([
    {
      
    }
  ])

  const goToActivity = (navigation, activityName, params = {}) => {
    navigation.navigate(activityName, params)
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
            userId: 0
          })}
        >
          <Feather name="plus" size={24} color="black" />
        </TouchableOpacity>
        {
          amounts.map((amount, amountIndex) => {
            return (
              <View
                key={amountIndex}
                style={styles.mainPageActivityContainerTab}
              >
                <Text>
                  Номер счета
                </Text>
              </View>
            )
          })
        }
      </ScrollView>
      {
        true ?
          <View style={styles.mainPageActivityContainerAmount}>
            <View style={styles.mainPageActivityContainerAmountHeader}>
              <Text style={styles.mainPageActivityContainerAmountHeaderAddress}>
                Адресс проживания
              </Text>
              <Ionicons name="information-circle" size={24} color="black" />
            </View>
            <Text style={styles.mainPageActivityContainerAmountCostLabel}>
              {
                true ?
                  'Переплата'
                :
                  'Сумма к оплате'
              }
            </Text>
            <Text
              style={styles.mainPageActivityContainerAmountCostValue}
              color={
                true ?
                  'rgb(255, 0, 0)'
                :
                  'rgb(0, 150, 0)'
              }
            >
              {
                '1000'
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
              <View style={styles.mainPageActivityContainerAmountActionsItem}>
                <FontAwesome5 name="credit-card" size={48} color="black" />
                <Text style={styles.mainPageActivityContainerAmountActionsItemLabel}>
                  {
                    'Оплатить\nбез'
                  }
                </Text>
              </View>
              <View style={styles.mainPageActivityContainerAmountActionsItem}>
                <Entypo name="calculator" size={48} color="black" />
                <Text style={styles.mainPageActivityContainerAmountActionsItemLabel}>
                  {
                    'Передать\nпоказания'
                  }
                </Text>
              </View>
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
    <View>
      
    </View>
  )
}

export function QuestionsPageActivity() {
  return (
    <View>
      
    </View>
  )
}

export function ChatPageActivity() {
  return (
    <View>
      
    </View>
  )
}

export function MorePageActivity({ navigation }) {
  
  const goToActivity = (navigation, activityName, params = {}) => {
    navigation.navigate(activityName, params)
  }
  
  return (
    <View style={styles.morePageActivityContainer}>
      <View style={styles.morePageActivityContainerItem}>
        <TouchableOpacity
          style={styles.morePageActivityContainerItemAside}
          onPress={() => goToActivity(navigation, 'ProfileActivity')}
        >
          <FontAwesome name="user-circle-o" size={24} color="black" />
          <Text style={styles.morePageActivityContainerItemLabel}>
            Профиль
          </Text>
        </TouchableOpacity>
        <Entypo name="chevron-right" size={24} color="black" />
      </View>
      <View style={styles.morePageActivityContainerItem}>
        <View style={styles.morePageActivityContainerItemAside}>
          <Ionicons name="location" size={24} color="black" />
          <Text style={styles.morePageActivityContainerItemLabel}>
            Контакты
          </Text>
        </View>
        <Entypo name="chevron-right" size={24} color="black" />
      </View>
      <View style={styles.morePageActivityContainerItem}>
        <View style={styles.morePageActivityContainerItemAside}>
          <Ionicons name="information-circle" size={24} color="black" />
          <Text style={styles.morePageActivityContainerItemLabel}>
            Платежи и переводы
          </Text>
        </View>
        <Entypo name="chevron-right" size={24} color="black" />
      </View>
    </View>
  )
}

export function ProfileActivity() {
  return (
    <View style={styles.profileActivityContainer}>
      <View style={styles.profileActivityContainerAvatarContainer}>
        <View style={styles.profileActivityContainerAvatar}>
          <Text style={styles.profileActivityContainerAvatarLabel}>
            ДГ
          </Text>
        </View>
      </View>
      <Text style={styles.profileActivityContainerFullName}>

      </Text>
      <View style={styles.profileActivityContainerItems}>
        <View style={styles.profileActivityContainerItem}>
          <Text style={styles.profileActivityContainerItemLabel}>
            Личные данные
          </Text>
          <Entypo name="chevron-right" size={24} color="black" />
        </View>
        <View style={styles.profileActivityContainerItem}>
          <Text style={styles.profileActivityContainerItemLabel}>
            Личные данные
          </Text>
          <Entypo name="chevron-right" size={24} color="black" />
        </View>
        <View style={styles.profileActivityContainerItem}>
          <Text style={styles.profileActivityContainerItemLabel}>
            Личные данные
          </Text>
          <Entypo name="chevron-right" size={24} color="black" />
        </View>
        <View style={styles.profileActivityContainerItem}>
          <Text style={styles.profileActivityContainerItemLabel}>
            Личные данные
          </Text>
          <Entypo name="chevron-right" size={24} color="black" />
        </View>
        <View style={styles.profileActivityContainerItem}>
          <Text style={styles.profileActivityContainerItemLabel}>
            Личные данные
          </Text>
          <Entypo name="chevron-right" size={24} color="black" />
        </View>
        <View style={styles.profileActivityContainerItem}>
          <Text style={styles.profileActivityContainerItemLabel}>
            Личные данные
          </Text>
          <Entypo name="chevron-right" size={24} color="black" />
        </View>
      </View>
      <Text style={styles.profileActivityContainerLogoutLabel}>
        ВЫЙТИ ИЗ АККАУНТА
      </Text>
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

  const [dialoagMessage, setDialogMessage] = useState('')

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
              dialoagMessage
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

const styles = StyleSheet.create({
  mainActivityContainerWelcomeLabel: {
    fontSize: 24,
    marginVertical: 25
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
    backgroundColor: 'rgb(200, 200, 200)',
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
    justifyContent: 'space-between'
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
  }
})
