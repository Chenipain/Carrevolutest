import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, Slider, FlatList} from 'react-native';
import { List, ListItem } from "react-native-elements";
import { createStackNavigator } from 'react-navigation';
import NewGameScreen from './NewGameScreen.js'
import PrintResultScreen from './PrintResultScreen'

export class App extends React.Component {

  static navigationOptions = {
    title: 'Home',
  };


  constructor()
  {
    super()
    this.state = {responseList : [{key:"0", name:"rien", sentence:"rien non plus"}], value: 0}
    const url = 'https://safe-everglades-47426.herokuapp.com/'
    fetch(url)
      .then((response) => {
        return (response.json());
      })
      .then((data) => {
        for (var i = 0; i < data.length; i++)
        {
          data[i].key = String(i);
        }
        this.setState({responseList: data});
      })
  }

  componentDidMount() {
    this._interval = setInterval(() => {
      fetch('https://safe-everglades-47426.herokuapp.com/')
      .then((response) => {
        return (response.json());
      })
      .then((data) => {
        for (var i = 0; i < data.length; i++)
        {
          data[i].key = String(i);
        }
        this.setState({responseList: data});
      })
    }, 5000);
  }

  componentWillUnmount() {
    clearInterval(this._interval);
  }

  render() {
    return (
      <List>
        <Button
          style={{width:'25%'}}
          title="New Game"
          onPress={() => this.props.navigation.navigate('NewGame')}
        />
        <FlatList
           data={this.state.responseList}
             renderItem={({item}) => (<ListItem
               title={item.name}
               subtitle={item.sentence}
               onPress={() => {this.props.navigation.navigate('PrintResult', {name: item.name})}}/>)}
  />
      </List>
    );
  }
}


export default createStackNavigator({
  Home: App,
  NewGame: NewGameScreen,
  PrintResult : PrintResultScreen
  },
  {initialRouteName: 'Home',},
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
