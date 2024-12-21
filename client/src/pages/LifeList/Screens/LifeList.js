import React, { useEffect } from "react";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { layoutStyles } from "../../../styles";
import { useAuth } from "../../../contexts/AuthContext";
import HeaderStack from "../../../components/Headers/HeaderStack";
import Icon from "../../../components/Icons/Icon";
import { iconStyles } from "../../../styles/iconStyles";
import NavigatorContainer from "../Navigation/NavigatorContainer";
import { useLifeList } from "../../../contexts/LifeListContext";

export default function LifeList({ route }) {
  const { currentUser } = useAuth();
  const navigation = useNavigation();
  const { userId } = route.params || currentUser;

  const { lifeLists, initializeLifeListCache, isLifeListCacheInitialized } =
    useLifeList();

  const lifeList = lifeLists[userId] || { experiences: [] };

  // Initialize LifeList cache for the user
  useEffect(() => {
    if (!isLifeListCacheInitialized[userId]) {
      initializeLifeListCache(userId);
    }
  }, [initializeLifeListCache, isLifeListCacheInitialized, userId]);

  return (
    <View style={layoutStyles.wrapper}>
      <HeaderStack
        arrow={
          <Icon
            name="chevron.backward"
            onPress={() => navigation.goBack()}
            style={iconStyles.backArrow}
            weight="semibold"
          />
        }
        title={`LifeList`}
        button1={
          <Icon
            name="line.3.horizontal"
            style={iconStyles.list}
            onPress={() =>
              navigation.navigate("ListView", {
                userId,
              })
            }
          />
        }
      />
      <NavigatorContainer lifeList={lifeList} navigation={navigation} />
    </View>
  );
}
