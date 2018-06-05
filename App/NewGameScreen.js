import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, Slider, FlatList} from 'react-native';

export default class NewGameScreen extends React.Component {
  static navigationOptions = {
    title: 'Select Game Parameters',
  };
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
      style = {{width: "55%", height:"10%", borderColor: 'gray', borderWidth: 1, borderRadius: 5, marginTop:"5%"}}
      underLineColorAndroid={"transparent"}
      editable = {true}
      value={this.state.name}
      onChangeText={(text) => this.setState({name: text})}
       />
       <TextInput
       {...this.props}
       textAlign={'center'}
       style = {{width: "55%", height:"4%", borderColor: 'gray', borderWidth: 1, borderRadius: 5, marginTop:"4%", marginBottom:"10%"}}
       editable = {true}
       value={this.state.sentence}
       onChangeText={(text) => this.setState({sentence: text})}
        />
        <Text>Turn number : {this.state.value}</Text>
        <Slider
        style = {{marginBottom:'5%'}}
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
