import React from 'react';
import {
    Text,
    View,
    StyleSheet,
    Image,
    Dimensions,
    Animated,
    PanResponder,
    StatusBar
} from 'react-native';

const { width, height } = Dimensions.get('window');

const cards = [
    { id : 1, path : require('../assets/images/leaves.jpg') },
    { id : 2, path : require('../assets/images/nature.jpg') },
    { id : 3, path : require('../assets/images/forest.jpg') }
]


const HomeScreen = props => {
    const imagePos = new Animated.ValueXY({x : 0, y : 0});
    const [currentIndex, setCurrentIndex] = React.useState(cards.length - 1);

    React.useEffect(() => {
        imagePos.setValue({x : 0, y : 0})
    }, [currentIndex])

    const rotate = imagePos.x.interpolate({
        inputRange : [-width / 2, 0, width / 2],
        outputRange : ['-10deg', '0deg', '10deg'],
        extrapolate : 'clamp'
    })

    const seenTextLiked = imagePos.x.interpolate({
        inputRange : [-100, 0, 100],
        outputRange : [0, 0 ,1],
        extrapolate : 'clamp'
    })

    const seenTextDisliked = imagePos.x.interpolate({
        inputRange : [-100, 0, 100],
        outputRange : [1, 0, 0],
        extrapolate : 'clamp'
    })

    const backCardOpacity = imagePos.x.interpolate({
        inputRange : [-100, 0, 100],
        outputRange : [1, 0, 1],
        extrapolate : 'clamp'
    });

    const backCardScale = imagePos.x.interpolate({
        inputRange : [-100, 0, 100],
        outputRange : [1, 0.8, 1],
        extrapolate : 'clamp'
    })

    const rotateAndTranslate = {
        transform : [
            {
                rotate
            },
            ...imagePos.getTranslateTransform()  
        ]
    }

    _panResponder = PanResponder.create({
        onStartShouldSetPanResponder : (evt, gestureState) => {return true},

        // ON MOVE HANDLER
        onPanResponderMove: (evt, gestureState) => {
            imagePos.setValue({x : gestureState.dx, y : gestureState.dy})
        },

        // ON RELEASE HANDLER
        onPanResponderRelease: (evt, gestureState) => {
            if (gestureState.dx < width / 4) {
                Animated.spring(imagePos, {toValue : {x : 0, y : 0}, friction : 4}).start()
            } else {
                Animated.spring(imagePos, {toValue : {x : width + 300, y : gestureState.dy}, duration : 400}).start(() => {
                    setCurrentIndex(current => current - 1)
                })
            }
        },
    
      });

    const renderCards = () => {

        return cards.map((card, i) => {
            if (i > currentIndex) {
                return null;
            } else if (i === currentIndex) {
                return (
                    <Animated.View key={card.id} {..._panResponder.panHandlers} style={{...styles.imageContainer, ...rotateAndTranslate}} >
                        <Animated.View style={{...styles.likeDislikeTextContainer, left : 50, borderColor : 'green', opacity : seenTextLiked, transform : [{rotate : '-30deg'}]}}>
                            <Text style={{color : 'green', fontSize : 32, fontWeight : '700'}}>LIKE</Text>
                        </Animated.View>

                        <Animated.View style={{...styles.likeDislikeTextContainer, right : 30, borderColor : 'red', opacity : seenTextDisliked, transform : [{rotate : '30deg'}]}}>
                            <Text style={{color : 'red', fontSize : 30, fontWeight : '700'}}>DISLIKE</Text>
                        </Animated.View>
                        
                        <Image
                            source={card.path}
                            style={{...styles.image}}
                            /> 
                    </Animated.View>
                )
            } else {
                return (
                    <Animated.View key={card.id} style={{...styles.imageContainer, opacity : backCardOpacity, transform : [{scale : backCardScale}]}} >
                        <Animated.View style={{...styles.likeDislikeTextContainer, left : 50, borderColor : 'green', opacity : 0, transform : [{rotate : '-30deg'}]}}>
                            <Text style={{color : 'green', fontSize : 32, fontWeight : '700'}}>LIKE</Text>
                        </Animated.View>

                        <Animated.View style={{...styles.likeDislikeTextContainer, right : 30, borderColor : 'red', opacity : 0, transform : [{rotate : '30deg'}]}}>
                            <Text style={{color : 'red', fontSize : 30, fontWeight : '700'}}>DISLIKE</Text>
                        </Animated.View>
                        
                        <Image
                            source={card.path}
                            style={{...styles.image}}
                            /> 
                    </Animated.View>
                )
            }


        }
        )
    }

    return (
        <View style={{...styles.container}}>
            <View style={{...styles.header}}>
            </View>

            <View style={{flex : 1}}>
                {renderCards()}
            </View>

            <View style={{...styles.footer}}>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    header : {
        height : 60
    },
    footer : {
        height : 60
    },
    container : {
        flex : 1,
    },
    cardContainer : {
        flex : 1,
        backgroundColor : 'white',
        justifyContent : 'center',
        alignItems : 'center'
    },

    imageContainer : {
        position : 'absolute',
        borderRadius : 15
    },

    image : {
        height : height * 9 / 10,
        width : width * 9 / 10,
        marginLeft : width / 20,
        borderRadius : 15
    },

    likeDislikeTextContainer : {
        position : 'absolute',
        top : 30,
        zIndex : 2,
        borderWidth : 4, 
        paddingVertical : 5,
        paddingHorizontal : 10
    }

})

export default HomeScreen;