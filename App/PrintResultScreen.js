import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, Slider, FlatList} from 'react-native';
import { List, ListItem } from "react-native-elements";
import ProgressCircle from 'react-native-progress-circle'

export default class PrintResultScreen extends React.Component
{
  static navigationOptions = {
    title: 'Game results',
  };

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
      <List>
        <FlatList
           data={this.state.responseList}
             renderItem={({item}) => (<ListItem
               title={item.name}
               subtitle={<Text style={{fontSize:11, color:"dimgray", fontWeight:"bold"}}>{item.sentence}</Text>}

               rightTitle={String(item.turn)}
               rightIcon={<ProgressCircle
            percent={item.comparison * 100}
            radius={30}
            borderWidth={8}
            color="#3399FF"
            shadowColor="#999"
            bgColor="#fff"
        >
            <Text style={{ fontSize: 11 }}>{(item.comparison * 100).toFixed(1)}</Text>
        </ProgressCircle>}

               />)}
               />
      </List>
    )
  }
}
