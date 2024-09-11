import {useState, useEffect} from 'react'
import browserStorage from 'store'

export default (key,data) =>{
    const [state, setIntialState] = useState(data);
    useEffect(()=>{

        const browserStorageVal = browserStorage.get(key)

        if(key){
            setIntialState(browserStorageVal)
        }

    },[])

    const setState = (newState) =>{
        browserStorage.set(key,newState);
        return newState;
    }
    return [state, setState]
}