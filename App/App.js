import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, Slider, FlatList } from 'react-native';
import { createStackNavigator } from 'react-navigation';

export class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Button
          title="New Game"
          onPress={() => this.props.navigation.navigate('NewGame')}
        />

      </View>
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
    this.state = {responseList : [{key:0, name:"rien", sentence:"rien non plus"}], value: 0}
    const {navigation} = props;
    const name = navigation.getParam('name', 'null');
    const url = 'https://safe-everglades-47426.herokuapp.com/game?name=' + name
    fetch(url)
      .then((response) => {
        return (response.json());
      })
      .then((data) => {
        for (var i = 0; i < data.length; i++)
        {
          data[i].key = i;
        }
        this.setState({responseList: data});
      })
  }
  render() {

    return(
      //<View><Text>Bite {JSON.stringify(this.state.responseList)}</Text></View>
      <FlatList
         data={this.state.responseList}
           ItemSeparatorComponent= {() => {return (<View style={{height:2, width:"86%", backgroundColor: "#CED0CE", marginLeft: "14%"}}/>)}}
           renderItem={({item}) => <View style={{flexDirection:'row', marginTop:'5%', marginLeft:'4%'}}>

           <View style={{flexDirection:"column", marginLeft:"2%"}}>
           <Text style={{fontSize:17, fontWeight: 'bold'}}>{item.name}</Text>
           <Text style={{fontSize:17, fontWeight: 'bold'}}>{item.sentence}</Text>
           </View>
           </View>}
/>
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
