import AuthScreen from "./home/AuthScreen";
import HomeScreen from "./home/HomeScreen";

const HomePage = () => {

    const user = false;

  return (
    
    <div>
        {user ? <HomeScreen/> : <AuthScreen/>}
    </div>
  )
}

export default HomePage