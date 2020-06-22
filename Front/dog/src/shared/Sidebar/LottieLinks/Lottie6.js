import React from 'react'
import Lottie from 'react-lottie';
import animationData from './hive.json';

// const container = useRef(null)

// useEffect(() => {
//   lottie.loadAnimation({
//     container: container.current,
//     renderer: 'svg',
//     loop: true,
//     autoplay: true,
//     animationData: require('./office.json')
//   })
// }, [])

// return (
//   <div className="App">
//     <h1>React Lottie Demo</h1>
//     <div className="container" ref={container}></div>
//   </div>
// );
// } 

//    ^^^ THIS IS ANOTHER WAY TO USE LOTTIE IN REACT WITH ALL THE METHODS
const Lottie6 = () => {
    let _lottieHeartRef;

    
    const onRefLottie = (ref) => {
        _lottieHeartRef = ref;
    } 
    

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
            progressiveLoad: true
        }
        };
        return (
                            <Lottie
                            ref={onRefLottie}
                            options={defaultOptions}
                            isClickToPauseDisabled={true}
                            height={60}
                            width={60}
                            />


            
        )
    
}

export default Lottie6;