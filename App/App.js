import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, Slider, FlatList} from 'react-native';
import { List, ListItem } from "react-native-elements";
import { createStackNavigator } from 'react-navigation';

export class App extends React.Component {
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
  render() {
    return (
      <List>
        <Button
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

class NewGameScreen extends React.Component {
  constructor()
  {
    super()
    this.state = {value:2, name:"Name", sentence:"Sentence"}
  }
  render() {
    return(
      <View style={{flexDirection: 'column', alignItems: 'center'}}>
      <TextInput
      {...this.props}
      textAlign={'center'}
      style = {{width: "55%", height:"10%", borderColor: 'gray', borderWidth: 1, borderRadius: 5, marginTop:"25%"}}
      underLineColorAndroid={"transparent"}
      editable = {true}
      value={this.state.name}
      onChangeText={(text) => this.setState({name: text})}
       />
       <TextInput
       {...this.props}
       textAlign={'center'}
       style = {{width: "55%", height:"10%", borderColor: 'gray', borderWidth: 1, borderRadius: 5, marginTop:"10%", marginBottom:"10%"}}
       editable = {true}
       value={this.state.sentence}
       onChangeText={(text) => this.setState({sentence: text})}
        />
        <Text>Nombre de tour : {this.state.value}</Text>
        <Slider
          value={this.state.value}
          step={1}
          minWidth={300}
          minimumValue={1}
          maximumValue={20}
          onValueChange={(value) => this.setState({value: value})}/>
          <Button
            title="Play"
            onPress={() => {
              fetch('https://safe-everglades-47426.herokuapp.com/game', {
                  method: 'POST',
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    name: this.state.name,
                    sentence: this.state.sentence,
                    turn:this.state.value,
                  })
                })
                this.props.navigation.navigate('PrintResult', {name: this.state.name})
            }}
          />
       </View>
    )
  }
}


class PrintResultScreen extends React.Component
{
  constructor(props)
  {
    super(props);
    const {navigation} = props;
    const name = navigation.getParam('name', 'null');
    const url = 'https://safe-everglades-47426.herokuapp.com/game?name=' + name
    this.state = {responseList : [{key:"0", name:"rien", sentence:"rien non plus"}], url: url}
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
      fetch(this.state.url)
        .then((response) => {
          return (response.json());
        })
        .then((data) => {
          data.sort((a, b) => {
            if (a.turn < b.turn)
              return -1;
            else {
              return 1;
            }
        })
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

    return(
      //<View><Text>Bite {JSON.stringify(this.state.responseList)}</Text></View>
      <List>
        <FlatList
           data={this.state.responseList}
             renderItem={({item}) => (<ListItem
               title={item.name}
               subtitle={item.sentence}
               hideChevron
               rightTitle={String(item.turn)}

               />)}
               />
      </List>
    )
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
