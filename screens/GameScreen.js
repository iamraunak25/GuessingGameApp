import React, { useState, useRef, useEffect } from 'react';
import { Button, View, Text, StyleSheet, Alert,ScrollView } from 'react-native';
import StartGameScreen from './StartGameScreen';
import NumberContainer from '../components/NumberContainer';
import Card from '../components/Card';

const generateRandomBetween= (min, max, exclude) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    const rndNum = Math.floor(Math.random() * (max - min)) + min;
    if (rndNum ===exclude) {
        return generateRandomBetween(min, max, exclude);
    } else{
        return rndNum;
    }
};
const renderListItem = (value, numOfRound) => (
    <View key={value} style={styles.listItem}>
      <Text style={{fontSize:20,fontWeight:'bold'}}>#{numOfRound} - </Text>
      <Text style={{fontSize:20,paddingBottom:15}}>{value}</Text>
    </View>
  );

const GameScreen = props => {
    const initialGuess = generateRandomBetween(1, 100, props.userChoice);
    const [currentGuess, setCurrentGuess] = useState(initialGuess);
    const [pastGuesses, setPastGuesses] = useState([initialGuess]);
    
    const currentLow = useRef(1);
    const currentHigh = useRef(100);

    const { userChoice, onGameOver } = props;

    useEffect(() => {
        if (currentGuess === props.userChoice) {
            onGameOver(pastGuesses.length);
        }
    }, [currentGuess, userChoice, onGameOver]);

    const nextGuessHandler = direction => {
        if ( (direction=='less' && currentGuess < props.userChoice) || (direction === 'more' && currentGuess > props.userChoice) ){
            Alert.alert('Don\'t Lie to Me', 'Tell The Truth.', [{text: 'Sorry', style: 'cancel' }]);
            return;
        }
        if(direction === 'less') {
            currentHigh.current = currentGuess;
        }
        if(direction === 'more') {
            currentLow.current = currentGuess;
        }
        const nextNumber = generateRandomBetween(currentLow.current, currentHigh.current, currentGuess);
        setCurrentGuess(nextNumber);
        setPastGuesses(curPastGuesses => [nextNumber, ...curPastGuesses]);
    }

return(
        <View style={styles.screen}>
            <Text>Opponent's Guess</Text>
            <NumberContainer>{currentGuess}</NumberContainer>
            <Card style={styles.buttonContainer}>
                <View><Button title=" - " onPress={nextGuessHandler.bind(this, 'less')}/></View>
                <View><Button title=" + " onPress={nextGuessHandler.bind(this, 'more')}/></View>
            </Card>
            <ScrollView >
            {pastGuesses.map((guess, index) =>
            renderListItem(guess, pastGuesses.length - index)
          )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        padding: 10,
        alignItems: 'center',
    },
    listItem:{
        flexDirection: 'row'
    },

    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
        width: 300,
        maxWidth: '80%',

    }
});

export default GameScreen;
