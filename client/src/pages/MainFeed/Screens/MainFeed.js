import { Pressable, Text, View } from "react-native";
import LifeListLogo from "../Icons/LifeListLogo";
import CreateCollageIcon from "../Icons/CreateCollageIcon";
import InboxIcon from "../Icons/InboxIcon";
import { layoutStyles } from "../../../styles";
import HeaderMain from "../../../components/Headers/HeaderMain";
import { useAuth } from "../../../contexts/AuthContext";

export default function MainFeed() {
  const { logout, currentUser } = useAuth();

  return (
    <View style={layoutStyles.wrapper}>
      <HeaderMain
        titleComponent={<LifeListLogo />}
        icon1={<CreateCollageIcon />}
        icon3={<InboxIcon />}
      />
      <Pressable onPress={logout}>
        <Text style={{ margin: 20 }}>Logout</Text>
      </Pressable>
      {/* Display User Information */}
      <Text>{`Full Name: ${currentUser?.fullName}`}</Text>
      <Text>{`Username: ${currentUser?.username}`}</Text>
    </View>
  );
}

/* const [userId, setUserId] = useState(null);

// Fetch user ID and decode token for user data
useEffect(() => {
  const fetchUserData = async () => {
    const userData = await AuthService.getUser();
    setUserId(userData?._id);
  };
  fetchUserData();
}, []);

// Use the Apollo useQuery hook to fetch the user's profile
const { data, loading, error } = useQuery(GET_USER_PROFILE, {
  variables: { userId },
});

// Destructure data for easy access
const { fullName, username } = data?.getUserProfileById || {}; */
