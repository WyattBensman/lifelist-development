import { View } from "react-native";
import LifeListLogo from "../Icons/LifeListLogo";
import CreateCollageIcon from "../Icons/CreateCollageIcon";
import InboxIcon from "../Icons/InboxIcon";
import { layoutStyles } from "../../../styles";
import { useNavigation } from "@react-navigation/native";
import HeaderMain from "../../../components/Headers/HeaderMain";
import AuthService from "../../../utils/AuthService";
import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_USER_PROFILE } from "../../../utils/queries/userQueries";

export default function MainFeed() {
  const navigation = useNavigation();
  /*   const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await AuthService.getUser();
      setUserId(userData.id);
    };

    fetchUser();
  }, []);

  console.log(userId); */
  userId = "663a3129e0ffbeff092b81d4";

  const { data, loading, error } = useQuery(GET_USER_PROFILE, {
    variables: { userId: userId },
    skip: !userId, // Skip the query if userId is not yet set
  });

  console.log(data, loading, error);

  return (
    <View style={layoutStyles.wrapper}>
      <HeaderMain
        titleComponent={<LifeListLogo />}
        icon1={<CreateCollageIcon />}
        icon3={<InboxIcon />}
      />
    </View>
  );
}
